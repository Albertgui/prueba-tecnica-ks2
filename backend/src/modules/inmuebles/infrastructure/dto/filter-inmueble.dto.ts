import { IsOptional, IsNumber, IsString, IsEnum, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { EstadoInmueble } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterInmuebleDto {
  @ApiPropertyOptional({ description: 'Página de resultados', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La página debe ser un número' })
  @Min(1, { message: 'La página mínima es 1' })
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Resultados por página', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El límite debe ser un número' })
  @Min(1, { message: 'El límite mínimo es 1' })
  limit?: number = 10;

  @ApiPropertyOptional({ enum: EstadoInmueble, description: 'Filtrar por estado' })
  @IsOptional()
  @IsEnum(EstadoInmueble, { message: 'El estado no es válido' })
  estado?: EstadoInmueble;

  @ApiPropertyOptional({ description: 'Precio mínimo' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El precio mínimo debe ser un número' })
  precioMin?: number;

  @ApiPropertyOptional({ description: 'Precio máximo' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El precio máximo debe ser un número' })
  precioMax?: number;

  @ApiPropertyOptional({ description: 'Número de habitaciones exacto' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Las habitaciones deben ser un número' })
  habitaciones?: number;

  @ApiPropertyOptional({ description: 'ID del tipo de inmueble' })
  @IsOptional()
  @IsString({ message: 'El tipo de inmueble debe ser texto' })
  tipoInmuebleId?: string;

  @ApiPropertyOptional({ description: 'Mostrar solo mis inmuebles', type: Boolean })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  soloMios?: boolean;

  @ApiPropertyOptional({ description: 'Campo por el cual ordenar', enum: ['precio', 'createdAt'] })
  @IsOptional()
  @IsString({ message: 'El orderBy debe ser texto' })
  @IsEnum(['precio', 'createdAt'], {
    message: 'orderBy solo puede ser precio o createdAt',
  })
  orderBy?: 'precio' | 'createdAt';

  @ApiPropertyOptional({ description: 'Dirección del orden', enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsString({ message: 'El order debe ser texto' })
  @IsEnum(['asc', 'desc', 'ASC', 'DESC'], {
    message: 'order solo puede ser ASC o DESC',
  })
  order?: 'asc' | 'desc' | 'ASC' | 'DESC';

  @ApiPropertyOptional({ description: 'Búsqueda por dirección' })
  @IsOptional()
  @IsString({ message: 'La búsqueda debe ser texto' })
  search?: string;
}
