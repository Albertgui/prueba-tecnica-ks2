import { IsOptional, IsNumber, IsString, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoInmueble } from '@prisma/client';

export class FilterInmuebleDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La página debe ser un número' })
  @Min(1, { message: 'La página mínima es 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El límite debe ser un número' })
  @Min(1, { message: 'El límite mínimo es 1' })
  limit?: number = 10;

  @IsOptional()
  @IsEnum(EstadoInmueble, { message: 'El estado no es válido' })
  estado?: EstadoInmueble;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El precio mínimo debe ser un número' })
  precioMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El precio máximo debe ser un número' })
  precioMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Las habitaciones deben ser un número' })
  habitaciones?: number;

  @IsOptional()
  @IsString({ message: 'El tipo de inmueble debe ser texto' })
  tipoInmuebleId?: string;
}
