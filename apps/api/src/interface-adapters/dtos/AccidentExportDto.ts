// apps/api/src/interface-adapters/dtos/AccidentExportDto.ts
export interface SceneObject {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  layer?: string; // ex: "road", "objects"
  zIndex?: number; // opcional, sobrescreve layersZ se presente
}

export interface PhotoExport {
  id: string;
  url: string;
  description?: string;
  uploadedAt: string;
  photoType?: 'front' | 'side' | 'rear' | 'damage' | 'road';
}

export interface LocationExport {
  lat: number;
  lng: number;
  addressText: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface VehicleExport {
  plate: string;
  brand: string;
  model: string;
  year: number;
  insuranceCompany?: string;
  policyNumber?: string;
}

export interface MetadataExport {
  createdAt: string;
  reportedByUserId: string;
  platform: 'web' | 'mobile';
  appVersion?: string;
  deviceInfo?: string;
}

export interface AccidentExportDto {
  incidentId: string;
  reportedAt: string; // ISO timestamp
  reporter: {
    name: string;
    contact?: string;
  };
  vehicle: VehicleExport;
  location: LocationExport;
  accidentType: string; // Ex: "batida frontal", "batida lateral", etc.
  sceneSummary: string; // Narrativa curta do ocorrido

  // Opcional: campos para risco/classificação
  riskAssessment?: {
    severityScore?: number; // 0–100
    riskLevel?: 'low' | 'medium' | 'high' | 'critical';
    possibleFault?: string[]; // Ex: ["Motorista A", "Semáforo quebrado"]
  };

  weather?: {
    type: 'sun' | 'rain';
    intensity?: number;
    angle?: number;
  };
  
  layersZ: string[]; // ordem das camadas
  
  sceneObjects: SceneObject[];
  
  damages: Array<{
    id: string;
    targetId: string; // id do objeto afetado
    type: 'scratch' | 'crack' | 'dent';
    location: { x: number; y: number };
    severity?: 1 | 2 | 3;
  }>;
  
  photos: PhotoExport[];
  metadata: { createdAt: string; platform: string };

  // Opcional: metadados adicionais
   additionalInfo: {
    weather?: string; // legível: "Ensolarado", "Chuva leve"
    roadCondition: string;
    witnesses: Array<{ name: string; contact: string }>;
  };
}
