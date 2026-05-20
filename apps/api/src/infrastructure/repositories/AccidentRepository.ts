// apps/api/src/infrastructure/repositories/AccidentRepository.ts
import { prisma } from '../database/prismaClient';
import { tenantStorage } from '../../core/context/TenantContext';
import { CreateAccidentDto } from '../../interface-adapters/dtos/AccidentDto';

export class AccidentRepository {
  
  // MÉTODO DE CRIAÇÃO (Isolamento via AsyncLocalStorage e Tipagem Estrita)
  async create(data: CreateAccidentDto, userId: string) {
    const context = tenantStorage.getStore();
    if (!context) throw new Error("Contexto de Tenant Ausente (Security Breach).");

    // Correção: Modelo no singular (.accident) e propriedades em camelCase
    return await prisma.accident.create({
      data: {
        tenantId: context.tenantId,
        userId: userId,
        fullName: data.fullName,
        lastName: data.lastName,
        locationLat: data.location.lat,
        locationLng: data.location.lng,
        addressText: data.location.address,
        accidentType: data.accidentType,
        sceneData: data.sceneData as any, // Transpila o JSON/Array do Konva com segurança
      }
    });
  }

  // LISTAGEM (Garante de forma rígida que um Tenant nunca veja dados de outro)
  async findAllByTenant() {
    const context = tenantStorage.getStore();
    if (!context) throw new Error("Contexto de Tenant Ausente (Security Breach).");

    // Correção: context.tenantId unificado e modelo no singular
    return await prisma.accident.findMany({
      where: { 
        tenantId: context.tenantId 
      },
      include: { 
        photos: true, // Relacionamento com as fotos do sinistro
        user: { 
          select: { 
            firstName: true, 
            lastName: true 
          } 
        } 
      },
      orderBy: { 
        createdAt: 'desc' 
      }
    });
  }

  // ADICIONAR FOTO (Validação de propriedade antes do insert)
  async addPhoto(accidentId: string, photoUrl: string) {
    const context = tenantStorage.getStore();
    if (!context) throw new Error("Contexto de Tenant Ausente (Security Breach).");

    // Defesa Rígida: Verifica se o acidente de fato pertence ao Tenant logado antes de permitir o upload
    const accident = await prisma.accident.findFirst({
      where: { 
        id: accidentId, 
        tenantId: context.tenantId 
      }
    });

    if (!accident) {
      throw new Error("Operação negada: Acidente não encontrado ou violação de escopo.");
    }

    // Correção: Uso de camelCase (accidentId) no modelo secundário
    return await prisma.accidentPhoto.create({
      data: {
        accidentId: accidentId,
        url: photoUrl
      }
    });
  }

async findByIdWithDetails(id: string): Promise<any> {
  const context = tenantStorage.getStore();
  if (!context) {
    throw new Error("Contexto de Tenant ausente na busca por ID.");
  }

  try {
    // ✅ Removido 'vehicle', pois Accident não tem esse relacionamento
    const accident = await prisma.accident.findUnique({
      where: { id },
      include: {
        user: true, // ✅ OK (User existe no schema)
        photos: true, // ✅ OK (AccidentPhoto existe)
      },
    });
    

    if (!accident) return null;

    const sceneData = {
      background: accident.sceneData?.background || { width: 800, height: 600 },
      elements: accident.sceneData?.elements || [],
    };

    // ✅ Inclua os dados do veículo diretamente do User (que é onde eles estão)
    return {
      id: accident.id,
      reportedAt: accident.createdAt,
      accidentType: accident.accidentType,
      locationLat: accident.locationLat,
      locationLng: accident.locationLng,
      addressText: accident.addressText,
      sceneData,
      photos: accident.photos.map(p => ({
        id: p.id,
        url: p.url,
        type: p.type || undefined,
        description: p.description || undefined
      })),
      user: {
        name: `${accident.user.firstName} ${accident.user.lastName}`.trim() || 'Anônimo',
        contact: accident.user.email,
        vehiclePlate: accident.user.vehiclePlate || '',
        vehicleBrand: accident.user.vehicleBrand || '',
        vehicleModel: accident.user.vehicleModel || '',
        vehicleYear: accident.user.vehicleYear ? Number(accident.user.vehicleYear) : undefined
      }
    };
  } catch (error) {
    console.error("❌ ERRO em findByIdWithDetails:", error);
    throw new Error("Falha ao buscar acidente com detalhes.");
  }
}


}
