import { IsString, IsNotEmpty, IsNumber, Min, IsUUID } from 'class-validator';

export class CreateInmuebleDto {
  @IsString({ message: 'La dirección debe ser texto' })
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  direccion!: string;

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  precio!: number;

  @IsNumber({}, { message: 'Las habitaciones deben ser un número' })
  @Min(1, { message: 'Debe tener al menos 1 habitación' })
  habitaciones!: number;

  @IsNumber({}, { message: 'Los metros cuadrados deben ser un número' })
  @Min(1, { message: 'Debe tener al menos 1 metro cuadrado' })
  metrosCuadrados!: number;

  @IsUUID('4', { message: 'El tipo de inmueble debe ser un UUID válido' })
  tipoInmuebleId!: string;
}
