import { useState, useEffect } from "react";
import axios from "axios";

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

  useEffect(() => {
    const fetchAccidents = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/accidents", {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-Slug": tenantSlug,
          },
        });
        setAccidents(res.data);
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard", err);
      }
    };

    fetchAccidents();
  }, [token, tenantSlug]);

  return { accidents, refetchAccidents: () => {} }; // pode adicionar função de refetch se necessário
};
