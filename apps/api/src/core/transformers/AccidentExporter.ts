import { canvasTheme } from '../constants/canvasTheme';
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
      targetId?: string; // ← ADICIONADO!

    }>;
     weather?: { type: 'sun' | 'rain'; intensity?: number; angle?: number };
    layersZ?: string[];
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

  const damages = elements
  .filter(el => el.type.startsWith("damage"))
  .map((el): { id: string; targetId?: string; type: 'scratch' | 'crack' | 'dent'; location: { x: number; y: number }; severity?: 1 | 2 | 3 } => {
    const damageType = el.type.replace("damage_", "") as 'light' | 'moderate' | 'severe';
    
    return {
      id: el.id,
      targetId: el.targetId ?? "", // ← preferência explícita
      type: damageType === "light" ? "scratch"
           : damageType === "moderate" ? "crack"
           : "dent",
      location: { x: el.x, y: el.y },
      severity: damageType === "light" ? 1
               : damageType === "moderate" ? 2
               : 3,
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

    
    
    layersZ: zOrderLayers,
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
