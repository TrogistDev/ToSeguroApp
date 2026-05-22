import { Request, Response } from "express";
import { AccidentRepository } from "../../infrastructure/repositories/AccidentRepository";

import { S3Service } from "../../infrastructure/aws/s3Service";
import { ExportAccidentUseCase } from "../../core/use-cases/ExportAccidentUseCase.js";

const accidentRepo = new AccidentRepository();



export class AccidentController {
  private accidentRepo: AccidentRepository;
  private exportAccidentUseCase: ExportAccidentUseCase;

  constructor(
    accidentRepo: AccidentRepository,
    exportAccidentUseCase: ExportAccidentUseCase,
  ) {
    this.accidentRepo = accidentRepo;
    this.exportAccidentUseCase = exportAccidentUseCase;
  }

  private s3Service = new S3Service(); // Instância do seu serviço

  async getAll(req: Request, res: Response) {
    try {
      const accidents = await accidentRepo.findAllByTenant();
      return res.json(accidents);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // No arquivo AccidentController.ts
  async getPhotoUrl(req: Request, res: Response) {
    const { key } = req.query;
    console.log("DEBUG: Tentando buscar URL para a chave:", key); // <-- ISSO É CRUCIAL

    if (!key) return res.status(400).json({ error: "Key é obrigatória" });

    try {
      const url = await this.s3Service.getPresignedReadUrl(key as string);
      return res.json({ url });
    } catch (error) {
      console.error("ERRO AWS:", error); // Verifique se o erro é 'AccessDenied' ou 'InvalidKey'
      return res.status(500).json({ error: "Falha ao gerar URL" });
    }
  }

  async store(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { fullName, lastName, accidentType, sceneData, location, photos } =
        req.body;

      if (
        !fullName ||
        !lastName ||
        !accidentType ||
        !location?.address ||
        !sceneData
      ) {
        return res
          .status(400)
          .json({ error: "Parâmetros obrigatórios ausentes." });
      }

      const newAccident = await accidentRepo.create(
        { fullName, lastName, accidentType, sceneData, location },
        userId,
      );

      if (photos && Array.isArray(photos)) {
        for (const url of photos) {
          await accidentRepo.addPhoto(newAccident.id, url);
        }
      }
      return res.status(201).json(newAccident);
    } catch (error: any) {
      return res.status(500).json({ error: "Erro ao salvar sinistro." });
    }
  }

  public getPresignedUrl = async (req: any, res: any) => {
    try {
      const { fileName, fileType } = req.query;
      const data = await this.s3Service.generatePresignedUrl(
        fileName,
        fileType,
      );
      return res.json(data);
    } catch (error) {
      console.error("ERRO:", error);
      return res.status(500).json({ error: "Falha na assinatura" });
    }
  };

  async getExport(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    
    // ✅ DEFESA RÍGIDA: Cláusula de barreira para garantir que o ID existe e é uma string válida
    if (!id || typeof id !== 'string') {
      res.status(400).json({ error: 'O ID do acidente é obrigatório e deve ser uma string válida.' });
      return;
    }
    
    // ✅ CORREÇÃO 1: Cast explícito para ler a propriedade 'user' injetada pelo middleware
    const authenticatedUser = (req as any).user;
    
    // ✅ CORREÇÃO 2: Conversão e fallback seguro para o tenantId
    const tenantHeader = req.headers['x-tenant-id'];
    const tenantId = typeof tenantHeader === 'string' 
      ? tenantHeader 
      : (Array.isArray(tenantHeader) ? tenantHeader[0] : String(authenticatedUser?.tenantId || 'default'));

    try {
      // Agora o compilador sabe que 'id' é estritamente uma string e o erro some!
      const exportData = await this.exportAccidentUseCase.execute(id, tenantId);
      res.status(200).json(exportData);
    } catch (error) {
      console.error('[Export Accident] Error:', error);
      res.status(404).json({ error: 'Acidente não encontrado ou sem permissão' });
    }
  }
}
