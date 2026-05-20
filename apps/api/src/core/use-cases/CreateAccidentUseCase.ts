// apps/api/src/core/use-cases/CreateAccidentUseCase.ts
import { AccidentRepository } from '../../infrastructure/repositories/AccidentRepository';
import { CreateAccidentDto } from '../../interface-adapters/dtos/AccidentDto';

export class CreateAccidentUseCase {
  // Inyectamos el repositorio (Dependency Injection) para facilitar tests
  constructor(private accidentRepository: AccidentRepository) {}

  async execute(data: CreateAccidentDto, userId: string) {
    // REGLA DE NEGOCIO 1: Validar si la ubicación es válida antes de guardar
    if (!data.location.lat || !data.location.lng) {
      throw new Error("La ubicación debe incluir coordenadas válidas.");
    }

    // REGLA DE NEGOCIO 2: Formatear el nombre para consistencia
    const formattedName = data.fullName.trim().toUpperCase();
    const formattedLastName = data.lastName.trim().toUpperCase();

    // REGLA DE NEGOCIO 3: Lógica de persistencia
    const newAccident = await this.accidentRepository.create({
      ...data,
      fullName: formattedName,
      lastName: formattedLastName,
    }, userId);

    // Aquí podrías añadir: Enviar email, Notificar a Admin, etc.
    return newAccident;
  }
}
