import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { TipoInmuebleEntity } from '../domain/tipo-inmueble.entity';
import { CreateTipoInmuebleDto } from './dto/create-tipo-inmueble.dto';

@Injectable()
export class TiposInmuebleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TipoInmuebleEntity[]> {
    const tipos = await this.prisma.tipoInmueble.findMany({ where: { activo: true } });
    return tipos.map(t => new TipoInmuebleEntity(t.id, t.codigo, t.nombre, t.activo));
  }

  async create(data: CreateTipoInmuebleDto): Promise<TipoInmuebleEntity> {
    const tipo = await this.prisma.tipoInmueble.create({ data });
    return new TipoInmuebleEntity(tipo.id, tipo.codigo, tipo.nombre, tipo.activo);
  }
}
