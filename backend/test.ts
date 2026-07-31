import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.usuario.findUnique({where:{email:'carlos@test.com'}}).then(console.log).catch(console.error).finally(() => prisma.$disconnect());
