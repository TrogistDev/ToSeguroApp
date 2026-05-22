import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/ui/Button";
import { useTranslation } from "react-i18next";
import { AccidentTableUI } from "./ui/AccidentTableUI";
import { InviteUserModal } from "./ui/InviteUserModal";
import { HeaderWithAction } from "./ui/HeaderWithAction";
import apiClient from "../../api/apiClient"; // IMPORTANTE: Use o client configurado
import { downloadJson } from "../../utils/downloadJson";

export const AdminDashboard: React.FC = () => {
  const { token, tenantSlug } = useAuthStore();
  const [accidents, setAccidents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State do formulário
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const { t } = useTranslation();

  useEffect(() => {
    const fetchAccidents = async () => {
      try {
        // Usa o apiClient para evitar erro de rede privada
        const res = await apiClient.get(`/accidents`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-Slug": tenantSlug,
          },
        });
        setAccidents(res.data);
      } catch (err) {
        console.error("Erro ao carregar acidentes", err);
      }
    };
    fetchAccidents();
  }, [token, tenantSlug]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      // ✅ CORREÇÃO: Usando apiClient em vez de axios com URL absoluta
      await apiClient.post(
        "/auth/admin-create",
        { email, firstName, lastName, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMsg(t("dashboard.successTitle"));
      setEmail("");
      setFirstName("");
      setLastName("");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || t("error.generic"));
    }
  };

  return (
    <div className="space-y-8">
      <HeaderWithAction
        title={t("dashboard.title")}
        subtitle={t("dashboard.subtitle")}
        btnText={t("dashboard.btnInviteUser")}
        onOpenModal={() => setIsModalOpen(true)}
      />

      <AccidentTableUI accidents={accidents} t={t} onExport={/* ... */ () => {}} />

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4">
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full p-2 border rounded" />
              <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full p-2 border rounded" />
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 border rounded" />
              <select value={role} onChange={e => setRole(e.target.value as any)} className="w-full p-2 border rounded">
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <Button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
                {t("dashboard.btnConfirm")}
              </Button>
            </form>
            <Button onClick={() => setIsModalOpen(false)} className="w-full bg-gray-200">Fechar</Button>
          </div>
        </div>
      )}
    </div>
  );
};