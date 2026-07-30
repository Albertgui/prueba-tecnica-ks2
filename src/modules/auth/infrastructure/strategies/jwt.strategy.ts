import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosRepository } from '../../../usuarios/infrastructure/usuarios.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usuariosRepository: UsuariosRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-jwt-key',
    });
  }

  async validate(payload: any) {
    const user = await this.usuariosRepository.findById(payload.sub);
    if (!user || !user.activo) {
      throw new UnauthorizedException('Token inválido o usuario inactivo');
    }
    return { id: user.id, email: user.email };
  }
}
