export const normalizeTranslationKey = (str: string): string => {
  if (!str) return "";

  // Mapa explícito para os casos reais que você viu no log
  const rawLower = str.toLowerCase();

  if (
    rawLower.includes("colis") ||
    rawLower.includes("collision") ||
    rawLower.includes("colis_o_travesia") ||
    rawLower.includes("colisotravesia")
  ) {
    return "colisao";
  }

  if (rawLower.includes("capot") || rawLower.includes("rollover")) {
    return "capotamento";
  }

  if (rawLower.includes("atropel") || rawLower.includes("hit_and_run")) {
    return "atropelamento";
  }

  if (rawLower.includes("queda") || rawLower.includes("fall")) {
    return "queda";
  }

  // Fallback: normaliza restante
  const normalized = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, "_");
  return normalized;
};