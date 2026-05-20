// apps/web/src/components/canvas/elements/VehicleElements.tsx
import React from 'react';
import { Group, Rect, Circle } from 'react-konva';

export const CarElement = ({ color, width = 60, height = 30, flipped = false }: { color: string; width?: number; height?: number; flipped?: boolean}) => (
  <Group scaleX={flipped ? -1 : 1} offsetX={flipped ? width : 0}>
    {/* Cabine (Mais recuada para a direita, definindo a frente na esquerda) */}
    <Rect x={width * 0.4} y={0} width={width * 0.5} height={height * 0.5} fill={color} stroke="#1e293b" strokeWidth={1} cornerRadius={[4, 4, 0, 0]} />
    <Rect x={width * 0.45} y={height * 0.1} width={width * 0.2} height={height * 0.3} fill="#38bdf8" opacity={0.7} />

    {/* Chassi Base */}
    <Rect x={0} y={height * 0.4} width={width} height={height * 0.4} fill={color} stroke="#1e293b" strokeWidth={1} cornerRadius={[2, 4, 2, 2]} />

    {/* Sinalização de Direção (Farol Amarelo na Esquerda = Frente) */}
    <Rect x={0} y={height * 0.45} width={3} height={height * 0.15} fill="#fef08a" />
    <Rect x={width - 3} y={height * 0.45} width={3} height={height * 0.15} fill="#f87171" />

    {/* Rodas */}
    <Circle x={width * 0.25} y={height * 0.8} radius={height * 0.18} fill="#1e293b" />
    <Circle x={width * 0.75} y={height * 0.8} radius={height * 0.18} fill="#1e293b" />
  </Group>
);

export const TruckElement = ({ width = 70, height = 35, flipped = false }: { width?: number; height?: number; flipped?: boolean }) => (
  <Group scaleX={flipped ? -1 : 1} offsetX={flipped ? width : 0}>
    {/* Caçamba / Carga (Traseira na Esquerda) */}
    <Rect x={0} y={0} width={width * 0.65} height={height * 0.7} fill="#94a3b8" stroke="#1e293b" strokeWidth={1} />
    
    {/* Cabine (Frente na Direita) */}
    <Rect x={width * 0.68} y={height * 0.15} width={width * 0.32} height={height * 0.55} fill="#475569" stroke="#1e293b" strokeWidth={1} cornerRadius={[4, 4, 0, 0]} />
    <Rect x={width * 0.75} y={height * 0.23} width={width * 0.15} height={height * 0.2} fill="#38bdf8" opacity={0.7} />
    <Rect x={width - 3} y={height * 0.45} width={3} height={height * 0.15} fill="#fef08a" />

    {/* Rodas */}
    <Circle x={width * 0.2} y={height * 0.8} radius={height * 0.18} fill="#1e293b" />
    <Circle x={width * 0.45} y={height * 0.8} radius={height * 0.18} fill="#1e293b" />
    <Circle x={width * 0.82} y={height * 0.8} radius={height * 0.18} fill="#1e293b" />
  </Group>
);