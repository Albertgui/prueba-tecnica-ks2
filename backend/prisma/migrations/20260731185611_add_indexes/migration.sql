-- CreateIndex
CREATE INDEX "inmuebles_estado_idx" ON "inmuebles"("estado");

-- CreateIndex
CREATE INDEX "inmuebles_precio_idx" ON "inmuebles"("precio");

-- CreateIndex
CREATE INDEX "inmuebles_tipoInmuebleId_idx" ON "inmuebles"("tipoInmuebleId");

-- CreateIndex
CREATE INDEX "inmuebles_vendedorId_idx" ON "inmuebles"("vendedorId");

-- CreateIndex
CREATE INDEX "inmuebles_deletedAt_idx" ON "inmuebles"("deletedAt");
