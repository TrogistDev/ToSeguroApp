import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/ui/Button";
import { useTranslation } from "react-i18next";
import { normalizeAccidentType } from "./utils/normalizeAccidentType";
import { AccidentTableUI } from "./ui/AccidentTableUI";
import { InviteUserModal } from "./ui/InviteUserModal";
import { HeaderWithAction } from "./ui/HeaderWithAction";
import { useAccidents } from "./hooks/useAccidents";
import { useCreateUser } from "./hooks/useCreateUser";
import React, { useState, useEffect } from "react";

import axios from "axios";
import { downloadJson } from "../../utils/downloadJson";

import { normalizeTranslationKey } from "../utils/translation";

export const AdminDashboard: React.FC = () => {
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

  // ✅ Hooks e state NÃO MUDAM — mantenha tudo como está
  useEffect(() => {
    const fetchAccidents = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/accidents`, {
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

  const handleExport = async (id: string) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/accidents/${id}/export`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      downloadJson(`seguro-accident-${id}.json`, res.data);
    } catch (e) {
      console.error("Export falhou:", e);
      alert(t("dashboard.exportBtn"));
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await axios.post(
        "http://localhost:3000/api/auth/admin-create",
        { email, firstName, lastName, role },
        { headers: { Authorization: `Bearer ${token}` } },
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
      {/* ✅ Novo Header */}
      <HeaderWithAction
        title={t("dashboard.title")}
        subtitle={t("dashboard.subtitle")}
        btnText={t("dashboard.btnInviteUser")}
        onOpenModal={() => {
          setIsModalOpen(true);
          setSuccessMsg(null);
          setErrorMsg(null);
        }}
      />

      {/* ✅ Nova Tabela (com handler opcional) */}
      <AccidentTableUI
        accidents={accidents}
        t={t}
        onExport={handleExport} // ←传递 handleExport aqui!
      />

      {/* ✅ Novo Modal (só abre, form fica no principal) */}
      {isModalOpen && (
        <InviteUserModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSuccessMsg(null);
            setErrorMsg(null);
          }}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          email={email}
          setEmail={setEmail}
          role={role}
          setRole={setRole}
          successMsg={successMsg}
          errorMsg={errorMsg}
        />
      )}

      {/* ✅ Formulário NOVO — fora do modal, mas só aparece quando modal aberto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <form
            onSubmit={handleCreateUser}
            className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4 animate-in zoom-in-95"
          >
            {/* Fields (mesmo código do original, mas sem botão de submit ainda) */}
            <label className="block text-xs font-bold uppercase text-slate-500">
              {t("dashboard.fields.firstName")}
            </label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 border rounded-lg mt-1 outline-none"
            />

            <label className="block text-xs font-bold uppercase text-slate-500">
              {t("dashboard.fields.lastName")}
            </label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 border rounded-lg mt-1 outline-none"
            />

            <label className="block text-xs font-bold uppercase text-slate-500">
              {t("dashboard.fields.email")}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg mt-1 outline-none"
            />

            <label className="block text-xs font-bold uppercase text-slate-500">
              {t("dashboard.fields.role")}
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full p-2 border rounded-lg mt-1 bg-white outline-none"
            >
              <option value="USER">{t("dashboard.roles.USER")}</option>
              <option value="ADMIN">{t("dashboard.roles.ADMIN")}</option>
            </select>

            {/* ✅ Botão de submit aqui, fora do modal */}
            <Button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition"
            >
              {t("dashboard.btnConfirm")}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
