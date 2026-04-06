const express      = require('express');
const router       = express.Router();
const { PROVINCES, haversine } = require('../../utils/provinces');
const settingModel = require('../../models/setting');

const GEOREF = 'https://apis.datos.gob.ar/georef/api';

async function geocodeWithGeoref(street, number, province) {
    try {
        const query = `${street} ${number}`;
        const url   = `${GEOREF}/direcciones?direccion=${encodeURIComponent(query)}&provincia=${province.indec}&max=1&campos=estandar`;
        const res   = await fetch(url, { signal: AbortSignal.timeout(5000) });
        const data  = await res.json();
        const item  = (data.direcciones || [])[0];
        if (item?.ubicacion?.lat) {
            return { lat: item.ubicacion.lat, lng: item.ubicacion.lon };
        }
    } catch { /* usa centroide como fallback */ }
    return null;
}

router.post('/', async (req, res) => {
    const { destinationProvinceId, destinationStreet, destinationNumber } = req.body;

    const destProvince = PROVINCES[parseInt(destinationProvinceId)];
    if (!destProvince) return res.status(400).json({ error: 'Provincia inválida' });

    const [originLat, originLng, originProvinceMl] = await Promise.all([
        settingModel.get('origin_lat'),
        settingModel.get('origin_lng'),
        settingModel.get('origin_province_ml'),
    ]);

    const oLat     = parseFloat(originLat     || '-34.6037');
    const oLng     = parseFloat(originLng     || '-58.3816');
    const originMl = originProvinceMl         || 'CABA';

    // Geocodifica el destino con la API del gobierno argentino
    let dLat = destProvince.lat;
    let dLng = destProvince.lng;

    if (destinationStreet && destinationNumber) {
        const coords = await geocodeWithGeoref(destinationStreet, destinationNumber, destProvince);
        if (coords) { dLat = coords.lat; dLng = coords.lng; }
    }

    const distance_km = haversine(oLat, oLng, dLat, dLng);

    res.json({
        distance_km,
        origin_province_ml:      originMl,
        destination_province_ml: destProvince.ml,
    });
});

module.exports = router;
