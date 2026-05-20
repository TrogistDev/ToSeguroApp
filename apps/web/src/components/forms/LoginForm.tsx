// apps/web/src/components/forms/LoginForm.tsx
import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../ui/Button";
import { useTranslation } from "react-i18next";
import axios from "axios";

export const LoginForm: React.FC = () => {
  const loginGlobal = useAuthStore((state) => state.login);
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const BACKEND_URL = "http://localhost:3000/api";

  const handleAuthSuccess = (token: string, tenantSlug: string, user: any) => {
    loginGlobal(token, tenantSlug, user);

    if (user.role === "ADMIN") {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/sinistros/novo";
    }
  };

  const handleTraditionalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/auth/login`, {
        email,
        password,
      });

      const { token, tenantSlug, user } = response.data;
      handleAuthSuccess(token, tenantSlug, user);
    } catch (error: any) {
      setErrorMsg(t("auth_error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      {/* Subtítulo traduzido dinamicamente com quebra responsiva de texto */}
      <p className="text-xs sm:text-sm text-slate-500 text-center leading-relaxed">
        {t("login_subtitle")}
      </p>

      {errorMsg && (
        <div className="p-3 text-xs sm:text-sm bg-red-50 border border-red-200 text-red-600 rounded-lg font-medium text-center">
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleTraditionalSubmit} className="space-y-4 text-left w-full">
        <div>
          <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
            {t("email_label")}
          </label>
          <input
            type="email"
            required
            placeholder="seu-email@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 sm:p-2.5 text-sm border border-slate-200 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
            {t("password_label")}
          </label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 sm:p-2.5 text-sm border border-slate-200 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-sm shadow-lg shadow-blue-100 disabled:opacity-50"
        >
          {isLoading ? t("btn_loading") : t("btn_enter")}
        </Button>
      </form>

      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-400">{t("or_separator")}</span>
        </div>
      </div>

      {/* Contêiner adaptável para ajustar o iframe do Google à largura do card */}
      <div className="w-full flex justify-center overflow-hidden">
        <div className="w-full max-w-full min-w-[200px] flex justify-center">
          <GoogleLogin
            theme="outline"
            size="large"
            shape="rectangular"
            width="100%" // Garante ocupação de espaço proporcional dentro do container flex
            onSuccess={async (credentialResponse) => {
              setErrorMsg(null);
              try {
                const res = await axios.post(`${BACKEND_URL}/auth/google`, {
                  googleToken: credentialResponse.credential,
                });

                const { token, tenantSlug, user } = res.data;
                handleAuthSuccess(token, tenantSlug, user);
              } catch (error: any) {
                setErrorMsg(t("auth_error"));
              }
            }}
            onError={() => {
              setErrorMsg("Google Auth Error");
            }}
          />
        </div>
      </div>
    </div>
  );
};