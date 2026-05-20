import React, { useState, useEffect } from "react";
import { Stage, Layer, Rect, Text, Group, Arrow } from "react-konva";
import { Button } from "../ui/Button";
import { canvasTheme } from "../../styles/canvasTheme";
import { RoadElement } from "./elements/RoadElement";
import { ElementRenderer } from "./ElementRenderer";
import { SceneMenu } from "./SceneMenu";
import { SceneObjectList } from "./SceneObjectList";
import { useSceneCanvas } from "./hooks/useSceneCanvas";
import {
  getCanvasDimensions,
  PIXELS_PER_METER,
} from "./constants/CanvasMetrics";

export const SceneCanvas: React.FC = () => {
  const {
    background,
    elements,
    selectedId,
    setSelectedId,
    addObject,
    addObjectAtPosition,
    deleteElement,
    flipElement,
    updateElementPosition,
    exportScene,
      canvasWidth, // ← agora dinâmico
    canvasHeight,
  } = useSceneCanvas();

  const elementsByLayer = React.useMemo(() => {
    const grouped: Record<string, SceneElement[]> = {};

    canvasTheme.layersZ.forEach((layer) => {
      grouped[layer] = [];
    });

    elements.forEach((el) => {
      const layer = el.layer || "objects"; // fallback padrão
      if (!grouped[layer]) grouped[layer] = [];
      grouped[layer].push(el);
    });

    return grouped;
  }, [elements]);



  return (
    <div className="flex flex-col w-full gap-4 bg-slate-100 rounded-xl overflow-hidden">
  {/* Área principal do Stage */}
  <div className="bg-white rounded-lg shadow-sm flex flex-col w-full overflow-hidden relative">
    
    {/* Canvas com scroll horizontal/vertical se necessário */}
    <div 
      className="w-full h-[50vh] lg:h-[600px] overflow-auto rounded-lg border border-slate-300 shadow-inner"
      style={{ maxHeight: '600px' }}
    >
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        onClick={(e) => {
          if (e.target === e.target.getStage()) {
            setSelectedId(null);
            const relativePos = e.target.getRelativePointerPosition();
            addObjectAtPosition("car", relativePos.x, relativePos.y);
          }
        }}
      >
            <Layer>
              {background && (
                <RoadElement
                  type={background}
                  width={canvasWidth}
                  height={canvasHeight}
                />
              )}
            </Layer>

            {canvasTheme.layersZ.map((layerName, index) => (
              <Layer key={layerName} globalAlpha={0.95}>
                {elementsByLayer[layerName]?.map((el) => {
                  // Ordenar por zIndex se presente
                  const sorted = elementsByLayer[layerName].sort(
                    (a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0),
                  );

                  return (
                    <Group
                      key={el.id}
                      x={el.x}
                      y={el.y}
                      offsetX={el.width / 2} // ← NOVO: pivot no centro do X
                      offsetY={el.height / 2}
                      draggable
                      onClick={(e) => {
                        e.cancelBubble = true;
                        setSelectedId(el.id);
                      }}
                      onDragEnd={(e) =>
                        updateElementPosition(el.id, e.target.x(), e.target.y())
                      }
                    >
                      <ElementRenderer el={el} />
                      {selectedId === el.id && (
                        <Rect
                          width={el.width}
                          height={el.height}
                          stroke="#ef4444"
                          strokeWidth={2}
                          dash={[4, 4]}
                        />
                      )}
                      <Text
                        text={`${el.type.split("_")[0]} (${(el.x / PIXELS_PER_METER).toFixed(1)}m)`}
                        y={el.height + 5}
                        fontSize={10}
                        align="center"
                        width={el.width}
                        fill="#64748b"
                      />
                    </Group>
                  );
                })}
              </Layer>
            ))}
          </Stage>
        </div>

        <div className="p-3 bg-slate-50 border-t rounded-b-lg">
          <Button onClick={exportScene} className="w-full text-xs py-2.5">
            Salvar Croqui no Relatório
          </Button>
        </div>
      </div>

      {/* Menu e Lista abaixo do canvas */}
      <div className="flex flex-col lg:flex-row w-full gap-4 px-4 pb-4">
        <div className="flex-1">
          <SceneMenu onAddObject={addObject} />
        </div>
        <div className="flex-1">
          <SceneObjectList
            elements={elements}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onFlip={flipElement}
            onDelete={deleteElement}
          />
        </div>
      </div>
    </div>
  );
};
