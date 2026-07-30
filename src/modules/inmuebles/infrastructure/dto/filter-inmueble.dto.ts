import { IsOptional, IsNumber, IsString, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoInmueble } from '@prisma/client';

export class FilterInmuebleDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(EstadoInmueble)
  estado?: EstadoInmueble;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  precioMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  precioMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  habitaciones?: number;

  @IsOptional()
  @IsString()
  tipoInmuebleId?: string;
}
