import { useState } from "react";
import apiClient from "../../../api/apiClient";
import { useTranslation } from "react-i18next";

export const useCreateUser = (token: string) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { t } = useTranslation();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // ✅ USANDO O APICLIENT: Ele já respeita a baseURL configurada no .env
      await apiClient.post(
        "/auth/admin-create",
        { email, firstName, lastName, role },
        { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        }
      );
      
      setSuccessMsg(t("dashboard.successTitle"));
      resetFormAndMessages();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || t("error.generic"));
    }
  };

  const resetFormAndMessages = () => {
    setSuccessMsg(null);
    setErrorMsg(null);
    setEmail("");
    setFirstName("");
    setLastName("");
    setRole("USER");
  };

  return {
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
  };
};