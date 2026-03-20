async function navegarA(nombrePagina) {
    const respuesta = await fetch('../../pages/envio/alta.html');
    const datos = await respuesta.json();
}