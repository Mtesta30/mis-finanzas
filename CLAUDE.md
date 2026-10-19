# Mis Finanzas — contexto para Claude Code

App web personal para controlar ingresos, gastos, pagos fijos, presupuestos por categoría, metas de ahorro, deudas e historial mensual. La usan dos personas (Mario y su novia), cada una con su cuenta. Todo el texto de la interfaz está en español de Colombia, moneda COP. Sin emojis.

## Stack y despliegue

- HTML + CSS + JavaScript sin framework ni paso de build.
- Datos y autenticación: Supabase (proyecto `xbrrvtebgweeigymemzv`), correo y contraseña.
- Hosting: Vercel, despliegue automático con cada `git push` a `main` (repo `Mtesta30/mis-finanzas`).
- PWA instalable (manifest + service worker).

## Archivos

| Archivo | Contenido |
|---|---|
| `index.html` | Estructura y **todos los estilos** (`<style>` con tokens en `:root`). Sin scripts en línea. |
| `app.js` | Toda la lógica: estado, cálculos, render con template strings, eventos, auth y persistencia. |
| `config.js` | URL y publishable key de Supabase. No tocar. |
| `sw.js` | Service worker. Si cambias archivos del shell, sube la versión de `CACHE`. |
| `manifest.webmanifest`, `icons/` | Datos de instalación (nombre, colores, íconos). |
| `vercel.json` | Headers de seguridad y CSP. |
| `supabase/schema.sql`, `supabase/hardening.sql` | Tabla `finanzas_docs` con RLS por usuario y restricciones. |

## Modelo de datos (no cambiar sin migración)

Tabla `finanzas_docs (user_id, doc_id, data jsonb)`. Cada usuario tiene:
- `config`: `{salario, fijos[], presupuestos{cat:limite}, metas[], deudas[]}`
- `m-AAAA-MM`: `{movs[], pagados{fijoId:true}, salario, fijosTotal, salarioMes?}`

`app.js` valida todo lo que lee de la base (`cleanCfg`, `cleanMonth`) y escapa todo texto de usuario con `esc()`. Mantener eso en cualquier markup nuevo.

## Restricciones al rediseñar

1. **CSP** (`vercel.json`): `script-src 'self' https://cdn.jsdelivr.net`. Nada de `<script>` en línea ni `onclick=`. Los estilos en línea sí están permitidos (`style-src 'unsafe-inline'`). Las fuentes son las del sistema (San Francisco en Apple; ya no se carga nada de Google Fonts, y `font-src` es solo `'self'`). Si agregas otro origen externo, actualiza la CSP.
2. La librería de Supabase se carga con **SRI** (`integrity=`). Si cambias su versión, recalcula el hash.
3. Las vistas se generan en `app.js` (`vResumen`, `vMov`, `vFijos`, `vPres`, `vMetas`, `vDeudas`, `vHist`, `kpis`, `movForm`). El rediseño visual debería hacerse sobre todo en el CSS de `index.html`, cambiando markup de `app.js` solo cuando haga falta, sin tocar clases que usa la lógica: `data-act`, `data-form`, `data-id`, `data-pres` y los `id` de inputs y de `#app`, `#tabs`, `#authView`, `#appView`, `#topbar`.
4. Mantener tema claro y oscuro: tokens en `:root`, redefinidos en `@media (prefers-color-scheme: dark)`.
5. Debe verse bien a 390px de ancho (uso principal en celular, instalada como PWA) y sin scroll horizontal.
6. Si cambian los colores principales, actualizar también `theme-color` en `index.html`, `theme_color` y `background_color` en `manifest.webmanifest`, y regenerar los íconos en `icons/` si cambia el color de marca.
7. Al terminar, subir la versión de `CACHE` en `sw.js` para que los celulares reciban el diseño nuevo.

## Tarea pendiente: rediseño visual

Al usuario no le gustan los colores actuales (verde azulado oscuro con fondo gris verdoso). Quiere un rediseño. Antes de cambiar código:
1. Pregúntale qué estilo prefiere (por ejemplo: claro y minimalista, oscuro tipo app bancaria, colorido) y si tiene colores o apps de referencia.
2. Propón 2 o 3 paletas concretas y deja que elija.
3. Aplica la elegida, revisa en celular y computador, en tema claro y oscuro, y sube con `git push`.
