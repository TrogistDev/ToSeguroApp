// apps/web/src/components/canvas/elements/DamageElements.tsx
import React from 'react';
import { Group, Line, Text } from 'react-konva';

interface DamageProps {
  label: 'Dano Leve' | 'Dano Médio' | 'Dano Grave';
}

const BaseDamageX: React.FC<DamageProps> = ({ label }) => (
  <Group>
    {/* Renderização do "X" Vermelho */}
    <Line points={[-15, -15, 15, 15]} stroke="#dc2626" strokeWidth={4} lineCap="round" />
    <Line points={[15, -15, -15, 15]} stroke="#dc2626" strokeWidth={4} lineCap="round" />
    
    {/* Rótulo de Texto Indicativo da Seleção */}
    <Text
      text={label}
      x={-40}
      y={20}
      fontSize={10}
      fill="#ffffff"
      fontStyle="bold"
      align="center"
      width={80}
    />
  </Group>
);

export const DamageLightElement: React.FC = () => <BaseDamageX label="Dano Leve" />;
export const DamageModerateElement: React.FC = () => <BaseDamageX label="Dano Médio" />;
export const DamageSevereElement: React.FC = () => <BaseDamageX label="Dano Grave" />;