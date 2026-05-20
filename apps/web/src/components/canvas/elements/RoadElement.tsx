// apps/web/src/components/canvas/elements/RoadElement.tsx
import React from 'react';
import { Group, Rect, Line, Text } from 'react-konva';

export const RoadElement = ({ type, width, height }: { type: string; width: number; height: number }) => {
  return (
    <Group>
      {/* 1. ESTRADA MÃO DUPLA TRADICIONAL */}
      {type === 'road_straight' && (
        <Group>
          <Rect width={width} height={height} fill="#475569" />
          <Line 
            points={[0, height / 2, width, height / 2]} 
            stroke="#eab308" 
            strokeWidth={4} 
            dash={[20, 20]} 
          />
          {/* Textos indicativos das faixas usando o divisor central */}
          <Text x={20} y={(height / 4) - 6} text="FAIXA ESQUERDA" fill="#94a3b8" fontSize={12} fontStyle="bold" letterSpacing={1} />
          <Text x={20} y={((height / 4) * 3) - 6} text="FAIXA DIREITA" fill="#94a3b8" fontSize={12} fontStyle="bold" letterSpacing={1} />
        </Group>
      )}

      {/* 2. NOVA ESTRADA: VIA DE MÃO ÚNICA */}
      {type === 'road_oneway' && (
        <Group>
          {/* Chão todo cinza */}
          <Rect width={width} height={height} fill="#334155" />
          {/* Linha amarela na extremidade superior */}
          <Line points={[0, 8, width, 8]} stroke="#eab308" strokeWidth={3} />
          {/* Linha amarela na extremidade inferior */}
          <Line points={[0, height - 8, width, height - 8]} stroke="#eab308" strokeWidth={3} />
          
          <Text x={width / 2 - 60} y={height / 2 - 6} text="SENTIDO ÚNICO" fill="#64748b" fontSize={14} fontStyle="bold" letterSpacing={2} />
        </Group>
      )}
    </Group>
  );
};