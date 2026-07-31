import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Request,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { UsuariosService } from '../application/usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

type RequestWithUser = ExpressRequest & { user: { id: string; email: string } };

@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @ApiOperation({ summary: 'Obtener lista de usuarios' })
  @ApiResponse({ status: 200, description: 'Lista paginada de usuarios' })
  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.usuariosService.findAll(page, limit);
  }

  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, description: 'Datos del usuario' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar perfil del usuario (Sólo cuenta propia)' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Request() req: RequestWithUser,
  ) {
    if (req.user.id !== id) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @ApiOperation({ summary: 'Desactivar cuenta del usuario (Sólo cuenta propia)' })
  @ApiResponse({ status: 200, description: 'Usuario desactivado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    if (req.user.id !== id) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return this.usuariosService.remove(id);
  }
}
