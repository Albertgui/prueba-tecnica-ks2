import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { UsuariosService } from '../application/usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';

type RequestWithUser = ExpressRequest & { user: { id: string; email: string } };

@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.usuariosService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @Put(':id')
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

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    if (req.user.id !== id) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return this.usuariosService.remove(id);
  }
}
