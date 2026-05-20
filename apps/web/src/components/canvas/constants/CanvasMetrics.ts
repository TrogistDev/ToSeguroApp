const TOTAL_METERS = 100;

export const getCanvasDimensions = (viewportWidth: number) => {
  // Mobile: usa 90% da viewport, máximo 600px
  // Desktop: usa até 800px
  if (viewportWidth < 768) {
    const width = Math.min(viewportWidth * 0.9, 400);
    const height = (width * 2) / 3;
    return { width, height };
  }
  // Desktop
  return { width: 800, height: 500 };
};

export const CANVAS_WIDTH_PX = 600;
export const CANVAS_HEIGHT_PX = 400;
export const PIXELS_PER_METER = CANVAS_WIDTH_PX / TOTAL_METERS;
