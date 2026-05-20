
// apps/api/src/interface-adapters/dtos/AccidentDto.ts
import { z } from 'zod';

// Criação de um tipo flexível e seguro para aceitar o JSON estruturado do Konva
const KonvaJsonSchema = z.union([
  z.record(z.any()), // Aceita objetos do tipo { key: value }
  z.array(z.any())   // Aceita listas/arrays do tipo [elementos...] (Padrão de listas do Konva)
]);

// Validación estricta para el Paso 1, 2 y 3 del formulario
export const CreateAccidentSchema = z.object({
  fullName: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  lastName: z.string().min(3, "O sobrenome deve ter pelo menos 3 caracteres."),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().min(5, "Endereço inválido."),
  }),
  accidentType: z.enum(['collision', 'rollover', 'theft', 'other']),
  photos: z.array(z.string().url()).optional(), // URLs de S3/Cloudinary
  
  // CORREÇÃO: Blindagem para aceitar tanto objetos quanto arrays de elementos gráficos
  sceneData: KonvaJsonSchema, 
});

export type CreateAccidentDto = z.infer<typeof CreateAccidentSchema>;