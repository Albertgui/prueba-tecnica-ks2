import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { LoginDto } from '../infrastructure/dto/login.dto';
import { RegisterDto } from '../infrastructure/dto/register.dto';
import { UsuariosRepository } from '../../usuarios/infrastructure/usuarios.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosRepository: UsuariosRepository,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usuariosRepository.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('El email ya está en uso');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.usuario.create({
      data: {
        nombre: dto.nombre,
        email: dto.email,
        password: hashedPassword,
      },
    });

    return this.generateTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usuariosRepository.findByEmail(dto.email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    if (!user.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.generateTokens(user);
  }

  async refreshTokens(refreshToken: string) {
    try {
      
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usuariosRepository.findById(payload.sub);

      if (!user || !user.hashedRefreshToken || !user.activo) {
        throw new UnauthorizedException('Token inválido');
      }

      
      const isMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
      if (!isMatch) {
        throw new UnauthorizedException('Token inválido');
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }

  private async generateTokens(user: { id: string; email: string }) {
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
    await this.usuariosRepository.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      access_token,
      refresh_token,
    };
  }
}
