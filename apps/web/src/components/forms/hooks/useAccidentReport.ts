import { useState, useEffect, useRef, ChangeEvent } from "react";
import { useReportStore } from "../../../store/useReportStore";
import { useAuthStore } from "../../../store/authStore";
import apiClient from "../../../api/apiClient";
import { useSmartLocation } from "../../../hooks/useSmartLocation";

export const useAccidentReport = () => {
  const { formData, step, setStep, updateFormData } = useReportStore();
  const { token, tenantSlug } = useAuthStore();
  const { captureGPS, coords } = useSmartLocation();

  const [addressInput, setAddressInput] = useState(formData.address || "");
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>(formData.photos || []);
  const [signedPhotoUrls, setSignedPhotoUrls] = useState<Record<string, string>>({});
  
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);

  // ✅ EXTRAÇÃO DE CHAVE BLINDADA (Suporta local-upload e S3 de Produção)
  const extractKey = (fullUrl: string): string => {
    if (fullUrl.includes("/uploads/accidents/")) {
      return `accidents/${fullUrl.split("/uploads/accidents/")[1]}`;
    }
    return fullUrl.split(".amazonaws.com/")[1] || fullUrl;
  };

  const fetchSignedUrl = async (fullUrl: string) => {
    // Se já for uma URL local estática, não precisa pedir assinatura de leitura para o S3
    if (fullUrl.includes("localhost:3000/uploads/")) {
      setSignedPhotoUrls((prev) => ({ ...prev, [fullUrl]: fullUrl }));
      return;
    }

    const key = extractKey(fullUrl);
    try {
      const { data } = await apiClient.get(`/accidents/photo-url`, {
        params: { key },
      });
      setSignedPhotoUrls((prev) => ({ ...prev, [fullUrl]: data.url }));
    } catch (err) {
      console.error("Erro ao assinar URL de leitura:", err);
    }
  };

  // ✅ CORREÇÃO DE LOOPS INFINITOS: Executa apenas se o comprimento da array mudar
  useEffect(() => {
    uploadedPhotos.forEach((url) => {
      if (!signedPhotoUrls[url]) {
        fetchSignedUrl(url);
      }
    });
    
    // Evita disparar atualização de estado do Zustand se as fotos forem idênticas
    if (JSON.stringify(formData.photos) !== JSON.stringify(uploadedPhotos)) {
      updateFormData({ photos: uploadedPhotos });
    }
  }, [uploadedPhotos]); // Removido dependências instáveis para quebrar o loop

  useEffect(() => {
    if (!window.google) return;
    autocompleteService.current = new window.google.maps.places.AutocompleteService();
  }, []);

  useEffect(() => {
    const initLocation = async () => {
      try {
        const address = await captureGPS();
        if (address) {
          setAddressInput(address as string);
          updateFormData({ address: address as string });
        }
      } catch (err) {
        console.warn("GPS não disponível");
      }
    };

    initLocation();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          updateFormData({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        (err) => console.error("GPS negado:", err),
      );
    }
  }, [captureGPS]); // Removido updateFormData da dependência para evitar execuções cíclicas

  const handleAddressInput = (input: string) => {
    setAddressInput(input);
    if (!input || !autocompleteService.current) {
      setSuggestions([]);
      return;
    }

    autocompleteService.current.getPlacePredictions(
      {
        input,
        locationBias: coords ? { center: coords, radius: 50000 } : undefined,
      },
      (predictions) => setSuggestions(predictions || []),
    );
  };

  const handleSelectAddress = (prediction: google.maps.places.AutocompletePrediction) => {
    setAddressInput(prediction.description);
    setSuggestions([]);
    updateFormData({ address: prediction.description });
  };

 const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files?.[0]) return;
  setIsUploading(true);

  try {
    const file = e.target.files[0];
    
    // 1. Busca a URL de upload (Bate no teu Express protegida)
    const { data } = await apiClient.get(`/accidents/presigned-url`, {
      params: { fileName: file.name, fileType: file.type },
    });

    // 2. Configura os headers base
    const headers: Record<string, string> = {
      "Content-Type": file.type,
    };

    // ✅ SE FOR AMBIENTE LOCAL (DEV), PRECISAMOS PASSAR PELA BARREIRA DO AUTH/TENANT MIDDLEWARE
    if (data.uploadUrl.includes("localhost:3000") || data.uploadUrl.includes("127.0.0.1:3000")) {
      // Puxa o token e o tenant do teu estado/localStorage/contexto onde o teu apiClient os vai buscar
      if (token) headers["Authorization"] = `Bearer ${token}`;
      if (tenantSlug) headers["x-tenant-id"] = tenantSlug; 
    }

    // 3. Dispara o PUT purificado para o destino correto
    const response = await fetch(data.uploadUrl, {
      method: "PUT",
      headers: headers,
      body: file, // Binário puro da imagem
    });

    if (!response.ok) {
      throw new Error(`Erro S3: ${response.status}`);
    }

    setUploadedPhotos((prev) => [...prev, data.fileUrl]);

  } catch (err: any) {
    console.error("❌ Falha no Upload:", err);
    alert("Falha no upload: " + err.message);
  } finally {
    setIsUploading(false);
  }
};
  const handleFinishReport = async () => {
    console.log("=== 🚀 INICIANDO FLUXO DE SUBMISSÃO ===");
    console.log("DEBUG ESTADO ATUAL:", { token: !!token, tenantSlug, formData });

    if (!token || !tenantSlug) {
      console.warn("❌ ABORTO: Sessão ou Tenant ausentes no Zustand.");
      alert("Sessão inválida. Faça login novamente.");
      return;
    }

    try {
      // Montagem do payload purificado
      const payload = {
        fullName: String(formData.fullName || "").trim(),
        lastName: String(formData.lastName || "").trim(),
        accidentType: formData.accidentType,
        sceneData: {
          background: formData.sceneData?.background || { width: 800, height: 600 },
          elements: formData.sceneData?.elements || [],
        },
        location: {
          lat: Number(formData.lat || coords?.lat || 0),
          lng: Number(formData.lng || coords?.lng || 0),
          address: String(formData.address || addressInput || "").trim(),
        },
        photos: uploadedPhotos,
      };

      console.log("📦 PAYLOAD MONTADO PARA ENVIO:", payload);

      // Validação local minuciosa com logs explícitos
      if (!payload.fullName || !payload.lastName || !payload.accidentType || !payload.location.address) {
        console.warn("❌ ABORTO: Validação local falhou. Campos em falta:", {
          fullName: !payload.fullName,
          lastName: !payload.lastName,
          accidentType: !payload.accidentType,
          address: !payload.location.address,
        });
        alert("Por favor, preencha todos os campos obrigatórios antes de finalizar.");
        return;
      }

      console.log("✈️ DISPARANDO REQUISIÇÃO POST PARA /accidents...");
      const response = await apiClient.post("/accidents", payload);
      
      console.log("✅ RESPOSTA DA API RECEBIDA:", response.data);
      alert("Sinistro relatado com sucesso!");
        
      // Reset estrito dos estados locais e do store global
      setUploadedPhotos([]);
      setSignedPhotoUrls({});
      setAddressInput("");

      updateFormData({
        fullName: "",
        lastName: "",
        accidentType: "",
        address: "",
        lat: 0,
        lng: 0,
        sceneData: { background: null, elements: [] },
        photos: [],
      });

      setStep(1);
    } catch (error: any) {
      console.error("🔥 ERRO CAPTURADO NO CATCH DO FRONTEND:", error);
      if (error.response) {
        console.error("Dados da resposta do erro:", error.response.data);
      }
      alert(error.response?.data?.error || "Erro interno ao conectar com a API.");
    }
  };


  return {
    formData,
    step,
    setStep,
    updateFormData,
    addressInput,
    suggestions,
    isUploading,
    uploadedPhotos,
    signedPhotoUrls,
    handleAddressInput,
    handleSelectAddress,
    handlePhotoUpload,
    handleFinishReport,
  };
};