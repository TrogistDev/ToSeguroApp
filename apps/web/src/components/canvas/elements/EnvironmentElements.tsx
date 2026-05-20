// apps/web/src/components/canvas/elements/EnvironmentElements.tsx
import { Group, Rect, Circle, RegularPolygon, Text, Line } from "react-konva";
import { canvasTheme } from "../../../styles/canvasTheme";


export const PoleElement = () => <Rect width={5} height={50} fill="#334155" />;
export const ConeElement = () => (
  <RegularPolygon sides={3} radius={15} fill="#f97316" />
);
export const TreeElement = () => (
  <Group>
    <Rect x={-5} y={0} width={10} height={20} fill="#78350f" />
    <RegularPolygon sides={3} radius={25} fill="#166534" y={-20} />
  </Group>
);
export const PedestrianElement = () => (
  <Group>
    <Circle radius={8} fill="#000" />
    <Rect x={-2} y={8} width={4} height={15} fill="#000" />
  </Group>
);

// Placa de PARE com haste vertical
export const StopSignElement: React.FC = () => (
  <Group>
    {/* Cano / Haste que segura a placa */}
    <Rect x={-2} y={20} width={4} height={40} fill="#64748b" />
    {/* Hexágono Vermelho com Borda Branca */}
    <RegularPolygon
      sides={6}
      radius={20}
      fill="#dc2626"
      stroke="#ffffff"
      strokeWidth={2}
      y={0}
    />
    {/* Texto Centralizado */}
    <Text
      text="PARE"
      x={-15}
      y={-5}
      fontSize={9}
      fill="#ffffff"
      fontStyle="bold"
      align="center"
      width={30}
    />
  </Group>
);

// Interface base para os Semáforos estruturados
interface TrafficLightProps {
  state: "red" | "yellow" | "green";
}

const BaseTrafficLight: React.FC<TrafficLightProps> = ({ state }) => (
  <Group>
    {/* Corpo do Semáforo */}
    <Rect width={24} height={60} fill="#1e293b" cornerRadius={4} />

    {/* Bola Vermelha */}
    <Circle
      x={12}
      y={14}
      radius={8}
      fill={state === "red" ? "#ef4444" : "#334155"}
    />
    {state === "red" && (
      <Text
        text="vermelho"
        x={2}
        y={11}
        fontSize={5}
        fill="#ffffff"
        align="center"
        width={20}
      />
    )}

    {/* Bola Amarela */}
    <Circle
      x={12}
      y={30}
      radius={8}
      fill={state === "yellow" ? "#f59e0b" : "#334155"}
    />
    {state === "yellow" && (
      <Text
        text="amarelo"
        x={2}
        y={27}
        fontSize={5}
        fill="#ffffff"
        align="center"
        width={20}
      />
    )}

    {/* Bola Verde */}
    <Circle
      x={12}
      y={46}
      radius={8}
      fill={state === "green" ? "#10b981" : "#334155"}
    />
    {state === "green" && (
      <Text
        text="verde"
        x={2}
        y={43}
        fontSize={5}
        fill="#ffffff"
        align="center"
        width={20}
      />
    )}
  </Group>
);

// 3 Variações explícitas de Semáforos solicitadas
export const TrafficLightRedElement: React.FC = () => (
  <BaseTrafficLight state="red" />
);
export const TrafficLightYellowElement: React.FC = () => (
  <BaseTrafficLight state="yellow" />
);
export const TrafficLightGreenElement: React.FC = () => (
  <BaseTrafficLight state="green" />
);


// Grade de Contenção (Linha cinza horizontal com barras verticais pretas)
export const GuardRailElement: React.FC = () => {
  const width = 80;
  const bars = 9;
  return (
    <Group>
      {/* Barra Horizontal Principal */}
      <Line points={[0, 0, width, 0]} stroke="#94a3b8" strokeWidth={5} />
      {/* Hastes Verticais Pretas Cruzando */}
      {Array.from({ length: bars }).map((_, i) => {
        const posX = (width / (bars - 1)) * i;
        return (
          <Line
            key={i}
            points={[posX, -8, posX, 8]}
            stroke="#000000"
            strokeWidth={2}
          />
        );
      })}
    </Group>
  );
};

export const PotholeElement: React.FC = () => (
  <Group>
    {/* Sombra projetada no asfalto (efeito de profundidade) */}
    <Circle
      radius={24}
      x={0}
      y={1.5}
      fill="#000"
      opacity={0.3}
      cornerRadius={8}
    />

    {/* Buraco real (forma elíptica com borda irregular) */}
    <Rect
      width={48}
      height={26}
      x={-24}
      y={-13}
      fill="#1a1a1a"
      cornerRadius={10}
    />

    {/* Bordas irregulares (arestas do buraco) */}
    <Group>
      {[...Array(5)].map((_, i) => {
        const angle = (i * 72) * (Math.PI / 180);
        const radius = 20;
        const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 6;
        const y = Math.sin(angle) * radius + (Math.random() - 0.5) * 6;

        return (
          <Line
            key={i}
            points={[x, y, x + (Math.random() - 0.5) * 8, y + (Math.random() - 0.5) * 8]}
            stroke="#3a3a3a"
            strokeWidth={2}
            lineCap="round"
          />
        );
      })}
    </Group>
  </Group>
);

// ✅ NOVO: WaterElement com superfície d’água (gradiente + leve reflexo)
export const WaterElement: React.FC = () => {
  return (
    <Group>
      {/* Camada base: lâmina d’água */}
      <Circle
        radius={30}
        fill="#38bdf8"
        opacity={canvasTheme.animations.waterOpacityBase}
      />

      {/* Reflexo sutil (círculo interno claro) */}
      <Circle
        radius={25}
        x={-5}
        y={-5}
        fill="#93c5fd"
        opacity={0.4}
      />
      
      {/* Borda ondulada leve (simulação de superfície) */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 45) * (Math.PI / 180);
        const r = 30 + Math.sin(angle * 2) * 2; // variação de ±2px
        return (
          <Circle
            key={i}
            radius={r}
            stroke="#60a5fa"
            strokeWidth={1}
            opacity={canvasTheme.animations.waterOpacityBase}
            x={Math.cos(angle) * (Math.random() * 4 - 2)}
            y={Math.sin(angle) * (Math.random() * 4 - 2)}
          />
        );
      })}
    </Group>
  );
};

// Elemento Faixa de Pedestre (ocupa metade da altura da estrada)
export const CrosswalkElement: React.FC = () => {
  const totalWidth = 80;
  const totalHeight = 80; // Faixa grande, metade da estrada típica
  const lines = 8;
  return (
    <Group>
      {Array.from({ length: lines }).map((_, i) => (
        <Rect
          key={i}
          x={i * (totalWidth / lines) * 1.1}
          y={0}
          width={8}
          height={totalHeight}
          fill="#ffffff"
        />
      ))}
    </Group>
  );
};
// Elemento Vaga de Trânsito (Apenas bordas brancas, sem preenchimento)
export const ParkingSpaceElement: React.FC = () => (
  <Rect
    width={40}
    height={70}
    stroke="#ffffff"
    strokeWidth={2}
    fillEnabled={false}
  />
);
