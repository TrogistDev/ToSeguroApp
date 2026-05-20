import React from "react";
import { SceneCanvas } from "../../canvas/SceneCanvas";

interface StepFinalizeProps {
  formData: any;
  updateFormData: (changes: Partial<any>) => void;
  onBack: () => void;
  onFinish: () => void;
}

export const StepFinalize: React.FC<StepFinalizeProps> = ({
  formData,
  updateFormData,
  onBack,
  onFinish,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Resumo e confirmação
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Revise os dados e finalize o envio do relatório de sinistro.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">
          Cena do acidente
        </h3>
        <SceneCanvas />
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Voltar
        </button>

        <button
          type="button"
          onClick={onFinish}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          Finalizar relatório
        </button>
      </div>
    </div>
  );
};
