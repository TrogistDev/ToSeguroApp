import { Group, Circle, Line } from "react-konva";

// Elemento Sol: bola amarela com traços em volta como ponteiros
export const SunElement: React.FC = () => (
  <Group>
    {/* Bola amarela central */}
    <Circle radius={18} fill="#FDB022" stroke="#F59E0B" strokeWidth={2} />

    {/* Traços em volta (8 pontas de bússola) */}
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * Math.PI * 2) / 8;
      const x1 = Math.cos(angle) * 28;
      const y1 = Math.sin(angle) * 28;
      const x2 = Math.cos(angle) * 40;
      const y2 = Math.sin(angle) * 40;
      return (
        <Line
          key={i}
          points={[x1, y1, x2, y2]}
          stroke="#FDB022"
          strokeWidth={3}
          lineCap="round"
        />
      );
    })}
  </Group>
);

// Elemento Chuva: traços azuis inclinados quase transparentes
export const RainElement: React.FC = () => {
  const rainDrops = 12;
  const width = 60;
  const height = 60;

  return (
    <Group>
      {/* Fundo nublado leve */}
      <Circle x={-10} y={-15} radius={20} fill="#94A3B8" opacity={0.3} />
      <Circle x={15} y={-10} radius={18} fill="#94A3B8" opacity={0.3} />

      {/* Traços de chuva inclinados (45 graus) */}
      {Array.from({ length: rainDrops }).map((_, i) => {
        const x = (i % 4) * 20 - 30;
        const y = Math.floor(i / 4) * 20 - 10;
        return (
          <Line
            key={i}
            points={[x, y, x + 12, y + 12]}
            stroke="#3B82F6"
            strokeWidth={2}
            opacity={0.5}
            lineCap="round"
          />
        );
      })}
    </Group>
  );
};
