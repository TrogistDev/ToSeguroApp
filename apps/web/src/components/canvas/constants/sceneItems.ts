import { SceneObjectType } from "../../../types/scene";

interface MapItem {
  type: SceneObjectType;
  label: string;
  className?: string;
}

interface ItemGroup {
  id: number;
  title: string;
  gridCols: 2 | 3;
  items: MapItem[];
}

export const SCENE_MENU_GROUPS: ItemGroup[] = [
  {
    id: 1,
    title: "1. Vias",
    gridCols: 2,
    items: [
      { type: "road_straight", label: "Mão Dupla" },
      { type: "road_oneway", label: "Mão Única" },
    ],
  },
  {
    id: 2,
    title: "2. Veículos e Agentes",
    gridCols: 3,
    items: [
      { type: "car", label: "Carro" },
      { type: "truck", label: "Caminhão" },
      { type: "pedestrian", label: "Pedestre" },
    ],
  },
  {
    id: 3,
    title: "3. Sinalização",
    gridCols: 2,
    items: [
      { type: "stop_sign", label: "Placa PARE" },
      { type: "crosswalk", label: "Faixa Pedestre" },
      { type: "traffic_light_red", label: "Sinal Vermelho" },
      { type: "traffic_light_green", label: "Sinal Verde" },
      { type: "traffic_light_yellow", label: "Sinal Amarelo" },
      { 
        type: "guard_rail", 
        label: "Guard Rail", 
        className: "col-span-2 hover:bg-slate-200 border-slate-300 font-bold" 
      },
    ],
  },
  {
    id: 4,
    title: "4. Danos (Evidência)",
    gridCols: 3,
    items: [
      { type: "damage_light", label: "Leve", className: "border-red-200 text-red-600 hover:bg-red-50" },
      { type: "damage_moderate", label: "Médio", className: "border-red-300 text-red-600 hover:bg-red-50" },
      { type: "damage_severe", label: "Grave", className: "border-red-400 text-red-600 hover:bg-red-50" },
    ],
  },{
    id: 5,
    title: "5. Ambiente e Riscos",
    gridCols: 2,
    items: [
      { 
        type: "water", 
        label: "Água / Alagamento", 
        className: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 font-bold" 
      },
      { 
        type: "pothole", 
        label: "Buraco", 
        className: "border-slate-300 text-slate-700 hover:bg-slate-200" 
      },
    ],
  },
   {
    id: 6,
    title: "6. Clima",
    gridCols: 2,
    items: [
      { type: "sun", label: "Sol ☀️", className: "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100 font-bold" },
      { 
        type: "rain_stroke", 
        label: "Chuva 🌧️",
        className: "bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100 font-bold"
      },
    ],
  },
  
];