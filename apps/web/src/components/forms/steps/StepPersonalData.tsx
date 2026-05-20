import React from "react";

interface StepPersonalDataProps {
  formData: any;
  addressInput: string;
  suggestions: google.maps.places.AutocompletePrediction[];
  updateFormData: (changes: Partial<any>) => void;
  handleAddressInput: (value: string) => void;
  handleSelectAddress: (
    prediction: google.maps.places.AutocompletePrediction,
  ) => void;
  onNext: () => void;
}

export const StepPersonalData: React.FC<StepPersonalDataProps> = ({
  formData,
  addressInput,
  suggestions,
  updateFormData,
  handleAddressInput,
  handleSelectAddress,
  onNext,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Dados da ocorrência
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Insira as informações básicas para registrar o sinistro.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Nome</span>
          <input
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white"
            value={formData.fullName || ""}
            onChange={(event) =>
              updateFormData({ fullName: event.target.value })
            }
            placeholder="Seu nome"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Sobrenome</span>
          <input
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white"
            value={formData.lastName || ""}
            onChange={(event) =>
              updateFormData({ lastName: event.target.value })
            }
            placeholder="Sobrenome"
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">
          Tipo de acidente
        </span>
        <select
          className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white"
          value={formData.accidentType || ""}
          onChange={(event) =>
            updateFormData({ accidentType: event.target.value })
          }
        >
          <option value="">Selecione</option>
          <option value="colisão">Colisão</option>
          <option value="capotamento">Capotamento</option>
          <option value="atropelamento">Atropelamento</option>
          <option value="queda">Queda</option>
          <option value="outro">Outro</option>
        </select>
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Endereço</span>
        <input
          className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white"
          value={addressInput}
          onChange={(event) => handleAddressInput(event.target.value)}
          placeholder="Digite o endereço ou use GPS"
        />
      </label>

      {suggestions.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          {suggestions.map((item) => (
            <button
              key={item.place_id}
              type="button"
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100"
              onClick={() => handleSelectAddress(item)}
            >
              {item.description}
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};
