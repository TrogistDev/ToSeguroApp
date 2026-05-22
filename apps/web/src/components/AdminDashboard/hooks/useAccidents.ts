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

  const fetchAccidents = useCallback(async () => {
    if (!token || !tenantSlug) return;
    try {
      const res = await apiClient.get("/accidents", {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-tenant-id": tenantSlug, // ✅ Alinhamento Rígido
        }
      });
      setAccidents(res.data);
    } catch (err) {
      console.error("Erro ao carregar dados do dashboard", err);
    }
  }, [token, tenantSlug]);

  useEffect(() => {
    fetchAccidents();
  }, [fetchAccidents]);

  return { accidents, refetchAccidents: fetchAccidents };
};