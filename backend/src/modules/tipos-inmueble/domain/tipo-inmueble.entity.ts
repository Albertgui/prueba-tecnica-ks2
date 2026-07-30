export class TipoInmuebleEntity {
  constructor(
    public readonly id: string,
    public readonly codigo: string,
    public readonly nombre: string,
    public readonly activo: boolean,
  ) {}
}
