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
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>(
    formData.photos || [],
  );
  const [signedPhotoUrls, setSignedPhotoUrls] = useState<
    Record<string, string>
  >({});
  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);

  const fetchSignedUrl = async (fullUrl: string) => {
    const key = fullUrl.split(".amazonaws.com/")[1];
    try {
      const { data } = await apiClient.get(`/accidents/photo-url`, {
        params: { key },
      });
      setSignedPhotoUrls((prev) => ({ ...prev, [fullUrl]: data.url }));
    } catch (err) {
      console.error("Erro ao assinar URL:", err);
    }
  };

  useEffect(() => {
    uploadedPhotos.forEach((url) => {
      if (!signedPhotoUrls[url]) fetchSignedUrl(url);
    });
    updateFormData({ photos: uploadedPhotos });
  }, [uploadedPhotos, signedPhotoUrls, updateFormData]);

  useEffect(() => {
    if (!window.google) return;
    autocompleteService.current =
      new window.google.maps.places.AutocompleteService();
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
        (err) => console.error("GPS negada:", err),
      );
    }
  }, [captureGPS, updateFormData]);

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

  const handleSelectAddress = (
    prediction: google.maps.places.AutocompletePrediction,
  ) => {
    setAddressInput(prediction.description);
    setSuggestions([]);
    updateFormData({ address: prediction.description });
  };

  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setIsUploading(true);

    try {
      const file = e.target.files[0];
      const { data } = await apiClient.get(`/accidents/presigned-url`, {
        params: {
          fileName: file.name,
          fileType: file.type,
        },
      });

      const response = await fetch(data.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!response.ok) throw new Error(`Erro S3: ${response.status}`);
      setUploadedPhotos((prev) => [...prev, data.fileUrl]);
    } catch (err: any) {
      alert("Falha no upload: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFinishReport = async () => {
    if (!token || !tenantSlug) {
      alert("Sessão inválida.");
      return;
    }

    try {
      const payload = {
        fullName: formData.fullName,
        lastName: formData.lastName,
        accidentType: formData.accidentType,
        sceneData: {
          background: formData.sceneData?.background || null,
          elements: formData.sceneData?.elements || [],
        },
        location: {
          lat: formData.lat || 0,
          lng: formData.lng || 0,
          address: formData.address || addressInput,
        },
        photos: uploadedPhotos,
      };

      await apiClient.post("/accidents", payload);
      alert("Sinistro relatado com sucesso!");
      setUploadedPhotos([]);

      updateFormData({
        fullName: "",
        lastName: "",
        accidentType: "",
        address: "",
        lat: 0,
        lng: 0,
        sceneData: {
          background: null,
          elements: [],
        },
      });

      setStep(1);
    } catch (error: any) {
      alert(
        error.response?.data?.error || "Erro interno ao conectar com a API.",
      );
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
