import { PrismaClient, EstadoInmueble } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding de la base de datos');

    await prisma.inmueble.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.tipoInmueble.deleteMany();

    const tiposData = [
        { codigo: 'CASA', nombre: 'Casa' },
        { codigo: 'APTO', nombre: 'Apartamento' },
        { codigo: 'TERR', nombre: 'Terreno' },
        { codigo: 'LOCA', nombre: 'Local Comercial' },
    ];

    const tipos = await Promise.all(
        tiposData.map((tipo) =>
            prisma.tipoInmueble.create({
                data: tipo,
            })
        )
    );
    console.log('Tipos de inmuebles creados.');

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('TestPassword123!', saltRounds);

    const usuariosData = [
        { nombre: 'Carlos Vendedor', email: 'carlos@test.com', password: hashedPassword },
        { nombre: 'Maria Propietaria', email: 'maria@test.com', password: hashedPassword },
        { nombre: 'Jose Inversor', email: 'jose@test.com', password: hashedPassword },
    ];

    const usuarios = await Promise.all(
        usuariosData.map((user) =>
            prisma.usuario.create({
                data: user,
            })
        )
    );
    console.log('Usuarios creados.');

    const inmueblesData: any[] = [];
    const estados = [EstadoInmueble.DISPONIBLE, EstadoInmueble.RESERVADO, EstadoInmueble.VENDIDO];

    for (let i = 1; i <= 15; i++) {
        const vendedor = usuarios[i % 3];
        const tipo = tipos[i % 4];
        const estado = estados[i % 3];
        const precio = 50000 + (i * 15000);
        const habitaciones = tipo.codigo === 'TERR' ? 0 : (i % 4) + 1;
        const metros = 50 + (i * 20);

        inmueblesData.push({
            direccion: `Avenida Principal, Inmueble #${i}, Zona ${i % 3 + 1}`,
            precio,
            habitaciones,
            metrosCuadrados: metros,
            estado,
            vendedorId: vendedor.id,
            tipoInmuebleId: tipo.id,
        });
    }

    await prisma.inmueble.createMany({
        data: inmueblesData,
    });
    console.log(`Inmuebles creados y distribuidos con éxito.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });