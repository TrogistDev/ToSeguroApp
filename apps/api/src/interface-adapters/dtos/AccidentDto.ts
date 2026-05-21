// apps/api/src/interface-adapters/dtos/AccidentDto.ts
import { z } from 'zod';

// ✅ CORREÇÃO DEFINITIVA: Passando os 2 argumentos exigidos pela tua assinatura do Zod (Chave, Valor)
const KonvaJsonSchema = z.union([
  z.record(z.string(), z.any()), // 👈 Aqui (keyType, valueType). O erro sumirá aqui.
  z.array(z.any())
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
  
  // Blindagem para aceitar tanto objetos quanto arrays de elementos gráficos
  sceneData: KonvaJsonSchema, 
});

export type CreateAccidentDto = z.infer<typeof CreateAccidentSchema>;