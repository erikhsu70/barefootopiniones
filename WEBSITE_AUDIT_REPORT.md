# WEBSITE AUDIT REPORT - Barefoot Opiniones

Fecha: 2026-07-09

## Resumen ejecutivo

Se ha revisado el proyecto completo como web estatica Eleventy/11ty, con plantillas Nunjucks, CSS propio y contenido Markdown. La auditoria se centro en estructura, SEO, UX, responsive, accesibilidad, contenido importado, enlaces, residuos tecnicos y build final.

El sitio ya tenia una base funcional, pero aun arrastraba muchos detalles propios de una migracion desde otra web: enlaces legacy, restos de formularios, referencias tecnicas de WordPress, metadatos demasiado largos o finos, paginas de archivo con aspecto generico, elementos de video/PDF que no pertenecen a esta marca y algunas mejoras pendientes de responsive/accesibilidad.

## Stack y estructura revisada

- Framework: Eleventy / 11ty.
- Plantillas: Nunjucks en `src/_includes/layouts/`.
- Contenido: Markdown en `src/imported/pages/`, `src/imported/posts/`, `src/imported/faqs/` y paginas propias en `src/`.
- CSS: archivo propio en `src/assets/css/styles.css`, sin framework.
- Build: salida estatica en `dist/`.
- SEO: sitemaps XML, robots, canonical, meta description, Open Graph, Twitter cards y Schema.org generado desde `.eleventy.js`.

## Problemas principales encontrados

- Muchos titulos SEO de articulos eran demasiado largos al sumar el nombre de marca.
- Varias meta descriptions importadas eran demasiado cortas, largas o poco utiles.
- Habia enlaces internos legacy hacia URLs que ya no existen en esta version.
- El contenido importado mantenia restos de formularios, inputs, botones, paginaciones Elementor, iconos sociales, enlaces `wp-json`, videos, iframes y PDFs.
- Seguian apareciendo patrones de descuento/cupones/afiliacion que no corresponden a Isabel.
- Algunas paginas de archivo/categoria/etiqueta eran demasiado genericas para SEO.
- El nav movil podia sentirse pesado y con comportamiento de barra lateral/scroll lateral.
- Faltaban estados de foco visibles en enlaces y botones.
- Tablas y contenido largo podian provocar overflow en articulos.
- El footer tenia etiquetas legales en ingles o poco pulidas.
- La home tenia enlaces duplicados y algunos enlaces FAQ antiguos.

## Fixes aplicados

- Limpieza fuerte del HTML importado desde `.eleventy.js`.
- Limpieza adicional en runtime para articulos importados desde `src/_includes/layouts/imported.njk`.
- Mapeo de URLs legacy a URLs actuales para evitar enlaces internos rotos.
- Eliminacion de formularios, inputs, botones heredados, paginaciones antiguas, embeds de video, iframes, PDFs y enlaces tecnicos de WordPress.
- Eliminacion o neutralizacion de enlaces de descuento, cupones y Amazon en FAQ.
- Generacion de meta descriptions limpias con fallback cuando el contenido importado no da una buena descripcion.
- Acortado automatico de title tags SEO sin tocar el H1 visual de las paginas.
- Mejora de canonical, Open Graph y Twitter title/description usando versiones limpias.
- Validacion de Schema.org en paginas clave.
- Correccion de enlaces de la home y paginas principales.
- Traduccion/pulido de footer y paginas legales.
- Mejora responsive del nav para que envuelva y no genere barra lateral en movil.
- Mejora de focus states, enlaces, botones, tarjetas y tablas.
- Refuerzo de `overflow-wrap`, `min-width: 0` y tablas con scroll interno para evitar desbordes.

## SEO mejorado

- `title` tags dentro de longitud razonable en los 646 HTML revisados.
- `meta description` valida en los 646 HTML revisados.
- Un solo H1 por pagina en los 646 HTML revisados.
- Canonical presente en los 646 HTML revisados.
- 0 enlaces internos rotos detectados en `a`, `img`, `link` y `script` locales.
- Sitemaps generados correctamente:
  - `sitemap.xml`
  - `sitemap_index.xml`
  - `post-sitemap.xml`
  - `page-sitemap.xml`
  - sitemaps de categorias, tags, marcas, estilos, edades y FAQ.
- Schema.org valido en muestras revisadas:
  - Home: Organization, WebSite, BreadcrumbList, WebPage.
  - Articulo: Organization, WebSite, BreadcrumbList, Article.
  - Categoria: Organization, WebSite, BreadcrumbList, WebPage.

## UX y diseno mejorados

- Footer mas claro y con enlaces legales en espanol.
- Nav movil mas natural, sin comportamiento de barra lateral.
- Tarjetas con contenido mas resistente a titulos largos.
- Tablas de articulos contenidas para no romper el layout.
- Estados de foco visibles para accesibilidad.
- Botones/enlaces con interacciones mas consistentes.
- Menos ruido heredado del sitio original dentro de articulos.

## Mobile y responsive

Se revisaron vistas moviles de home, articulos, FAQ, resources, shoe-lists, style, kids, categorias y tags. No se detecto overflow horizontal despues de los cambios. El nav pasa a comportamiento flexible y envolvente, las grids se adaptan y las tablas dejan de romper el ancho de pantalla.

## Validaciones finales

- Build: correcto.
- Archivos generados: 661.
- HTML revisados: 646.
- Enlaces internos rotos: 0.
- Problemas title/meta/H1/canonical: 0.
- Formularios heredados: 0.
- Iframes/videos/embeds: 0.
- Texto `.pdf` residual en HTML: 0.
- `wp-json` residual en HTML: 0.
- Bullets vacios detectados: 0.
- Schema JSON-LD parsea correctamente en paginas clave.

## Needs manual decision

- Aun existen paginas de archivo heredadas del sitemap original, por ejemplo autores antiguos, marcas como `by-anya` o `anyas-shop`, y tags de descuentos/cupones. Se han limpiado para que no rompan, pero conviene decidir si se mantienen por SEO 1:1, se redirigen, se noindexan o se eliminan.
- Muchos posts necesitan una segunda pasada editorial humana: algunos titulos y frases siguen sonando traducidos o poco naturales en espanol.
- La pagina de contacto no tiene formulario real; si se quiere captacion o consultas, hay que decidir proveedor/formulario.
- Las imagenes funcionan, pero podria optimizarse mas adelante con WebP/AVIF y variantes responsive.
- El Schema FAQ podria enriquecerse extrayendo preguntas/respuestas reales como `mainEntity`.
- El TOC sigue en articulos donde aplica; si se quiere eliminarlo globalmente, hay que decidirlo como criterio editorial.

## Archivos modificados

- `.eleventy.js`
- `src/_includes/layouts/base.njk`
- `src/_includes/layouts/imported.njk`
- `src/assets/css/styles.css`
- `src/_data/site.js`
- `src/imported/pages/home.md`
- `src/imported/pages/resources.md`
- `src/imported/pages/shoe-lists.md`
- `src/en.njk`
- `src/generated-archive.njk`
- `src/privacy-policy.md`
- `src/terms-of-service.md`
- `src/disclaimers.md`
- `WEBSITE_AUDIT_REPORT.md`

