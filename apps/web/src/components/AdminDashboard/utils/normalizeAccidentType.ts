// Copia da sua função existente:
export const normalizeAccidentType = (key: string): string => {
  return key
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
};
