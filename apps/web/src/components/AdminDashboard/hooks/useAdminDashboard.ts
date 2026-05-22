import { useState, useEffect, type FormEvent } from "react";
import { useAuthStore } from "../../../store/authStore";
import { useTranslation } from "react-i18next";
import apiClient from "../../../api/apiClient";
import { downloadJson } from "../../../utils/downloadJson"; // ✅ Garante a importação correta da utilidade

export const useAdminDashboard = () => {
  const { token, tenantSlug } = useAuthStore();
  const [accidents, setAccidents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { t } = useTranslation();

  // ✅ 1. LISTAGEM DE SINISTROS
  const fetchAccidents = async () => {
    if (!token || !tenantSlug) return;
    try {
      const res = await apiClient.get(`/accidents`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-tenant-id": tenantSlug,
        },
      });
      setAccidents(res.data);
    } catch (err) {
      console.error("❌ Erro ao carregar acidentes no Dashboard:", err);
    }
  };

  useEffect(() => {
    void fetchAccidents();
  }, [token, tenantSlug]);

  // ✅ 2. FUNÇÃO DE EXPORTAÇÃO CORRIGIDA E DECLARADA
  const exportAccident = async (id: string) => {
    if (!token || !tenantSlug) return;
    try {
      console.log(`⏳ A solicitar exportação do sinistro: ${id}`);
      
      // Faz o fetch ao teu endpoint Express: /api/accidents/:id/export
      const res = await apiClient.get(`/accidents/${id}/export`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-tenant-id": tenantSlug,
        },
      });

      const filename = `sinistro-${id}-${new Date().toISOString().split("T")[0]}.json`;
      
      // Dispara o download em blob no cliente
      downloadJson(filename, res.data);
      console.log("✅ Download do ficheiro JSON executado.");
    } catch (err: any) {
      console.error("❌ Erro crítico ao exportar o sinistro:", err);
      alert(err.response?.data?.error || "Falha ao exportar o ficheiro.");
    }
  };

  // ✅ 3. CRIAÇÃO DE UTILIZADORES ADMIN
  const handleCreateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await apiClient.post(
        "/auth/admin-create",
        { email, firstName, lastName, role, tenantId: tenantSlug },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "x-tenant-id": tenantSlug 
          } 
        },
      );

      setSuccessMsg(t("dashboard.successTitle"));
      setEmail("");
      setFirstName("");
      setLastName("");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || t("error.generic"));
    }
  };

  return {
    accidents,
    exportAccident, // ✅ Agora sim, a referência existe no escopo!
    refetchAccidents: fetchAccidents,
    isModalOpen,
    setIsModalOpen,
    email,
    setEmail,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    role,
    setRole,
    successMsg,
    errorMsg,
    t,
    handleCreateUser,
  };
};