import { Injectable, NotFoundException } from '@nestjs/common';
import { UsuariosRepository } from '../infrastructure/usuarios.repository';
import { UpdateUsuarioDto } from '../infrastructure/dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private readonly usuariosRepository: UsuariosRepository) {}

  async findAll(page: number = 1, limit: number = 10) {
    return this.usuariosRepository.findAllPaginated(
      Number(page),
      Number(limit),
    );
  }

  async findOne(id: string) {
    const user = await this.usuariosRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario no encontrado`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const user = await this.usuariosRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario no encontrado`);
    }

    await this.usuariosRepository.update(id, updateUsuarioDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const user = await this.usuariosRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario no encontrado`);
    }

    await this.usuariosRepository.softDelete(id);
    return { success: true, message: 'Usuario eliminado' };
  }
}
