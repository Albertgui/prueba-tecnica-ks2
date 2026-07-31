import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { InmuebleEntity } from '../domain/inmueble.entity';
import { CreateInmuebleDto } from './dto/create-inmueble.dto';
import { FilterInmuebleDto } from './dto/filter-inmueble.dto';
import { EstadoInmueble, Prisma } from '@prisma/client';
import { UpdateInmuebleDto } from './dto/update-inmueble.dto';

@Injectable()
export class InmueblesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    vendedorId: string,
    data: CreateInmuebleDto,
  ): Promise<InmuebleEntity> {
    const record = await this.prisma.inmueble.create({
      data: {
        direccion: data.direccion,
        precio: data.precio,
        habitaciones: data.habitaciones,
        metrosCuadrados: data.metrosCuadrados,
        vendedorId,
        tipoInmuebleId: data.tipoInmuebleId,
      },
    });
    return this.mapToEntity(record);
  }

  async findById(id: string): Promise<InmuebleEntity | null> {
    const record = await this.prisma.inmueble.findUnique({
      where: { id, deletedAt: null },
      include: {
        tipoInmueble: true,
        vendedor: { select: { id: true, nombre: true, email: true } },
      },
    });
    return record ? this.mapToEntity(record) : null;
  }

  async updateState(id: string, estado: EstadoInmueble): Promise<void> {
    await this.prisma.inmueble.update({
      where: { id },
      data: { estado },
    });
  }

  async findAll(filters: FilterInmuebleDto, currentUserId?: string) {
    const where: Prisma.InmuebleWhereInput = { deletedAt: null };

    if (filters.estado) where.estado = filters.estado;
    if (filters.habitaciones !== undefined) {
      where.habitaciones = { gte: filters.habitaciones };
    }
    if (filters.tipoInmuebleId) where.tipoInmuebleId = filters.tipoInmuebleId;

    if (filters.precioMin || filters.precioMax) {
      const precioFilter: Prisma.DecimalFilter = {};
      if (filters.precioMin) precioFilter.gte = filters.precioMin;
      if (filters.precioMax) precioFilter.lte = filters.precioMax;
      where.precio = precioFilter;
    }

    if (filters.search) {
      where.direccion = { contains: filters.search, mode: 'insensitive' };
    }

    if (filters.soloMios && currentUserId) {
      where.vendedorId = currentUserId;
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const orderBy: Prisma.InmuebleOrderByWithRelationInput = {};
    if (filters.orderBy) {
      orderBy[filters.orderBy] =
        filters.order?.toLowerCase() === 'asc' ? 'asc' : 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [data, total] = await Promise.all([
      this.prisma.inmueble.findMany({
        where,
        skip,
        take: limit,
        include: {
          tipoInmueble: true,
          vendedor: { select: { id: true, nombre: true, email: true } },
        },
        orderBy,
      }),
      this.prisma.inmueble.count({ where }),
    ]);

    return {
      data: data.map((d) => ({ ...d, precio: Number(d.precio) })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.inmueble.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async update(id: string, data: UpdateInmuebleDto): Promise<void> {
    await this.prisma.inmueble.update({
      where: { id },
      data: {
        direccion: data.direccion,
        precio: data.precio,
        habitaciones: data.habitaciones,
        metrosCuadrados: data.metrosCuadrados,
        tipoInmuebleId: data.tipoInmuebleId,
      },
    });
  }

  private mapToEntity(
    record: Prisma.InmuebleGetPayload<Record<string, never>> | any,
  ): InmuebleEntity {
    return new InmuebleEntity(
      record.id,
      record.direccion,
      Number(record.precio),
      record.habitaciones,
      record.metrosCuadrados,
      record.estado,
      record.vendedorId,
      record.tipoInmuebleId,
      record.createdAt,
      record.updatedAt,
      record.vendedor,
      record.tipoInmueble,
    );
  }
}
