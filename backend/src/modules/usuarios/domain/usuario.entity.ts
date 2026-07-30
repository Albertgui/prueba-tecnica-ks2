export class UsuarioEntity {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly email: string,
    public readonly password?: string,
    public readonly activo?: boolean,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date | null,
  ) {}
}
