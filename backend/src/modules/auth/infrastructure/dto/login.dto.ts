import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'juan@test.com', description: 'Correo electrónico del usuario' })
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email!: string;

  @ApiProperty({ example: 'Password123!', description: 'Contraseña del usuario', minLength: 6 })
  @IsString({ message: 'La contraseña debe ser texto' })
  @MinLength(6, { message: 'La contraseña debe tener mínimo 6 caracteres' })
  password!: string;
}
