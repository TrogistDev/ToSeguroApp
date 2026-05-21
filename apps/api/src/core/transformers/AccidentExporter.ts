import { canvasTheme } from '../constants/canvasTheme';
// apps/api/src/core/transformers/AccidentExporter.ts
import { SceneObject, PhotoExport, AccidentExportDto } from '../../interface-adapters/dtos/AccidentExportDto';

// 🔁 Interface RawAccident refletindo o formato do repository
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
      targetId?: string;
    }>;
    weather?: { type: 'sun' | 'rain'; intensity?: number; angle?: number };
    layersZ?: string[]; // 👈 Mantido o padrão correto da arquitetura
  };
  photos: Array<{ id: string; url: string; type?: string; description?: string }>;
  user: {
    name: string;
    contact?: string;
    vehiclePlate?: string | null;
    vehicleBrand?: string | null;
    vehicleModel?: string | null;
    vehicleYear?: number | null;
    insuranceCompany?: string | null;
    policyNumber?: string | null;
  };
}

export function accidentToExportDto(accident: RawAccident): AccidentExportDto {
  // ✅ CORREÇÃO 1: Desestruturar 'layersZ' em vez de 'zOrderLayers' inexistente
  const { elements, layersZ = canvasTheme.layersZ } = accident.sceneData;

  // Transformar fotos
  const photos = accident.photos.map(p => ({
    id: p.id,
    url: p.url,
    photoType: p.type as PhotoExport['photoType'],
    uploadedAt: new Date().toISOString()
  }));

  // Mapear danos
  const damages = elements
    .filter(el => el.type.startsWith("damage"))
    .map((el): { id: string; targetId: string; type: 'scratch' | 'crack' | 'dent'; location: { x: number; y: number }; severity: 1 | 2 | 3 } => {
      const damageType = el.type.replace("damage_", "") as 'light' | 'moderate' | 'severe';
      
      return {
        id: el.id,
        targetId: el.targetId ?? "",
        type: damageType === "light" ? "scratch"
             : damageType === "moderate" ? "crack"
             : "dent",
        location: { x: el.x, y: el.y },
        severity: damageType === "light" ? 1
                 : damageType === "moderate" ? 2
                 : 3,
      };
    });

  // Mapear objetos da cena
  const objects = elements
    .filter(el => !el.type.startsWith("damage_"))
    .map((el): SceneObject => ({
      id: el.id,
      type: el.type as any,
      label: el.label || "",
      x: el.x,
      y: el.y,
      layer: getLayerForType(el.type),
    }));

  // ✅ CORREÇÃO 2: Se 'year' for undefined, garantir fallback numérico (0) para evitar o Type Error de atribuir 'undefined' a 'number'
  const vehicle = {
    plate: accident.user.vehiclePlate || '',
    brand: accident.user.vehicleBrand || '',
    model: accident.user.vehicleModel || '',
    year: accident.user.vehicleYear ? Number(accident.user.vehicleYear) : 0,
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
      // ✅ CORREÇÃO 3: Usar o 'd.targetId' que já foi extraído acima de forma plana
      targetId: d.targetId, 
      type: d.type as any,
      location: d.location,
      severity: d.severity,
    })),
    photos,
    // ✅ CORREÇÃO 4: Objeto metadata limpo de acordo com as propriedades conhecidas
    metadata: {
      createdAt: new Date().toISOString(),
      platform: 'web'
    },
    layersZ: [...layersZ],
  };
}

const getLayerForType = (type: string): string => {
  const skyTypes = ["sun"];
  const rainTypes = ["rain_stroke"];
  const groundTypes = ["water", "pothole"];
  const roadTypes = ["road_straight", "road_oneway"];

  if (skyTypes.includes(type)) return "sky";
  if (rainTypes.includes(type)) return "rain_stroke";
  if (groundTypes.includes(type)) return "ground";
  if (roadTypes.includes(type)) return "road";
  
  return "objects";
};