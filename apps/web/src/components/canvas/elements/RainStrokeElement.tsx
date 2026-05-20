// apps/web/src/components/canvas/elements/RainStrokeElement.tsx
import React, { useMemo } from "react";
import { Group, Line } from "react-konva";

interface RainProps {
  count?: number;
  angle?: number; // ex: -25 graus
  opacity?: number; // 0.1–0.4
}

export const RainStrokeElement: React.FC<RainProps> = ({ 
  count = 30, 
  angle = -25,
  opacity = 0.2
}) => {
  const rainStrokes = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      // Posição aleatória, mas com distribuição controlada (grid simulado)
      const xBase = (i % 6) * (100 / 6);
      const yBase = Math.floor(i / 6) * 25;
      
      return (
        <Line
          key={i}
          points={[xBase + Math.random() * 10, yBase, xBase + Math.random() * 10 + 8, yBase + 25]}
          stroke={canvasTheme.colors.rainStroke}
          strokeWidth={1.5}
          opacity={opacity}
          rotation={angle} // Konva aceita rotação diretamente
          x={0}
          y={0}
        />
      );
    });
  }, [count, angle, opacity]);

  return <Group>{rainStrokes}</Group>;
};
