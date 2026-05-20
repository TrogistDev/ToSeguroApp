// apps/web/src/components/canvas/elements/SunElement.tsx
import React, { useRef } from "react";
import { Group, Circle, Line } from "react-konva";

interface SunProps {
  radius?: number;
  opacity?: number;
  angle?: number; // ângulo de rotação dos raios
}

export const SunElement: React.FC<SunProps> = ({ 
  radius = 40, 
  opacity = 1,
  angle = 0 
}) => {
  const groupRef = useRef<any>(null);
  
  // Simulação simples de rotação via prop (não animação contínua para performance)
  // Para animar no futuro: usar `useEffect` com requestAnimationFrame
  return (
    <Group ref={groupRef}>
      {/* Raios do sol */}
      {[...Array(12)].map((_, i) => {
        const rot = (i * 30 + angle) * (Math.PI / 180);
        const cos = Math.cos(rot);
        const sin = Math.sin(rot);
        
        return (
          <Line
            key={i}
            points={[0, -radius, 0, -radius * 2.5]}
            stroke={canvasTheme.colors.sunRays}
            strokeWidth={4}
            opacity={opacity}
            rotation={(i * 30 + angle)} // Konva usa graus
            centerPoint={{ x: 0, y: 0 }}
          />
        );
      })}

      {/* Núcleo do sol */}
      <Circle
        radius={radius}
        fill={canvasTheme.colors.sunCore}
        opacity={opacity * 0.95}
      />
    </Group>
  );
};
