import { useTranslation } from "react-i18next";
import { normalizeTranslationKey } from "../../../utils/translation";

interface Accident {
  id: string;
  fullName: string;
  lastName: string;
  accidentType: string;
  addressText: string;
  createdAt: string;
}

interface Props {
  accidents: Accident[];
  t: (key: string) => string;
  onExport?: (id: string) => void; // ← opcional, se quiser passar handler
}

export const AccidentTableUI: React.FC<Props> = ({ accidents, t, onExport }) => (
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
                <td className="p-4 font-medium text-slate-700">{`${acc.fullName} ${acc.lastName}`}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700 rounded border border-amber-200">
                    {t(`steps.personalData.options.${normalizeTranslationKey(acc.accidentType)}`)}
                  </span>
                </td>
                <td className="p-4 text-slate-500 max-w-xs truncate">{acc.addressText}</td>
                <td className="p-4 text-slate-400">
                  {new Date(acc.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <button
                    onClick={() => onExport?.(acc.id)}
                    className="text-blue-600 hover:text-blue-800 underline px-2"
                  >
                    {t("dashboard.exportBtn")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
