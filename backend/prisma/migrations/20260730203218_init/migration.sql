-- CreateEnum
CREATE TYPE "EstadoInmueble" AS ENUM ('DISPONIBLE', 'RESERVADO', 'VENDIDO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_inmueble" (
    "id" UUID NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tipos_inmueble_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inmuebles" (
    "id" UUID NOT NULL,
    "direccion" TEXT NOT NULL,
    "precio" DECIMAL(12,2) NOT NULL,
    "habitaciones" INTEGER NOT NULL,
    "metrosCuadrados" INTEGER NOT NULL,
    "estado" "EstadoInmueble" NOT NULL DEFAULT 'DISPONIBLE',
    "vendedorId" UUID NOT NULL,
    "tipoInmuebleId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "inmuebles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_inmueble_codigo_key" ON "tipos_inmueble"("codigo");

-- AddForeignKey
ALTER TABLE "inmuebles" ADD CONSTRAINT "inmuebles_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inmuebles" ADD CONSTRAINT "inmuebles_tipoInmuebleId_fkey" FOREIGN KEY ("tipoInmuebleId") REFERENCES "tipos_inmueble"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
