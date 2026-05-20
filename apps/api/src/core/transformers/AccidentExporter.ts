import { canvasTheme } from './../../../../web/src/styles/canvasTheme';
// apps/api/src/core/transformers/AccidentExporter.ts
import { SceneObject, PhotoExport, LocationExport, VehicleExport, AccidentExportDto } from '../../interface-adapters/dtos/AccidentExportDto';

// 🔁 Atualize a interface RawAccident para refletir o novo formato do repository
interface RawAccident {
  id: string;
  reportedAt: Date;
  accidentType: string;
  locationLat: number;
  locationLng: number;
  addressText: string;
  sceneData: {
    background?: { width: number; height: number };
    elements: Array<{
      id: string;
      type: string;
      label: string;
      x: number;
      y: number;
      damageDescription?: string;
    }>;
  };
  photos: Array<{ id: string; url: string; type?: string; description?: string }>;
  user: {
    name: string;
    contact?: string;
    vehiclePlate?: string | null; // ← aqui vem plate, brand, etc.
    vehicleBrand?: string | null;
    vehicleModel?: string | null;
    vehicleYear?: number | null;
    insuranceCompany?: string | null;
    policyNumber?: string | null;
  };
}

export function accidentToExportDto(accident: RawAccident): AccidentExportDto {
  const { elements, weather, zOrderLayers = canvasTheme.layersZ } = accident.sceneData;
  // Transformar elementos da cena
  const sceneObjects = accident.sceneData.elements.map(el => ({
    id: el.id,
    type: el.type as any,
    label: el.label,
    position: { x: el.x, y: el.y },
    damageDescription: el.damageDescription
  }));

  // Transformar fotos
  const photos = accident.photos.map(p => ({
    id: p.id,
    url: p.url,
    photoType: p.type as PhotoExport['photoType'],
    uploadedAt: new Date().toISOString()
  }));

   // Separar elementos por tipo (para identificar danos vs objetos)
  const damages = elements.filter(el => el.type.startsWith("damage")).map((el) => {
    // 🎯 Busca o objeto mais próximo (ou o alvo diretamente, se houver referência)
    // Como você arrasta o dano sobre o objeto, a posição visual é a mesma do objeto alvo
    // Mas precisamos saber: qual é o `targetId` desse dano?

    // Se não há referência explícita (`damage.targetId`), use lógica de proximidade:
    const targetObject = objects.find(obj => {
      const dx = Math.abs(el.x - obj.x);
      const dy = Math.abs(el.y - obj.y);
      return dx < 30 && dy < 30; // tolerância visual: até 30px
    });

    const centerX = (el.width || 30) / 2; // half-width do dano
    const centerY = (el.height || 30) / 2; // half-height do dano

    // ✅ Centraliza o dano sobre o objeto alvo:
    return {
      id: el.id,
      type: "damage" as const,
      label: "",
      location: {
        x: targetObject ? targetObject.x + (targetObject.width / 2) - centerX : el.x,
        y: targetObject ? targetObject.y + (targetObject.height / 2) - centerY : el.y,
      },
      severity: 1, // ou inferir de `el.metadata?.severity`
    };
  });

  const objects = elements
    .filter(el => !el.type.startsWith("damage_"))
    .map((el): SceneObject => ({
      id: el.id,
      type: el.type as any,
      label: el.label || "",
      x: el.x,
      y: el.y,
      layer: getLayerForType(el.type), // função auxiliar
    }));

  // ✅ Atenção: dados do veículo agora estão em accident.user.*
  const vehicle = {
    plate: accident.user.vehiclePlate || '',
    brand: accident.user.vehicleBrand || '',
    model: accident.user.vehicleModel || '',
    year: accident.user.vehicleYear ? Number(accident.user.vehicleYear) : undefined,
    insuranceCompany: accident.user.insuranceCompany ?? undefined,
    policyNumber: accident.user.policyNumber ?? undefined
  };

  return {
    incidentId: accident.id,
    reportedAt: accident.reportedAt.toISOString(),
    reporter: {
      name: accident.user.name,
      contact: accident.user.contact
    },
    vehicle: {
      plate: vehicle.plate,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      insuranceCompany: vehicle.insuranceCompany,
      policyNumber: vehicle.policyNumber
    },
    location: {
      lat: accident.locationLat,
      lng: accident.locationLng,
      addressText: accident.addressText
    },
    accidentType: accident.accidentType,
    sceneSummary: 'Veículos colidiram frontalmente em cruzamento sem semáforo',
    sceneObjects: objects,
    damages: damages.map(d => ({
      id: d.id,
      targetId: d.targetObject?.id || "", // ← se tiver referência explícita, use isso
      type: d.type as any,
      location: d.location,
      severity: d.severity,
    })),
    photos,
    metadata: {
      createdAt: new Date().toISOString(),
      reportedByUserId: 'user_123', // Ajustar conforme necessário
      platform: 'web'
    },

    weather: {
      type: accident.sceneData.weather?.type ?? "sun",
      intensity: accident.sceneData.weather?.intensity ?? 0.5,
      angle: accident.sceneData.weather?.angle ?? -25,
    },
    
    layersZ: zOrderLayers,
    additionalInfo: {
      weather: 'Ensolarado',
      roadCondition: 'Seca',
      witnesses: [
        { name: 'Maria Oliveira', contact: '+5511988888888' } // Exemplo fixo
      ]
    }
  };
}

const getLayerForType = (type: string): string => {
  const skyTypes = ["sun"];
  const rainTypes = ["rain_stroke"];
  const groundTypes = ["water", "pothole"]; // buracos e água são "debaixo"
  const roadTypes = ["road_straight", "road_oneway"];
  const objectTypes = [
    "car", "truck", "traffic_light", "sign", "pedestrian",
    "damage_light", "damage_moderate", "damage_severe"
  ];

  if (skyTypes.includes(type)) return "sky";
  if (rainTypes.includes(type)) return "rain_stroke";
  if (groundTypes.includes(type)) return "ground"; // abaixo da estrada
  if (roadTypes.includes(type)) return "road";
  
  return "objects"; // padrão
};
