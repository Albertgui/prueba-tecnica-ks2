import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/infrastructure/auth.module';
import { UsuariosModule } from './modules/usuarios/infrastructure/usuarios.module';
import { TiposInmuebleModule } from './modules/tipos-inmueble/infrastructure/tipos-inmueble.module';
import { InmueblesModule } from './modules/inmuebles/infrastructure/inmuebles.module';

@Module({
  imports: [
    PrismaModule,
    UsuariosModule,
    AuthModule,
    TiposInmuebleModule,
    InmueblesModule,
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minuto
      limit: 100, // 100 peticiones por minuto por IP global (podemos ajustarlo luego)
    }]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
