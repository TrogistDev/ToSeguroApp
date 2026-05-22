import React from "react";
import { Button } from "../../components/ui/Button";
import { AccidentTableUI } from "./ui/AccidentTableUI";
import { InviteUserModal } from "./ui/InviteUserModal";
import { HeaderWithAction } from "./ui/HeaderWithAction";
import { downloadJson } from "../../utils/downloadJson";
import { useAdminDashboard } from "./hooks/useAdminDashboard";

export const AdminDashboard: React.FC = () => {
  const {
    accidents,
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
  } = useAdminDashboard();

  return (
    <div className="space-y-8">
      <HeaderWithAction
        title={t("dashboard.title")}
        subtitle={t("dashboard.subtitle")}
        btnText={t("dashboard.btnInviteUser")}
        onOpenModal={() => setIsModalOpen(true)}
      />

      <AccidentTableUI
        accidents={accidents}
        t={t}
        onExport={/* ... */ () => {}}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4">
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full p-2 border rounded"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <Button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                {t("dashboard.btnConfirm")}
              </Button>
            </form>
            <Button
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-gray-200"
            >
              Fechar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
