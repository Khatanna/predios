import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  const properties = await prisma.property.findMany({
    orderBy: {
      registryNumber: 'asc'
    }
  })

  for (let i = 0; i < properties.length; i++) {
    console.log({ i })
    await prisma.property.update({
      where: {
        id: properties[i].id,
      },
      data: {
        registryNumber: i + 1
      }
    })
  }

  await prisma.$executeRaw`ALTER TABLE Predio AUTO_INCREMENT = 1;`;
  await prisma.$disconnect();
}

main().finally(() => {
  console.log("Finalized")
});