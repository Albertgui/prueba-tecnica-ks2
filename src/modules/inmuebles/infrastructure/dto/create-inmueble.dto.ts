import { IsString, IsNotEmpty, IsNumber, Min, IsUUID } from 'class-validator';

export class CreateInmuebleDto {
  @IsString()
  @IsNotEmpty()
  direccion!: string;

  @IsNumber()
  @Min(0)
  precio!: number;

  @IsNumber()
  @Min(1)
  habitaciones!: number;

  @IsNumber()
  @Min(1)
  metrosCuadrados!: number;

  @IsUUID()
  tipoInmuebleId!: string;
}
