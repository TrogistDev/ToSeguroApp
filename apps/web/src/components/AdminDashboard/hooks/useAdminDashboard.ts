import { useState, useEffect, type FormEvent } from "react";
import { useAuthStore } from "../../../store/authStore";
import { useTranslation } from "react-i18next";
import apiClient from "../../../api/apiClient";

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

  useEffect(() => {
    const fetchAccidents = async () => {
      try {
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

    if (token && tenantSlug) {
      void fetchAccidents();
    }
  }, [token, tenantSlug]);

  const handleCreateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await apiClient.post(
        "/auth/admin-create",
        {
          email,
          firstName,
          lastName,
          role,
          tenantId: tenantSlug,
        },
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

  return {
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
  };
};
