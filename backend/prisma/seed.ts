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
    console.log('Seeding de la base de datos...');

    await prisma.inmueble.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.tipoInmueble.deleteMany();

    const tiposData = [
        { codigo: 'CASA', nombre: 'Casa' },
        { codigo: 'APTO', nombre: 'Apartamento' },
        { codigo: 'TERR', nombre: 'Terreno' },
        { codigo: 'LOCA', nombre: 'Local Comercial' },
    ];

    const tiposList = await Promise.all(
        tiposData.map((tipo) => prisma.tipoInmueble.create({ data: tipo }))
    );
    console.log('Tipos de inmuebles creados.');

    const tipos = tiposList.reduce((acc, curr) => {
        acc[curr.codigo] = curr.id;
        return acc;
    }, {} as Record<string, string>);

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('TestPassword123!', saltRounds);

    const usuariosData = [
        { nombre: 'Alejandro Mendoza', email: 'alejandro@test.com', password: hashedPassword },
        { nombre: 'Sofía Ramírez', email: 'sofia@test.com', password: hashedPassword },
        { nombre: 'Diego Torres', email: 'diego@test.com', password: hashedPassword },
        { nombre: 'Carmen Castillo', email: 'carmen@test.com', password: hashedPassword },
        { nombre: 'Lucas Herrera', email: 'lucas@test.com', password: hashedPassword },
    ];

    const usuarios = await Promise.all(
        usuariosData.map((user) => prisma.usuario.create({ data: user }))
    );
    console.log('Usuarios creados.');

    const inmueblesRaw = [
        { direccion: 'Av. Las Palmas 450, Urb. El Recreo', precio: 120000, habitaciones: 3, metrosCuadrados: 150, estado: EstadoInmueble.DISPONIBLE, tipo: 'CASA', vendedorIdx: 0 },
        { direccion: 'Residencial Los Pinos, Torre B, Apto 402', precio: 85000, habitaciones: 2, metrosCuadrados: 85, estado: EstadoInmueble.DISPONIBLE, tipo: 'APTO', vendedorIdx: 1 },
        { direccion: 'Calle de los Lirios 102, Las Terrazas', precio: 250000, habitaciones: 5, metrosCuadrados: 320, estado: EstadoInmueble.RESERVADO, tipo: 'CASA', vendedorIdx: 2 },
        { direccion: 'Condominio Central, Piso 10', precio: 65000, habitaciones: 1, metrosCuadrados: 55, estado: EstadoInmueble.VENDIDO, tipo: 'APTO', vendedorIdx: 3 },
        { direccion: 'Parcela 15, Sector Norte, Valle Alto', precio: 45000, habitaciones: 0, metrosCuadrados: 1200, estado: EstadoInmueble.DISPONIBLE, tipo: 'TERR', vendedorIdx: 4 },
        { direccion: 'Centro Comercial Plaza, Local 12', precio: 150000, habitaciones: 0, metrosCuadrados: 100, estado: EstadoInmueble.DISPONIBLE, tipo: 'LOCA', vendedorIdx: 0 },
        { direccion: 'Urbanización El Sol, Calle 4 #11-20', precio: 95000, habitaciones: 3, metrosCuadrados: 110, estado: EstadoInmueble.RESERVADO, tipo: 'CASA', vendedorIdx: 1 },
        { direccion: 'Edificio Vista Hermosa, Apto 801', precio: 130000, habitaciones: 3, metrosCuadrados: 120, estado: EstadoInmueble.DISPONIBLE, tipo: 'APTO', vendedorIdx: 2 },
        { direccion: 'Terreno Comercial Av. Principal, Km 5', precio: 280000, habitaciones: 0, metrosCuadrados: 5000, estado: EstadoInmueble.VENDIDO, tipo: 'TERR', vendedorIdx: 3 },
        { direccion: 'Paseo Peatonal Centro, Local Esquina', precio: 210000, habitaciones: 0, metrosCuadrados: 180, estado: EstadoInmueble.DISPONIBLE, tipo: 'LOCA', vendedorIdx: 4 },
        { direccion: 'Quinta La Rosaleda, Sector Sur', precio: 380000, habitaciones: 6, metrosCuadrados: 500, estado: EstadoInmueble.DISPONIBLE, tipo: 'CASA', vendedorIdx: 0 },
        { direccion: 'Loft Industrial, Zona de las Artes', precio: 110000, habitaciones: 1, metrosCuadrados: 90, estado: EstadoInmueble.DISPONIBLE, tipo: 'APTO', vendedorIdx: 1 },
        { direccion: 'Mansión El Mirador, Colina Alta', precio: 850000, habitaciones: 7, metrosCuadrados: 1200, estado: EstadoInmueble.DISPONIBLE, tipo: 'CASA', vendedorIdx: 2 },
        { direccion: 'Apartaestudio Universitario, Zona Norte', precio: 48000, habitaciones: 1, metrosCuadrados: 40, estado: EstadoInmueble.VENDIDO, tipo: 'APTO', vendedorIdx: 3 },
        { direccion: 'Local Gastronómico, Food Court Central', precio: 85000, habitaciones: 0, metrosCuadrados: 60, estado: EstadoInmueble.RESERVADO, tipo: 'LOCA', vendedorIdx: 4 },
    ];

    const inmueblesData = inmueblesRaw.map(item => ({
        direccion: item.direccion,
        precio: item.precio,
        habitaciones: item.habitaciones,
        metrosCuadrados: item.metrosCuadrados,
        estado: item.estado,
        vendedorId: usuarios[item.vendedorIdx].id,
        tipoInmuebleId: tipos[item.tipo],
    }));

    await prisma.inmueble.createMany({ data: inmueblesData });
    console.log(`¡${inmueblesData.length} inmuebles creados y distribuidos de manera congruente!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });