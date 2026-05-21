import { useState, useEffect, useRef } from "react";
import { SceneElement, SceneObjectType } from "../../../types/scene";
import { useReportStore } from "../../../store/useReportStore";
import { getCanvasDimensions } from "../constants/CanvasMetrics";

export const useSceneCanvas = () => {
  const { updateFormData, formData } = useReportStore();
  const { width, height } = getCanvasDimensions(window.innerWidth);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState(() => {
  // ✅ Calcula no primeiro render (evita flash)
  const { width, height } = getCanvasDimensions(window.innerWidth);
  return { width, height };
});

  const [background, setBackground] = useState<SceneObjectType | null>(
    formData.sceneData?.background || null,
  );
  const [elements, setElements] = useState<SceneElement[]>(
    formData.sceneData?.elements || [],
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (formData?.sceneData) {
      if (formData.sceneData.background)
        setBackground(formData.sceneData.background);
      if (formData.sceneData.elements) setElements(formData.sceneData.elements);
    }
  }, [formData?.sceneData]);

   useEffect(() => {
  const updateSize = () => {
    const { width, height } = getCanvasDimensions(window.innerWidth);
    setCanvasSize({ width, height });
  };

  // Chama uma vez agora
  updateSize();
  
  // E escuta resize
  window.addEventListener("resize", updateSize);
  return () => window.removeEventListener("resize", updateSize);
}, []);

  const updateStore = (bg: SceneObjectType | null, els: SceneElement[]) => {
    updateFormData({ sceneData: { background: bg, elements: els } });
  };

  const addObjectAtPosition = (
    type: SceneObjectType,
    clickX: number, 
    clickY: number
  ) => {
    if (type.includes("road")) {
      setBackground(type);
      updateStore(type, elements);
      return;
    }

     // Defina margem segura baseada no tamanho do elemento
  const padding = 30;

  // Garanta que o clique não fique muito perto da borda
  let safeX = Math.max(padding, Math.min(clickX, canvasSize.width - padding));
  let safeY = Math.max(padding, Math.min(clickY, canvasSize.height - padding));

   const width = type.includes("damage")
    ? 30
    : type === "car"
      ? 40
      : type === "truck"
        ? 60
        : type === "traffic_light_red" || type === "traffic_light_yellow" || type === "traffic_light_green"
          ? 18
          : type === "pole" || type === "tree" || type === "guard_rail"
            ? 30
            : 40;

  const height = type.includes("damage")
    ? 30
    : type === "car"
      ? 20
      : type === "truck"
        ? 25
        : type === "traffic_light_red" || type === "traffic_light_yellow" || type === "traffic_light_green"
          ? 60
          : type === "pole" || type === "tree" || type === "guard_rail"
            ? 40
            : 40;

 const x = safeX; // ← já é o centro (por causa do offsetX no Group)
  const y = safeY;

   const newElement: SceneElement = {
    id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
   x, // ← soma de volta metade da largura (para compensar o offsetX)
  y ,
    rotation: 0,
    width,
    height,
    color:
      type === "car" ? "#3b82f6" : 
      type === "truck" ? "#eab308" : 
      type === "cone" ? "#f97316" : 
      type.includes("damage") ? "#ef4444" : "#60a5fa",
    flipped: false,
  };

    const updatedElements = [...elements, newElement];
    setElements(updatedElements);
    updateStore(background, updatedElements);
  };

  // ✅ Mantenha o `addObject` antigo apenas para compatibilidade (ex: menu)
  const addObject = (type: SceneObjectType) => {
    // Fallback: adiciona no centro do canvas se não tiver coordenadas
    const centerX = canvasSize.width / 2 ;
    const centerY = canvasSize.height / 2 ;
    addObjectAtPosition(type, centerX, centerY);
  };

  const deleteElement = (id: string) => {
    const updatedElements = elements.filter((el) => el.id !== id);
    setElements(updatedElements);
    if (selectedId === id) setSelectedId(null);
    updateStore(background, updatedElements);
  };

  const flipElement = (id: string) => {
    const updatedElements = elements.map((el) =>
      el.id === id ? { ...el, flipped: !el.flipped } : el,
    );
    setElements(updatedElements);
    updateStore(background, updatedElements);
  };

  const updateElementPosition = (id: string, x: number, y: number) => {
    const updated = elements.map((item) =>
      item.id === id ? { ...item, x, y } : item,
    );
    setElements(updated);
    updateStore(background, updated);
  };

  const exportScene = () => {
    updateStore(background, elements);
    alert("Cena salva com sucesso no contexto do relatório!");
  };

  return {
    background,
    elements,
    selectedId,
    setSelectedId,
   addObject, // fallback
  addObjectAtPosition, // novo: com clique preciso
    deleteElement,
    flipElement,
    updateElementPosition,
    exportScene,
    canvasWidth: canvasSize.width,
    canvasHeight: canvasSize.height,
  };
};
