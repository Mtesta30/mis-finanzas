# Mis Finanzas

App web para controlar ingresos, gastos, pagos fijos, presupuestos, metas de ahorro y deudas.
Cada persona entra con su correo y contraseña, y solo ve sus propios datos.
Se puede instalar en el celular como una app.

- Página: HTML, CSS y JavaScript sin compilación (`index.html`).
- Datos e inicio de sesión: Supabase (plan gratuito).
- Publicación: Vercel (plan gratuito).

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La app completa |
| `config.js` | Conexión a tu proyecto de Supabase (lo editas una vez) |
| `supabase/schema.sql` | Crea la tabla y las reglas de seguridad |
| `manifest.webmanifest`, `sw.js`, `icons/` | Permiten instalarla en el celular |

## 1. Crear la base de datos en Supabase

1. Crea una cuenta en https://supabase.com y luego un proyecto nuevo (región recomendada: São Paulo, la más cercana a Colombia). Guarda la contraseña de la base de datos.
2. Entra a **SQL Editor > New query**, pega todo el contenido de `supabase/schema.sql` y pulsa **Run**.
3. Ve a **Project Settings > API Keys** (o al botón **Connect**) y copia:
   - la **Project URL** (`https://xxxx.supabase.co`)
   - la **Publishable key** (empieza por `sb_publishable_`). No uses la secret key.
4. Pega esos dos valores en `config.js`.

## 2. Configurar el inicio de sesión

En **Authentication > Sign In / Providers > Email**:

- Deja activado **Email**.
- **Confirm email**: si lo dejas activo, cada persona debe abrir un enlace en su correo antes de entrar. Si solo la van a usar tú y tu novia, puedes desactivarlo para entrar de una vez. El plan gratuito envía pocos correos por hora.

Después de publicar en Vercel (paso 4), entra a **Authentication > URL Configuration** y pon tu dirección de Vercel (por ejemplo `https://mis-finanzas.vercel.app`) en **Site URL** y en **Redirect URLs**. Así los enlaces de confirmación y de cambio de contraseña llevan a tu app.

## 3. Subir el proyecto a GitHub

```bash
cd mis-finanzas
git init
git add .
git commit -m "Mis Finanzas: primera versión"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/mis-finanzas.git
git push -u origin main
```

Crea antes el repositorio vacío `mis-finanzas` en GitHub (puede ser privado).

## 4. Publicar en Vercel

1. Entra a https://vercel.com con tu cuenta de GitHub.
2. **Add New > Project**, elige el repositorio `mis-finanzas` y pulsa **Import**.
3. En **Framework Preset** deja **Other**. No hace falta comando de build ni carpeta de salida.
4. Pulsa **Deploy**. Vercel te da la dirección pública.
5. Vuelve al paso 2 y registra esa dirección en Supabase.

Cada vez que hagas `git push`, Vercel publica la nueva versión sola.

## 5. Instalar en el celular

Abre la dirección de Vercel en el celular y crea tu cuenta.

- **Android (Chrome):** menú de tres puntos > **Instalar app** o **Agregar a pantalla principal**.
- **iPhone (Safari):** botón Compartir > **Agregar a inicio**.

Queda con su propio ícono y se abre a pantalla completa. Los datos están en Supabase, así que se ven igual en el celular y en el computador.

## Notas

- Seguridad: las reglas de `schema.sql` hacen que cada usuario solo pueda leer y escribir sus propias filas, aunque todos usen la misma app.
- Plan gratuito de Supabase: un proyecto sin actividad durante varios días se pausa. Se reactiva desde el panel de Supabase con un clic; los datos no se pierden.
- Si cambias `index.html` y el celular sigue mostrando la versión anterior, cierra la app y ábrela de nuevo.
