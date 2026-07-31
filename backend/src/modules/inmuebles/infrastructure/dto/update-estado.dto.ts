import { IsEnum, IsNotEmpty } from 'class-validator';
import { EstadoInmueble } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEstadoDto {
  @ApiProperty({ enum: EstadoInmueble, example: EstadoInmueble.RESERVADO, description: 'Nuevo estado del inmueble' })
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  @IsEnum(EstadoInmueble, {
    message: 'El estado debe ser DISPONIBLE, RESERVADO o VENDIDO',
  })
  estado!: EstadoInmueble;
}
