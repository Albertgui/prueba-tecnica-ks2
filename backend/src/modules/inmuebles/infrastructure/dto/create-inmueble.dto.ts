import { IsString, IsNotEmpty, IsNumber, Min, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInmuebleDto {
  @ApiProperty({ example: 'Calle Falsa 123', description: 'Dirección del inmueble' })
  @IsString({ message: 'La dirección debe ser texto' })
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  direccion!: string;

  @ApiProperty({ example: 150000, description: 'Precio del inmueble' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(1, { message: 'El precio debe ser mayor a 0' })
  precio!: number;

  @ApiProperty({ example: 3, description: 'Número de habitaciones' })
  @IsNumber({}, { message: 'Las habitaciones deben ser un número' })
  @Min(1, { message: 'Debe tener al menos 1 habitación' })
  habitaciones!: number;

  @ApiProperty({ example: 120, description: 'Metros cuadrados' })
  @IsNumber({}, { message: 'Los metros cuadrados deben ser un número' })
  @Min(1, { message: 'Debe tener al menos 1 metro cuadrado' })
  metrosCuadrados!: number;

  @ApiProperty({ example: 'b567d-...', description: 'ID del tipo de inmueble (UUID)' })
  @IsUUID('4', { message: 'El tipo de inmueble debe ser un UUID válido' })
  tipoInmuebleId!: string;
}
