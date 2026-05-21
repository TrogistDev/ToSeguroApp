// apps/web/src/styles/canvasTheme.ts (atualizado)
export const canvasTheme = {
  text: { color: '#ffffff', fontSize: 14, fontFamily: 'sans-serif' },
  selection: { stroke: '#ef4444', strokeWidth: 2 },

  // ✨ NOVO: Camadas e prioridade visual
  layersZ: [
    "sky",           // 0 (fundo)
    "sun",           // 1
    "rain_stroke",   // 2
    "ground",        // 3 (ex: terra, grama)
    "road",          // 5
    "water",         // 4 (lago, alagamento) → abaixo da estrada
    "pothole",
    "objects",       // 6 (veículos, sinalização, danos)
  ] as const,

  colors: {
    sky: "#f1f5f9",
    sunRays: "rgba(253, 224, 71, 0.8)",   // yellow-300 com opacidade
    sunCore: "rgb(251, 191, 36)",          // yellow-400
    rainStroke: "rgba(59, 130, 246, 0.2)", // blue-500 com opacidade baixa
    waterStill: "#bfdbfe",
    waterMoving: "#93c5fd",
  },

  // ✨ NOVO: Estilos de animação (via Konva)
  animations: {
    sunRaysSpeed: 2,          // rotação por frame (baixo para suavidade)
    rainStrokeLength: 40,     // pixels
    rainStrokeSpacing: 12,    // pixels entre gotas
    waterOpacityBase: 0.3,
    waterOpacityMax: 0.5,
  },

};
