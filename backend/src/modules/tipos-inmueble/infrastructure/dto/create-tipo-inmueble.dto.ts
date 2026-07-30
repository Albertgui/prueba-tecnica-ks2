import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTipoInmuebleDto {
  @IsString({ message: 'El código debe ser texto' })
  @IsNotEmpty({ message: 'El código es obligatorio' })
  codigo!: string;

  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre!: string;
}
