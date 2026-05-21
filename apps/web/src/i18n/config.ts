// apps/web/src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import esTranslation from './locales/es.json';
import enUSTranslation from './locales/en-US.json';

const resources = {
  es: { translation: esTranslation },
  'en-US': { translation: enUSTranslation }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: (() => {
      const savedLng = localStorage.getItem('i18nextLng');
      if (savedLng) return savedLng;

      const lang = navigator.language;
      if (lang.startsWith('es')) return 'es';
      return 'en-US';
    })(),
    // ⚠️ Temporariamente false para debug; no prod, use 'es' ou 'en-US'
    fallbackLng: false,
    interpolation: { escapeValue: false }
  });

// Persistência
const originalChangeLanguage = i18n.changeLanguage;

i18n.changeLanguage = async (lng, callback) => {
  try {
    await originalChangeLanguage(lng, callback);
    localStorage.setItem('i18nextLng', lng);
  } catch (err) {
    console.error('[i18n] Error changing language:', err);
  }
};

export default i18n;
