import { IsEnum, IsNotEmpty } from 'class-validator';
import { EstadoInmueble } from '@prisma/client';

export class UpdateEstadoDto {
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  @IsEnum(EstadoInmueble, { message: 'El estado debe ser DISPONIBLE, RESERVADO o VENDIDO' })
  estado!: EstadoInmueble;
}
