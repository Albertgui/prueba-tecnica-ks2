import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTipoInmuebleDto {
  @IsString()
  @IsNotEmpty()
  codigo!: string;

  @IsString()
  @IsNotEmpty()
  nombre!: string;
}
