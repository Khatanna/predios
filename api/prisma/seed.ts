import { Prisma, PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const { cities } = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./locations.json"), {
    encoding: "utf-8",
  })
);

async function main() {
  // await prisma.$executeRawUnsafe(`

  // TRUNCATE TABLE usuario; 
  // TRUNCATE TABLE permiso;
  // `)
  await prisma.user.deleteMany({ where: {} })
  await prisma.permission.deleteMany({ where: {} })

  const read = await prisma.permission.create({
    data: {
      name: "read",
      description: "Otorga permisos de (vista) sobre la entidad predio",
    },
  })
  const create = await prisma.permission.create({
    data: {
      name: "create",
      description: "Otorga permisos de (creacion) sobre la entidad predio",
    },
  })
  const _delete = await prisma.permission.create({
    data: {
      name: "delete",
      description: "Otorga permisos de (eliminación) sobre la entidad predio",
    },
  })

  const update = await prisma.permission.create({
    data: {
      name: "update",
      description: "Otorga permisos de (edición) sobre la entidad predio",
    },
  });

  await prisma.user.create({
    data: {
      name: "Carlos Elmer",
      firstLastName: "Chambi",
      secondLastName: "Valencia",
      username: "Charlie",
      password: "71264652",
      permissions: {
        connect: [
          { id: read.id },
          { id: create.id }
        ]
      }
    },
  });

  await prisma.user.create({
    data: {
      name: "Daniel",
      firstLastName: "Chambi",
      secondLastName: "Valencia",
      username: "DanielPana87",
      password: "1109",
      permissions:
      {
        connect: [
          { id: update.id },
          { id: _delete.id }
        ]
      }
    },
  });

  // cities.forEach((city: any) => {
  //   city.provinces.forEach(async (province: any) => {
  //     await prisma.city.create({
  //       data: {
  //         name: city.name,
  //         provinces: {
  //           create: {
  //             name: province.name,
  //           },
  //         },
  //       },
  //     });
  //   });

  //   city.provinces.forEach(({ municipalities, name: provinceName }: any) => {
  //     municipalities.forEach(async ({ name }: any) => {
  //       await prisma.municipality.create({
  //         data: {
  //           name,
  //           province: {
  //             connect: {
  //               name: provinceName,
  //             },
  //           },
  //         },
  //       });
  //     });
  //   });
  // });
}

main()
  .then(() => {
    console.log("initializing seed");
  })
  .catch((e) => {
    console.log("error", e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("finalized seed");
    await prisma.$disconnect();
  });
