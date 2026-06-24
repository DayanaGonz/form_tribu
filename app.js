const clientForm = document.getElementById("clientRutForm");
const clientStatus = document.getElementById("clientRutStatus");
const successMessage = document.getElementById("successMessage");
const langButtons = document.querySelectorAll("[data-lang-switch]");
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby7z-m1nnO-cSh4iO0TUsm10mSaJhKeZ2E4OisWL81cGqaOBVJtRqjPWmX6zRZsNMHh7g/exec";

const translations = {
  es: {
    hero_badge: "Formulario RUT/TRIBU-CR",
    intro_title: "Datos Hacienda (RUT)",
    intro_copy: "Complete esta información para que BCM Group pueda preparar o revisar su trámite ante Hacienda. Los campos marcados son necesarios para el expediente.",
    representative_note: "Si el trámite corresponde a una sociedad o entidad, complete la información con los datos del representante legal autorizado.",
    personal_title: "Datos personales / representante legal",
    full_name: "Nombre completo *",
    id_type: "Tipo de identificación *",
    select_option: "Seleccione",
    id_cedula: "Cédula física",
    id_passport: "Pasaporte",
    id_cedula_juridica: "Cédula jurídica",
    id_number: "Número de identificación *",
    birth_date: "Fecha de nacimiento *",
    id_expiration: "Fecha vencimiento de identificación *",
    id_consecutive: "Número de consecutivo",
    id_consecutive_placeholder: "9 dígitos del reverso de la cédula, si aplica",
    phone: "Número de teléfono para notificaciones *",
    email_notifications: "Correo electrónico para notificaciones *",
    email_invoices: "Correo recepción facturas electrónicas *",
    nise: "NISe, recibo de servicio eléctrico *",
    address_title: "Domicilio fiscal",
    province: "Provincia *",
    canton: "Cantón *",
    district: "Distrito *",
    exact_address: "Dirección exacta *",
    activity_title: "Actividad",
    activity: "Actividad a desarrollar *",
    tribu_title: "Acceso a TRIBU-CR",
    tribu_note: "Si ya existe un acceso vigente a TRIBU-CR, BCM Group necesitará acceso autorizado para ingresar y realizar el cambio de información. Por seguridad, no incluya contraseñas en este formulario; compártalas por el canal seguro indicado por BCM Group.",
    tribu_access: "¿Tiene acceso vigente a TRIBU-CR? *",
    yes: "Sí",
    no: "No",
    not_sure: "No estoy seguro/a",
    access_method: "Método de ingreso disponible",
    access_user_pass: "Usuario y contraseña",
    access_signature: "Firma digital",
    access_authorization: "Autorización a tercero",
    other: "Otro",
    access_notes: "Notas sobre acceso o credenciales",
    access_notes_placeholder: "Indique si ya tiene acceso y cómo coordinar la entrega segura. No escriba contraseñas aquí.",
    additional_notes: "Observaciones adicionales",
    submit_button: "Enviar formulario",
    local_status: "Vista previa local: se descargó un archivo con la información del formulario.",
    sending_status: "Enviando información...",
    success_status: "Formulario enviado.",
    error_status: "No se pudo enviar el formulario.",
  },
  en: {
    hero_badge: "RUT/TRIBU-CR Form",
    intro_title: "Costa Rica Taxpayer Registry (RUT) Information",
    intro_copy: "Please complete this information so BCM Group can prepare or review your filing with the Costa Rican Tax Administration. Marked fields are required for the file.",
    representative_note: "If the filing relates to a company or legal entity, please complete the form using the authorized legal representative's information.",
    personal_title: "Personal / Legal Representative Information",
    full_name: "Full name *",
    id_type: "ID type *",
    select_option: "Select",
    id_cedula: "Costa Rican ID",
    id_passport: "Passport",
    id_cedula_juridica: "Corporate ID",
    id_number: "ID number *",
    birth_date: "Date of birth *",
    id_expiration: "ID expiration date *",
    id_consecutive: "ID consecutive number",
    id_consecutive_placeholder: "9 digits from the back of the Costa Rican ID, if applicable",
    phone: "Notification phone number *",
    email_notifications: "Email for notifications *",
    email_invoices: "Email for electronic invoice reception *",
    nise: "NISe from electric utility bill *",
    address_title: "Tax domicile",
    province: "Province *",
    canton: "Canton *",
    district: "District *",
    exact_address: "Exact address *",
    activity_title: "Business activity",
    activity: "Activity to be registered *",
    tribu_title: "TRIBU-CR Access",
    tribu_note: "If there is already active access to TRIBU-CR, BCM Group will need authorized access to log in and update the information. For security reasons, do not include passwords in this form; share credentials through the secure channel indicated by BCM Group.",
    tribu_access: "Do you currently have TRIBU-CR access? *",
    yes: "Yes",
    no: "No",
    not_sure: "Not sure",
    access_method: "Available access method",
    access_user_pass: "Username and password",
    access_signature: "Digital signature",
    access_authorization: "Third-party authorization",
    other: "Other",
    access_notes: "Access or credential notes",
    access_notes_placeholder: "Indicate whether access already exists and how to coordinate secure delivery. Do not write passwords here.",
    additional_notes: "Additional notes",
    submit_button: "Submit form",
    local_status: "Local preview: a file with the form information was downloaded.",
    sending_status: "Sending information...",
    success_status: "Form submitted.",
    error_status: "The form could not be submitted.",
  },
};

let activeLang = localStorage.getItem("bcmRutFormLang") || "es";

function t(key) {
  return translations[activeLang][key] || translations.es[key] || key;
}

function applyLanguage(lang) {
  activeLang = lang;
  localStorage.setItem("bcmRutFormLang", lang);
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  langButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.langSwitch === lang);
  });
}

function collectClientPayload() {
  const data = {
    idioma_formulario: activeLang,
    tipo_tramite: "actualización de datos RUT",
    tipo_contribuyente: "persona física o representante legal",
  };
  new FormData(clientForm).forEach((value, key) => {
    data[key] = String(value).trim();
  });
  return { data, documents: {} };
}

langButtons.forEach((button) => {
  button.addEventListener("click", () => applyLanguage(button.dataset.langSwitch));
});

clientForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = collectClientPayload();

  if (!GOOGLE_APPS_SCRIPT_URL) {
    clientStatus.textContent = activeLang === "es"
      ? "El formulario todavía no tiene conectada la URL de Google Sheets."
      : "The Google Sheets URL has not been connected yet.";
    return;
  }

  clientStatus.textContent = t("sending_status");
  try {
    await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    clientForm.reset();
    clientStatus.textContent = "";
    clientForm.classList.add("hidden");
    successMessage.classList.remove("hidden");
    successMessage.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (error) {
    clientStatus.textContent = error.message;
  }
});

applyLanguage(activeLang);
