import { Button } from "../../ui/Button";
import { useTranslation } from "react-i18next";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  role: "USER" | "ADMIN";
  setRole: (val: "USER" | "ADMIN") => void;
  successMsg?: string | null;
  errorMsg?: string | null;
  handleSubmit: (e: React.FormEvent) => void;
}

export const InviteUserModal: React.FC<Props> = ({
  isOpen,
  onClose,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  role,
  setRole,
  successMsg,
  errorMsg,
  handleSubmit,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-black text-slate-900">{t("dashboard.modalTitle")}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
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

        <form onSubmit={handleSubmit} className="space-y-4">
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
  );
};
