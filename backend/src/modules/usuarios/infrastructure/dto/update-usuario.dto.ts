import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  nombre?: string;

  @IsOptional()
  @IsBoolean({ message: 'Activo debe ser booleano' })
  activo?: boolean;
}
