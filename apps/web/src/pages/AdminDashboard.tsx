import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/Button";
import axios from "axios";
import { downloadJson } from "../utils/downloadJson";
import { useTranslation } from "react-i18next";
import { normalizeTranslationKey } from '../utils/translation';

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

  const handleExport = async (id: string) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/accidents/${id}/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      <div className="flex justify-between items-center flex-wrap gap-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{t("dashboard.title")}</h1>
          <p className="text-sm text-slate-500">{t("dashboard.subtitle")}</p>
        </div>
        <div className="flex items-center">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl w-full sm:w-auto"
          >
            {t("dashboard.btnInviteUser")}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800">{t("dashboard.tableTitle")}</h3>
        </div>
        {accidents.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">{t("dashboard.emptyState")}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold uppercase text-slate-400 border-b border-slate-100">
                  <th className="p-4">{t("dashboard.columns.driver")}</th>
                  <th className="p-4">{t("dashboard.columns.type")}</th>
                  <th className="p-4">{t("dashboard.columns.address")}</th>
                  <th className="p-4">{t("dashboard.columns.date")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {accidents.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-medium text-slate-700">{acc.fullName} {acc.lastName}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700 rounded border border-amber-200">
  {t(`steps.personalData.options.${normalizeTranslationKey(acc.accidentType)}`) || acc.accidentType}
</span>
                    </td>
                    <td className="p-4 text-slate-500 max-w-xs truncate">{acc.addressText}</td>
                    <td className="p-4 text-slate-400">
                      {new Date(acc.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button onClick={() => handleExport(acc.id)}>{t("dashboard.exportBtn")}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-slate-900">{t("dashboard.modalTitle")}</h3>
              <button
                onClick={() => { setIsModalOpen(false); setSuccessMsg(null); }}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 mb-4 text-xs bg-red-50 text-red-600 rounded-lg border border-red-100">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-4 mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">{t("dashboard.successTitle")}</p>
                <p className="text-sm">Usuário criado com sucesso.</p>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <label className="block text-xs font-bold uppercase text-slate-500">{t("dashboard.fields.firstName")}</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border rounded-lg mt-1 outline-none"
              />

              <label className="block text-xs font-bold uppercase text-slate-500">{t("dashboard.fields.lastName")}</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border rounded-lg mt-1 outline-none"
              />

              <label className="block text-xs font-bold uppercase text-slate-500">{t("dashboard.fields.email")}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-lg mt-1 outline-none"
              />

              <label className="block text-xs font-bold uppercase text-slate-500">{t("dashboard.fields.role")}</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full p-2 border rounded-lg mt-1 bg-white outline-none"
              >
                <option value="USER">{t("dashboard.roles.USER")}</option>
                <option value="ADMIN">{t("dashboard.roles.ADMIN")}</option>
              </select>

              <Button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition"
              >
                {t("dashboard.btnConfirm")}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
