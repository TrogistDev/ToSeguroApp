import React from "react";
import { SceneElement } from "../../types/scene";
import { PIXELS_PER_METER } from "./constants/CanvasMetrics";

interface SceneObjectListProps {
  elements: SceneElement[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onFlip: (id: string) => void;
  onDelete: (id: string) => void;
}

export const SceneObjectList: React.FC<SceneObjectListProps> = ({
  elements,
  selectedId,
  onSelect,
  onFlip,
  onDelete,
}) => (
  <div className="space-y-3">
    <h3 className="font-bold pb-1 text-[20px] text-indigo-700 flex items-center justify-between border-b border-indigo-100">
      <span>Objetos no Mapa</span>
      <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">
        {elements.length}
      </span>
    </h3>

    {elements.length === 0 ? (
      <p className="text-[15px] text-slate-400 italic py-2 text-center">
        Nenhum objeto adicionado ao croqui ainda.
      </p>
    ) : (
      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
        {elements.map((el) => {
          const isCarOrTruck = el.type === "car" || el.type === "truck";
          const isSelected = selectedId === el.id;

          return (
            <div
              key={el.id}
              className={`p-2 rounded-md flex items-center justify-between gap-2 border transition-colors ${
                isSelected
                  ? "bg-indigo-50 border-indigo-300 shadow-sm"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300"
              }`}
            >
              <button
                type="button"
                className="flex items-center gap-2 flex-1 text-left min-w-0"
                onClick={() => onSelect(isSelected ? null : el.id)}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: el.color }}
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-bold text-slate-800 uppercase truncate">
                    {el.type.replace("_", " ")}
                  </span>
                  <span className="text-[10px] text-indigo-600 font-semibold">
                    X: {(el.x / PIXELS_PER_METER).toFixed(1)}m | Y:{" "}
                    {(el.y / PIXELS_PER_METER).toFixed(1)}m
                  </span>
                </div>
              </button>

              <div className="flex gap-1 shrink-0">
                {isCarOrTruck && (
                  <button
                    type="button"
                    title="Inverter Sentido"
                    className={`h-8 w-8 rounded flex items-center justify-center font-bold text-xs shadow-sm border ${
                      el.flipped
                        ? "bg-amber-500 border-amber-600 text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                    onClick={() => onFlip(el.id)}
                  >
                    ⇄
                  </button>
                )}
                <button
                  type="button"
                  title="Remover"
                  className="h-8 w-8 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded flex items-center justify-center font-bold text-xs shadow-sm"
                  onClick={() => onDelete(el.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);
