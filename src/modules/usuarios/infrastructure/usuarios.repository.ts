import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { UsuarioEntity } from '../domain/usuario.entity';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UsuarioEntity | null> {
    const user = await this.prisma.usuario.findUnique({
      where: { id, deletedAt: null },
    });
    if (!user) return null;
    return new UsuarioEntity(
      user.id,
      user.nombre,
      user.email,
      user.password,
      user.activo,
      user.createdAt,
      user.updatedAt,
      user.deletedAt,
    );
  }

  async findByEmail(email: string): Promise<UsuarioEntity | null> {
    const user = await this.prisma.usuario.findUnique({
      where: { email, deletedAt: null },
    });
    if (!user) return null;
    return new UsuarioEntity(
      user.id,
      user.nombre,
      user.email,
      user.password,
      user.activo,
      user.createdAt,
      user.updatedAt,
      user.deletedAt,
    );
  }

  async findAllPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.usuario.findMany({
        where: { deletedAt: null },
        skip,
        take: limit,
        select: {
          id: true,
          nombre: true,
          email: true,
          activo: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.usuario.count({ where: { deletedAt: null } }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, data: UpdateUsuarioDto): Promise<void> {
    await this.prisma.usuario.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.usuario.update({
      where: { id },
      data: { deletedAt: new Date(), activo: false },
    });
  }
}
