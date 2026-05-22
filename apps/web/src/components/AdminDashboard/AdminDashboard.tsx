import React from "react";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../components/ui/Button";
import { useTranslation } from "react-i18next";
import { normalizeAccidentType } from "./utils/normalizeAccidentType";
import { AccidentTable } from "./ui/AccidentTable";
import { InviteUserModal } from "./ui/InviteUserModal";
import { HeaderWithAction } from "./ui/HeaderWithAction";
import { useAccidents } from "./hooks/useAccidents";
import { useCreateUser } from "./hooks/useCreateUser";

export const AdminDashboard: React.FC = () => {
  const { token, tenantSlug } = useAuthStore();
  const { t } = useTranslation();

  const { accidents, refetchAccidents } = useAccidents(token, tenantSlug);

  const {
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
    handleCreateUser,
    resetFormAndMessages,
  } = useCreateUser(token);

  return (
    <div className="space-y-8">
      <HeaderWithAction
        title={t("dashboard.title")}
        subtitle={t("dashboard.subtitle")}
        btnText={t("dashboard.btnInviteUser")}
        onOpenModal={() => {
          setIsModalOpen(true);
          resetFormAndMessages();
        }}
      />

      <AccidentTable
        accidents={accidents}
        t={t}
        normalizeAccidentType={normalizeAccidentType}
      />

      {isModalOpen && (
        <InviteUserModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            resetFormAndMessages();
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
          handleSubmit={handleCreateUser}
        />
      )}
    </div>
  );
};
