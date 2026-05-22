// apps/web/src/utils/translation.ts

/**
 * Normaliza uma string para ser usada como chave de tradução:
 * - Mapeia palavras-chave específicas (ex: "colis_oTravesía" → "colisao")
 * - Remove acentos, minúsculas, espaços → `_`
 */
export const normalizeTranslationKey = (str: string): string => {
  if (!str) return "";

  // Mapeamento direto para os casos reais que aparecem no log
  const lower = str.toLowerCase();

  if (
    lower.includes("colis") ||
    lower.includes("collision") ||
    lower.includes("colis_o_travesia") ||
    lower.includes("colisotravesia")
  ) {
    return "colisao";
  }

  if (lower.includes("capot") || lower.includes("rollover")) {
    return "capotamento";
  }

  if (lower.includes("atropel") || lower.includes("hit_and_run")) {
    return "atropelamento";
  }

  if (lower.includes("queda") || lower.includes("fall")) {
    return "queda";
  }

  // Fallback: normaliza o resto
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, "_");
};
