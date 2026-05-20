// apps/api/src/core/use-cases/ExportAccidentUseCase.ts

import { AccidentRepository } from '../../infrastructure/repositories/AccidentRepository';
import { accidentToExportDto } from '../transformers/AccidentExporter';

export class ExportAccidentUseCase {
  private accidentRepo: AccidentRepository;

  constructor(accidentRepo: AccidentRepository) {
    this.accidentRepo = accidentRepo;
  }

  async execute(incidentId: string, tenantId: string): Promise<any> {
    const accident = await this.accidentRepo.findByIdWithDetails(incidentId);

    if (!accident) {
      throw new Error('Acidente não encontrado');
    }

    // TODO: Validar permissão do tenant (ex: se accident.tenantId !== tenantId)
    
    return accidentToExportDto(accident);
  }
}
