# Tablón de anuncios

Tablón de la congregación: cuadrantes, actividades, anuncios e informes mensuales con entrega del superintendente de grupo al secretario.

- **App:** https://appcongmontequinto-bit.github.io/Tablon/
- **Backend:** Supabase (proyecto `tablon`, organización app.cong.montequinto). Tablas con RLS, bucket privado `tablon` y Edge Function `enlace`.
- **Acceso:** cada hermano entra con su enlace personal (`?t=…`), sin usuario ni contraseña. Los enlaces se crean desde la app (🔗).

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | La app completa (HTML + CSS + JS, sin compilación). |
| `.github/workflows/keepalive.yml` | Consulta mínima cada 3 días para que Supabase no pause el proyecto gratuito. Necesita los secretos `SUPABASE_URL` y `SUPABASE_KEY` (clave pública). |

El esquema SQL y el código de la Edge Function están en la copia del proyecto que guarda el administrador (carpeta `supabase/`).

## Roles

| Rol | Qué puede hacer |
|---|---|
| Publicador | Ver el tablón y enviar su informe |
| Auxiliar / Superintendente de grupo | Además: ver su grupo, informar por otros, recordar pendientes, entregar al secretario, crear enlaces |
| Secretario | Además: todos los grupos, devolver, cerrar el mes, Excel, gestionar publicadores |
| Admin | Todo, incluido publicar en el tablón |

Los permisos los aplica la base de datos (Row Level Security), no el navegador.
