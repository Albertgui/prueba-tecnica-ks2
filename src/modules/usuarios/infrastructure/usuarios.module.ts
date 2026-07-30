import { Module } from '@nestjs/common';
import { UsuariosService } from '../application/usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { UsuariosRepository } from './usuarios.repository';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService, UsuariosRepository],
  exports: [UsuariosRepository, UsuariosService], // Para que AuthModule pueda usar UsuariosRepository
})
export class UsuariosModule {}
