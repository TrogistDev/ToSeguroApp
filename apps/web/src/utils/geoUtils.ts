// apps/web/src/utils/geoUtils.ts
export const validateCoordinates = (lat: number, lng: number): boolean => {
  return (
    lat >= -90 && lat <= 90 && 
    lng >= -180 && lng <= 180
  );
};

// apps/web/src/utils/formatters.ts
export const formatAddress = (address: string): string => {
  if (!address) return "Dirección no disponible";
  return address.trim();
};

// apps/web/src/utils/apiHelpers.ts
export const parseErrorResponse = (error: any): string => {
  // TODO: [REQUERIMIENTO] Lógica para extraer mensajes de error de Zod del backend
  if (error.response?.data?.error) return error.response.data.error;
  return "Ocurrió un error inesperado en el servidor";
};
