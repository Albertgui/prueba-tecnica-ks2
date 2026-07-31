import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class UpdateInmuebleDto {
  @IsOptional()
  @IsString({ message: 'La dirección debe ser texto' })
  direccion?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  precio?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El número de habitaciones debe ser un número' })
  @Min(0, { message: 'El número de habitaciones no puede ser negativo' })
  habitaciones?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Los metros cuadrados deben ser un número' })
  @Min(0, { message: 'Los metros cuadrados no pueden ser negativos' })
  metrosCuadrados?: number;

  @IsOptional()
  @IsUUID('4', { message: 'El tipo de inmueble debe ser un UUID válido' })
  tipoInmuebleId?: string;
}
