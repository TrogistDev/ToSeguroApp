// apps/web/src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    es: {
      translation: {
        welcome: "Bienvenido al Sistema de Reportes",
        start_report: "Sessión operacional activa bajo la política de seguridad de su empresa.",
        login_subtitle: "Acceso restringido. Identifíquese para gestionar los siniestros de su organización.",
        email_label: "Correo Electrónico",
        password_label: "Contraseña",
        btn_enter: "Entrar al Sistema",
        btn_loading: "Entrando...",
        btn_logout: "Salir",
        or_separator: "O",
        auth_error: "Acceso denegado: Credenciales incorrectas."
      }
    },
    en: {
      translation: {
        welcome: "Welcome to the Reporting System",
        start_report: "Active operational session under your company's security policy.",
        login_subtitle: "Restricted access. Please log in to manage your organization's claims.",
        email_label: "Email Address",
        password_label: "Password",
        btn_enter: "Sign In",
        btn_loading: "Signing in...",
        btn_logout: "Sign Out",
        or_separator: "Or",
        auth_error: "Access denied: Invalid credentials."
      }
    }
  },
  lng: "es", 
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;