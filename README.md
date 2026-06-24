# BCM - Formulario RUT/TRIBU

Esta carpeta contiene solo el formulario público para clientes.

No incluye:

- panel interno BCM,
- lista de clientes,
- archivos de IVA,
- respuestas de clientes,
- credenciales,
- datos privados.

## Archivos que van a GitHub Pages

- `index.html`
- `styles.css`
- `app.js`
- `.nojekyll`

## Paso 1 - Crear repositorio

Crear un repositorio en GitHub, por ejemplo:

`bcm-formulario-rut`

Puede ser público si solo contiene estos archivos.

## Paso 2 - Subir archivos

Subir el contenido de esta carpeta al repositorio.

## Paso 3 - Activar GitHub Pages

En GitHub:

1. Entrar al repositorio.
2. Ir a `Settings`.
3. Ir a `Pages`.
4. En `Build and deployment`, seleccionar:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Guardar.

GitHub dará un enlace parecido a:

`https://TU-USUARIO.github.io/bcm-formulario-rut/`

## Paso 4 - Conectar Google Sheets

Antes de compartir con clientes, se debe conectar el formulario a Google Apps Script.

En `app.js`, cambiar:

```js
const GOOGLE_APPS_SCRIPT_URL = "";
```

por la URL del Web App de Google Apps Script.

Mientras esa URL esté vacía, el formulario queda en modo prueba y descarga un archivo JSON en vez de enviar información.

## Seguridad

No guardar respuestas ni datos privados dentro de GitHub.

Las respuestas deben guardarse en Google Sheets/Drive privado o en una base de datos protegida.
