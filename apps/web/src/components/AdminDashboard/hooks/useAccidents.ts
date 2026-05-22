import { useState, useEffect, useCallback } from "react";
import apiClient from "../../../api/apiClient";

interface Accident {
  id: string;
  fullName: string;
  lastName: string;
  accidentType: string;
  addressText: string;
  createdAt: string;
}

export const useAccidents = (token: string, tenantSlug: string) => {
  const [accidents, setAccidents] = useState<Accident[]>([]);

  // ✅ useCallback para permitir que o refetch seja chamado sem re-renderizar o hook desnecessariamente
  const fetchAccidents = useCallback(async () => {
    try {
      // O apiClient já possui a baseURL correta (via VITE_API_URL)
      const res = await apiClient.get("/accidents");
      setAccidents(res.data);
    } catch (err) {
      console.error("Erro ao carregar dados do dashboard", err);
    }
  }, []);

  useEffect(() => {
    fetchAccidents();
  }, [fetchAccidents]);

  return { accidents, refetchAccidents: fetchAccidents };
};