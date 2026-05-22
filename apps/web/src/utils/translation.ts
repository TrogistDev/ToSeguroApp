/**
 * Normaliza uma string para ser usada como chave de tradução.
 * Mapeia explicitamente os casos reais que vêm do backend (ex: "colis_oTravesía")
 */
export const normalizeTranslationKey = (str: string): string => {
  if (!str) return "";

  // Remove acentos e torna minúsculo
  const normalized = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  // Casos reais do seu log:
  if (normalized.includes("colis") || normalized.includes("collision")) return "colisao";
  if (normalized.includes("capot") || normalized.includes("rollover")) return "capotamento";
  if (normalized.includes("atropel") || normalized.includes("hit_and_run")) return "atropelamento";
  if (normalized.includes("queda") || normalized.includes("fall")) return "queda";

  // Fallback: usa o próprio texto como chave (se já for uma chave válida)
  return normalized;
};
