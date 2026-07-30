import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InmueblesRepository } from '../infrastructure/inmuebles.repository';
import { CreateInmuebleDto } from '../infrastructure/dto/create-inmueble.dto';
import { FilterInmuebleDto } from '../infrastructure/dto/filter-inmueble.dto';

@Injectable()
export class InmueblesService {
  constructor(private readonly repository: InmueblesRepository) {}

  async create(vendedorId: string, dto: CreateInmuebleDto) {
    return this.repository.create(vendedorId, dto);
  }

  async findAll(filters: FilterInmuebleDto) {
    return this.repository.findAll(filters);
  }

  async findOne(id: string) {
    const inmueble = await this.repository.findById(id);
    if (!inmueble) throw new NotFoundException('Inmueble no encontrado');
    return inmueble;
  }

  async reservar(id: string, userId: string) {
    // Para simplificar: cualquier usuario autenticado puede reservar, pero podríamos restringirlo a roles.
    const inmueble = await this.findOne(id);
    inmueble.reservar(); // <-- Valida reglas de negocio en la entidad
    await this.repository.updateState(id, inmueble.estado);
    return { success: true, estado: inmueble.estado };
  }

  async vender(id: string, vendedorId: string) {
    const inmueble = await this.findOne(id);
    if (inmueble.vendedorId !== vendedorId) {
      throw new ForbiddenException('Solo el vendedor propietario puede marcar como vendido');
    }
    inmueble.vender(); // <-- Valida reglas de negocio
    await this.repository.updateState(id, inmueble.estado);
    return { success: true, estado: inmueble.estado };
  }

  async liberar(id: string, vendedorId: string) {
    const inmueble = await this.findOne(id);
    if (inmueble.vendedorId !== vendedorId) {
      throw new ForbiddenException('Solo el vendedor propietario puede liberar la reserva');
    }
    inmueble.liberar(); // <-- Valida reglas de negocio
    await this.repository.updateState(id, inmueble.estado);
    return { success: true, estado: inmueble.estado };
  }

  async remove(id: string, vendedorId: string) {
    const inmueble = await this.findOne(id);
    if (inmueble.vendedorId !== vendedorId) {
      throw new ForbiddenException('No tienes permisos para eliminar este inmueble');
    }
    await this.repository.softDelete(id);
    return { success: true, message: 'Inmueble eliminado' };
  }
}
