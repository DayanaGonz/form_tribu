const SHEET_NAME = "Respuestas RUT";
const SPREADSHEET_ID = "";
const DRIVE_PARENT_FOLDER_ID = "";
const NOTIFICATION_EMAIL = "conta@grupo-bcm.com";

const HEADERS = [
  "Fecha de envio",
  "Idioma",
  "Tipo tramite",
  "Tipo contribuyente",
  "Nombre",
  "Tipo identificacion",
  "Identificacion",
  "Fecha nacimiento",
  "Fecha vencimiento identificacion",
  "Consecutivo cedula",
  "Telefono",
  "Correo notificaciones",
  "Correo facturas",
  "NISe",
  "Provincia",
  "Canton",
  "Distrito",
  "Direccion exacta",
  "Actividad",
  "Acceso TRIBU vigente",
  "Metodo acceso TRIBU",
  "Notas acceso TRIBU",
  "Observaciones",
  "Estado revision BCM",
  "Carpeta Drive",
];

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, app: "BCM RUT/TRIBU intake" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");
    const data = payload.data || {};
    const sheet = getResponseSheet_();
    const folderUrl = createClientFolder_(data);

    sheet.appendRow([
      new Date(),
      data.idioma_formulario || "",
      data.tipo_tramite || "",
      data.tipo_contribuyente || "",
      data.nombre || "",
      data.tipo_identificacion || "",
      data.identificacion || "",
      data.fecha_nacimiento || "",
      data.fecha_vencimiento_cedula || "",
      data.consecutivo_cedula || "",
      data.telefono || "",
      data.correo || "",
      data.correo_recepcion_facturas || "",
      data.nise || "",
      data.provincia || "",
      data.canton || "",
      data.distrito || "",
      data.domicilio || "",
      data.actividad_descripcion || "",
      data.acceso_tribu || "",
      data.metodo_acceso_tribu || "",
      data.notas_acceso_tribu || "",
      data.observaciones_cliente || "",
      "Pendiente de revisar",
      folderUrl,
    ]);

    sendNotificationEmail_(data, folderUrl);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendNotificationEmail_(data, folderUrl) {
  if (!NOTIFICATION_EMAIL) return;

  const subject = `Nuevo formulario RUT/TRIBU - ${data.nombre || "Cliente"}`;
  const body = [
    "BCM recibió un nuevo formulario RUT/TRIBU.",
    "",
    `Nombre: ${data.nombre || ""}`,
    `Identificación: ${data.identificacion || ""}`,
    `Tipo de identificación: ${data.tipo_identificacion || ""}`,
    `Teléfono: ${data.telefono || ""}`,
    `Correo: ${data.correo || ""}`,
    `Provincia: ${data.provincia || ""}`,
    `Cantón: ${data.canton || ""}`,
    `Distrito: ${data.distrito || ""}`,
    `Acceso TRIBU vigente: ${data.acceso_tribu || ""}`,
    `Método de acceso: ${data.metodo_acceso_tribu || ""}`,
    folderUrl ? `Carpeta Drive: ${folderUrl}` : "",
    "",
    "Revisar la hoja Respuestas RUT para ver el expediente completo.",
  ].filter(Boolean).join("\n");

  MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
}

function getResponseSheet_() {
  const spreadsheet = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw new Error("No se encontró una hoja activa. Pegue el ID de la Google Sheet en SPREADSHEET_ID.");
  }

  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }

  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  const existingHeaders = headerRange.getValues()[0];
  const needsHeaders = existingHeaders.some((value, index) => value !== HEADERS[index]);
  if (needsHeaders) {
    headerRange.setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function createClientFolder_(data) {
  if (!DRIVE_PARENT_FOLDER_ID) return "";

  const parent = DriveApp.getFolderById(DRIVE_PARENT_FOLDER_ID);
  const nameParts = [
    cleanName_(data.nombre || "Cliente"),
    cleanName_(data.identificacion || ""),
  ].filter(Boolean);
  const folderName = nameParts.join(" - ");
  const existing = parent.getFoldersByName(folderName);
  const folder = existing.hasNext() ? existing.next() : parent.createFolder(folderName);
  return folder.getUrl();
}

function cleanName_(value) {
  return String(value || "")
    .replace(/[\\/:*?"<>|#%{}~&]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
