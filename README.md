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
- `README.md`

El archivo `google-apps-script.gs` no se sube a GitHub Pages como parte del sitio. Ese código se copia y pega dentro de Google Apps Script.

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

## Paso 4 - Crear Google Sheet privada

En Google Drive:

1. Crear una hoja nueva.
2. Nombrarla: `BCM - Respuestas RUT TRIBU`.
3. Abrir la hoja.
4. Ir a `Extensiones > Apps Script`.

## Paso 5 - Pegar Apps Script

1. Abrir el archivo `google-apps-script.gs`.
2. Copiar todo el contenido.
3. Pegar en Apps Script, reemplazando cualquier código existente.
4. Guardar.

Opcional para carpetas en Drive:

Si quiere que se cree una carpeta por cliente, primero cree una carpeta madre en Drive, copie su ID y péguelo aquí:

```js
const DRIVE_PARENT_FOLDER_ID = "";
```

Si se deja vacío, las respuestas se guardan en Google Sheets sin crear carpetas.

## Paso 6 - Publicar Apps Script como Web App

En Apps Script:

1. Ir a `Implementar`.
2. Seleccionar `Nueva implementación`.
3. Tipo: `Aplicación web`.
4. Ejecutar como: `Yo`.
5. Quién tiene acceso: `Cualquier persona`.
6. Implementar.
7. Autorizar permisos.
8. Copiar la URL que termina en `/exec`.

## Paso 7 - Conectar el formulario

Antes de compartir con clientes, se debe conectar el formulario a Google Apps Script.

En `app.js`, cambiar:

```js
const GOOGLE_APPS_SCRIPT_URL = "";
```

por la URL del Web App de Google Apps Script.

Mientras esa URL esté vacía, el formulario queda en modo prueba y descarga un archivo JSON en vez de enviar información.

Ejemplo:

```js
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";
```

Después de cambiarlo, subir de nuevo `app.js` a GitHub.

## Seguridad

No guardar respuestas ni datos privados dentro de GitHub.

Las respuestas deben guardarse en Google Sheets/Drive privado o en una base de datos protegida.
