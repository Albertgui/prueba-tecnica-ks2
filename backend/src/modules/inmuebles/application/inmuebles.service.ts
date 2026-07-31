import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { EstadoInmueble } from '@prisma/client';
import { InmueblesRepository } from '../infrastructure/inmuebles.repository';
import { CreateInmuebleDto } from '../infrastructure/dto/create-inmueble.dto';
import { FilterInmuebleDto } from '../infrastructure/dto/filter-inmueble.dto';
import { UpdateInmuebleDto } from '../infrastructure/dto/update-inmueble.dto';

@Injectable()
export class InmueblesService {
  constructor(private readonly repository: InmueblesRepository) { }

  async create(vendedorId: string, dto: CreateInmuebleDto) {
    return this.repository.create(vendedorId, dto);
  }

  async findAll(filters: FilterInmuebleDto, userId?: string) {
    return this.repository.findAll(filters, userId);
  }

  async findOne(id: string) {
    const inmueble = await this.repository.findById(id);
    if (!inmueble) throw new NotFoundException('Inmueble no encontrado');
    return inmueble;
  }

  async update(id: string, vendedorId: string, dto: UpdateInmuebleDto) {
    const inmueble = await this.findOne(id);
    if (inmueble.vendedorId !== vendedorId) {
      throw new NotFoundException('Inmueble no encontrado');
    }
    if (inmueble.estado === EstadoInmueble.VENDIDO) {
      throw new ConflictException('No se puede editar un inmueble VENDIDO');
    }
    await this.repository.update(id, dto);
    return this.findOne(id);
  }

  async cambiarEstado(id: string, vendedorId: string, nuevoEstado: EstadoInmueble) {
    const inmueble = await this.findOne(id);
    
    // Si la transición es a RESERVADO o DISPONIBLE, cualquiera podría hacerlo (según TRR no está 100% claro, pero VENDER seguro solo el dueño).
    // Asumiremos que solo el vendedorId puede cambiar cualquier estado de su propio inmueble para ser seguros (IDOR global).
    if (inmueble.vendedorId !== vendedorId) {
      throw new NotFoundException('Inmueble no encontrado');
    }

    inmueble.cambiarEstado(nuevoEstado);
    await this.repository.updateState(id, inmueble.estado);
    return { success: true, estado: inmueble.estado };
  }

  async remove(id: string, vendedorId: string) {
    const inmueble = await this.findOne(id);
    if (inmueble.vendedorId !== vendedorId) {
      throw new NotFoundException('Inmueble no encontrado');
    }
    await this.repository.softDelete(id);
    return { success: true, message: 'Inmueble eliminado' };
  }
}
