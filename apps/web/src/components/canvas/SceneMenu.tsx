import React from "react";
import { Button } from "../ui/Button";
import { SCENE_MENU_GROUPS } from "./constants/sceneItems";
import { SceneObjectType } from "../../types/scene";

interface SceneMenuProps {
  onAddObject: (type: SceneObjectType) => void;
}

export const SceneMenu: React.FC<SceneMenuProps> = ({ onAddObject }) => (
  <div className="w-full lg:w-64 bg-white rounded-lg shadow-sm flex flex-col gap-4 p-4 border border-slate-400">
    {/* Título principal */}
    <div>
      <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-2">
        + Adicionar ao Mapa
      </h3>
    </div>

    {/* Grid dos itens do menu com design system consistente */}
    <div className="space-y-4 flex-grow overflow-y-auto overscroll-behavior-contain">
      {SCENE_MENU_GROUPS.map((group) => (
        <div key={group.id} className="space-y-2">
          <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest border-b border-slate-400 pb-1">
            {group.title}
          </h4>

          <div
            className={`grid gap-2 ${group.gridCols === 3 ? "grid-cols-3" : "grid-cols-2"} overscroll-behavior-contain`}
          >
            {group.items.map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => onAddObject(item.type)}
                className="
                text-xs py-2 px-2 text-center font-bold text-slate-900 
                border border-slate-400 hover:bg-slate-100 transition-all
                rounded-md break-words whitespace-normal h-auto
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                leading-tight
              "
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
