// apps/web/src/constants/CanvasMetrics.ts

export const TOTAL_METERS = 100;

// Altura fixa desejada em mobile: 500px (para caber na tela)
const DESKTOP_HEIGHT_PX = 600;
const MOBILE_HEIGHT_PX = 500;

// Largura máxima em desktop (sem scroll)
export const CANVAS_WIDTH_PX = 800;
export const CANVAS_HEIGHT_PX = 500; // ← fixo para manter proporção
export const PIXELS_PER_METER = CANVAS_WIDTH_PX / TOTAL_METERS;

// ✅ Nova lógica: mobile → altura fixa (500), largura ajustada à tela
// desktop → usa até 800px de largura, altura proporcional (600)
export const getCanvasDimensions = (viewportWidth: number) => {
  // Mobile: altura fixa = 500, largura = 90% da viewport ou 293px (máximo)
  if (viewportWidth < 768) {
    const maxMobileWidth = Math.min(viewportWidth * 0.9, 293);
    return {
      width: maxMobileWidth,
      height: MOBILE_HEIGHT_PX,
    };
  }

  // Desktop: largura ≤ 800, altura proporcional (ex: 600)
  const desktopWidth = Math.min(viewportWidth - 40, 800); // -40 para padding
  return {
    width: desktopWidth,
    height: (desktopWidth * DESKTOP_HEIGHT_PX) / CANVAS_WIDTH_PX, // mantém proporção 800x600 → 4:3
  };
};
