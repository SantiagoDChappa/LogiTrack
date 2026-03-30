# Contribuir a LogiTrack

Gracias por tu interés en contribuir al proyecto. 
A continuación se detallan las pautas para colaborar.

## Requisitos previos
- Node.js instalado
- PostgreSQL o acceso a Supabase
- Variables de entorno configuradas (ver `.env.example`)

## Cómo clonar y correr el proyecto
```bash
git clone https://github.com/tu-usuario/LogiTrack.git
cd LogiTrack
npm install
node app.js
```

## Estrategia de ramas
- `trunk` — código estable y productivo
- `develop` — rama de integración
- `feature_[CÓDIGO-TICKET]` — rama por funcionalidad

Ejemplo: `feature_LOGI-12`

## Convención de commits
Formato: `[LOGI-XX]: Descripción breve en imperativo`

Prefijos aceptados:
- `[LOGI-XX]` — cambios vinculados a una historia de usuario
- `[Develop]` — cambios generales sobre la rama de desarrollo
- `[Prototipo]` — cambios de la etapa de prototipado

Ejemplo: `[LOGI-12]: Implementar validación de tracking ID`

## Cómo hacer un Pull Request
1. Creá tu rama desde `develop`
2. Realizá tus cambios con commits descriptivos
3. Abrí un PR hacia `develop`
4. Al menos un integrante debe revisar y aprobar antes de mergear
5. Ningún código se integra a `trunk` sin pasar por `develop`

## Estándares de nomenclatura
- **Métodos:** verbos en infinitivo → `calcularEnvio()`
- **Variables locales:** prefijo `i` → `iEnvioDetalle`
- **Variables de parámetros:** prefijo `e` → `eIdTracking`

## Calidad
- Todo código debe tener su caso de prueba en formato Given/When/Then
- Se busca mantener una cobertura mínima del 70%
- No se presentan funcionalidades con errores que impidan el flujo básico
```
