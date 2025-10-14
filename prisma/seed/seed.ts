import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const statuses = ['Activo', 'Cancelado'];

  for (const name of statuses) {
    await prisma.status.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('Estados iniciales insertados correctamente');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
