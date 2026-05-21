// apps/web/src/utils/translation.ts
/**
 * Normaliza uma string para ser usada como chave de tradução:
 * - Remove acentos (colisão → colisao)
 * - Minúsculas
 * - Espaços substituídos por `_`
 */
export const normalizeTranslationKey = (str: string): string =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, "_");
