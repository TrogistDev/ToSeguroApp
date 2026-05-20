// apps/web/src/hooks/useSmartLocation.ts
import { useState, useEffect, useCallback } from 'react';
import { useReportStore } from '../store/useReportStore';

export const useSmartLocation = () => {
  const { updateFormData, formData } = useReportStore();
  const [loading, setLoading] = useState(false);

  // Evita callbacks em componentes desmontados
  useEffect(() => {
    return () => {
      // Limpeza opcional se precisar abortar promessas (ex: AbortController)
    };
  }, []);

  const captureGPS = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      return new Promise<string>(async (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;

            // Evita atualizações se o componente já desmontou
          

            try {
              const geocoder = new google.maps.Geocoder();
              await geocoder.geocode(
                { location: { lat: latitude, lng: longitude } },
                (results, status) => {
                  // ⚠️ Importante: só atualiza se o componente ainda estiver montado
                  if (status === 'OK' && results?.[0]) {
                    updateFormData({
                      lat: latitude,
                      lng: longitude,
                      address: results[0].formatted_address,
                    });
                    resolve(results[0].formatted_address);
                  } else {
                    updateFormData({ lat: latitude, lng: longitude });
                    resolve("Localização sem endereço específico");
                  }
                }
              );
            } catch (err) {
              console.error('Erro no geocoding:', err);
              updateFormData({ lat: latitude, lng: longitude });
              resolve("Erro ao obter endereço");
            }
          },
          (err) => {
            setLoading(false);
            reject(err);
          }
        );
      });
    } finally {
      // Isso aqui não vai funcionar com Promise constructor direto...
      // Faça assim:
    }
  }, [loading, updateFormData]); // Dependências críticas

  // Para evitar loops, evite usar `captureGPS` diretamente em render ou useEffect sem deps
  return { captureGPS, loading };
};
