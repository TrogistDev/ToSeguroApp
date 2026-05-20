// apps/web/src/components/LanguageSelector.tsx
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/Button";

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = i18n.language || "es";

  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
      console.log(`[i18n] Idioma alterado com sucesso para: ${lng}`);
      setIsOpen(false); // Fecha o menu síncronamente após o sucesso
    } catch (error) {
      console.error("[i18n] Erro ao alternar o idioma:", error);
    }
  };

  // Técnica rígida para fechar o dropdown ao clicar fora do componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Botão Gatilho (Exibe o idioma atual) */}
      <Button
        variant="primary"
        className="px-4 py-2 h-9 text-xs font-bold transition-all duration-200 flex items-center gap-1.5 rounded-lg shadow-sm uppercase"
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
      >
        <span>{currentLanguage.slice(0, 2)}</span>
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {/* Dropdown com as opções */}
      {isOpen && (
        <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-100 rounded-lg shadow-xl z-50 p-1 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-0.5">
            {/* Opção: Espanhol */}
            <button
              type="button"
              onClick={() => changeLanguage("es")}
              className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors flex items-center justify-between ${
                currentLanguage.startsWith("es")
                  ? "bg-blue-50 text-blue-600 font-bold"
                  : "text-gray-700 hover:bg-gray-50 font-semibold"
              }`}
            >
              <span>Espanhol</span>
              {currentLanguage.startsWith("es") && (
                <span className="text-[9px] font-mono bg-blue-100 px-1 rounded text-blue-700 font-bold">ES</span>
              )}
            </button>

            {/* Opção: Inglês */}
            <button
              type="button"
              onClick={() => changeLanguage("en")}
              className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors flex items-center justify-between ${
                currentLanguage.startsWith("en")
                  ? "bg-blue-50 text-blue-600 font-bold"
                  : "text-gray-700 hover:bg-gray-50 font-semibold"
              }`}
            >
              <span>Inglês</span>
              {currentLanguage.startsWith("en") && (
                <span className="text-[9px] font-mono bg-blue-100 px-1 rounded text-blue-700 font-bold">EN</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};