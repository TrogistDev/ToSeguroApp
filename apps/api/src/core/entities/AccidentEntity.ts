// apps/api/src/core/entities/AccidentEntity.ts

export interface AccidentEntity {
  id: string;
  tenantId: string;
  userId: string;
  fullName: string;
  lastName: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  accidentType: 'collision' | 'rollover' | 'theft' | 'other';
  sceneData: any; // El JSON de Konva
  createdAt: Date;
}
