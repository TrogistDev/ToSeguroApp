// apps/web/src/components/canvas/elements/ElementRenderer.tsx

import React from "react";
import { Rect, Circle, Group } from "react-konva";
import {
  ConeElement,
  PedestrianElement,
  PoleElement,
  TreeElement,
  StopSignElement,
  TrafficLightRedElement,
  TrafficLightYellowElement,
  TrafficLightGreenElement,
  GuardRailElement,
  CrosswalkElement,
  ParkingSpaceElement,
  PotholeElement,
  WaterElement,
} from "./elements/EnvironmentElements";
import { CarElement, TruckElement } from "./elements/VehicleElements";
import {
  DamageLightElement,
  DamageModerateElement,
  DamageSevereElement,
} from "./elements/DamageElements";
import { SunElement } from "./elements/SunElement";
import { RainStrokeElement } from "./elements/RainStrokeElement";
import { canvasTheme } from "../../styles/canvasTheme";

interface ElementRendererProps {
  el: SceneElement;
}

// ✅ Função auxiliar para mapear tipo → camada visual
const getLayerByType = (type: string): string => {
  const skyTypes = ["sun"];
  const rainTypes = ["rain_stroke"];
  
  // ✅ CORREÇÃO AQUI:
  if (skyTypes.includes(type)) return "sky";
  if (rainTypes.includes(type)) return "rain_stroke";

  // Água e buraco agora têm suas próprias camadas explícitas
  if (type === "water") return "water";
  if (type === "pothole") return "pothole";

  // Estrada → road
  const roadTypes = ["road_straight", "road_oneway"];
  if (roadTypes.includes(type)) return "road";

  // Tudo mais → objects
  return "objects";
};

export const ElementRenderer: React.FC<ElementRendererProps> = React.memo(
  ({ el }) => {
    const layer = getLayerByType(el.type);

    switch (el.type) {
      case "car":
        return (
          <Group data-layer={layer}>
            <CarElement color={el.color} width={40} height={20} flipped={el.flipped} />
          </Group>
        );
      case "truck":
        return (
          <Group data-layer={layer}>
            <TruckElement width={60} height={25} flipped={el.flipped} />
          </Group>
        );
      case "pole":
        return <PoleElement />;
      case "cone":
        return <ConeElement />;
      case "pedestrian":
        return <PedestrianElement />;
      case "tree":
        return <TreeElement />;
      case "animal":
        return (
          <Group data-layer={layer}>
            <Circle radius={10} fill={el.color} />
          </Group>
        );
      case "stop_sign":
        return <StopSignElement />;
      case "traffic_light_red":
        return <TrafficLightRedElement />;
      case "traffic_light_yellow":
        return <TrafficLightYellowElement />;
      case "traffic_light_green":
        return <TrafficLightGreenElement />;
      case "pothole":
        return (
          <Group data-layer={layer}>
            <PotholeElement />
          </Group>
        );
      case "water":
        return (
          <Group data-layer={layer}>
            <WaterElement />
          </Group>
        );
      case "guard_rail":
        return <GuardRailElement />;
      case "crosswalk":
        return <CrosswalkElement />;
       case "sun":
      return (
        <Group draggable={false} data-layer="sky">
          {/* Sol amarelo com raios */}
          <Circle radius={24} fill="#fbbf24" />
          {/* Raios */ }
          {[...Array(8)].map((_, i) => {
            const angle = (i * Math.PI) / 4;
            const x = Math.cos(angle) * 30;
            const y = Math.sin(angle) * 30;
            return <Rect key={i} x={12} y={-2} width={6} height={18} fill="#fbbf24" rotation={angle * (180 / Math.PI)} />;
          })}
        </Group>
      );

    case "rain_stroke":
      // Chuva: não interativo, apenas estilizado
      return (
        <Group draggable={false} data-layer="rain_stroke">
          {[...Array(25)].map((_, i) => {
            const x = 10 + (i % 8) * 40;
            const y = 20 + Math.floor(i / 8) * 30;
            return (
              <Rect
                key={i}
                x={x}
                y={y}
                width={6}
                height={20}
                fill="#93c5fd"
                opacity={0.4}
                rotation={-25} // inclinação
              />
            );
          })}
        </Group>
      );

      case "parking_space":
        return (
          <Group data-layer="objects">
            <ParkingSpaceElement />
          </Group>
        );
      case "damage_light":
        return <DamageLightElement />;
      case "damage_moderate":
        return <DamageModerateElement />;
      case "damage_severe":
        return <DamageSevereElement />;
      default:
        return (
          <Rect width={el.width} height={el.height} fill={el.color} />
        );
    }
  },
);

ElementRenderer.displayName = "ElementRenderer";
