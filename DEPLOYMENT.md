# Publicación desde GitHub

Los PR ejecutan el build de Eleventy, la validación de datos estructurados y la comprobación de enlaces del sitio, sin recibir credenciales de producción. Al hacer merge a `main`, GitHub publica `dist/` en el proyecto existente `barefootopiniones-com` y comprueba que el dominio sirve esa revisión. No hace falta mantener un ordenador encendido ni ejecutar Wrangler localmente.

Requisito único de configuración: el secreto de repositorio `CLOUDFLARE_API_TOKEN`, con permiso **Account → Cloudflare Pages → Edit**, limitado a la cuenta `905ffd22734f2d0ef6319dd1fd356e2d`. No usar el token temporal de una sesión de Wrangler. La acción falla explícitamente si falta este secreto; un merge por sí solo no demuestra publicación.

Una persona con permiso de escritura puede fusionar PR y volver a ejecutar una publicación fallida desde Actions. El workflow no requiere una aprobación de Erik. Deben pasar primero los controles editoriales y de asignación cliente/dominio de PBNS. No añadir clientes o destinos por inferencia.

El resultado debe ser verde tanto en `build` como en `deploy`. `production-verification` conserva el commit exacto, la hora y las comprobaciones realizadas. Si falla, corregir el problema y repetir el workflow: no contar el artículo como publicado. El marcador sólo revela el commit del sitio; no contiene credenciales.

Este workflow publica únicamente este repositorio. Un borrador Markdown almacenado en `hsutech/pbns` debe prepararse en el repositorio de su web antes del merge de publicación. El registro de campaña, el tracker y el dashboard siguen siendo pasos de cierre independientes hasta que se conecte la sincronización correspondiente.
