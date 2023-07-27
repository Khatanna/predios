import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const { cities } = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./locations.json"), {
    encoding: "utf-8",
  })
);

async function main() {
  await prisma.permission.createMany({
    data: [
      {
        name: "create@predio",
        description: "Otorga permisos de creacion sobre la entidad predio",
      },
      {
        name: "delete",
        description: "Otorga permisos de eliminación sobre la entidad predio",
      },
      {
        name: "update",
        description: "Otorga permisos de edición sobre la entidad predio",
      },
    ],
  });

  await prisma.user.create({
    data: {
      name: "Carlos Elmer",
      firstLastName: "Chambi",
      secondLastName: "Valencia",
      userName: "Charlie",
      password: "71264652",

      permissions: {
        createMany: {
          data: [{ permissionId: 1 }, { permissionId: 2 }],
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      name: "Daniel",
      firstLastName: "Chambi",
      secondLastName: "Valencia",
      userName: "DanielPana87",
      password: "1109",
      permissions: {
        createMany: {
          data: [{ permissionId: 1 }, { permissionId: 3 }],
        },
      },
    },
  });

  // await prisma.city.create({
  //   data: {
  //     name: "La Paz",
  //     provinces: {
  //       createMany: {
  //         data: [
  //           { name: "Pedro Domingo Murillo" },
  //           { name: "Omasuyos" },
  //           { name: "Pacajes" },
  //           { name: "Eliodoro Camacho" },
  //           { name: "Muñecas" },
  //           { name: "Larecaja" },
  //           { name: "Franz Tamayo" },
  //           { name: "Ingavi" },
  //           { name: "José Ramón Loayza" },
  //           { name: "Inquisivi" },
  //           { name: "Sud Yungas" },
  //           { name: "Los Andes" },
  //           { name: "Aroma" },
  //           { name: "Nor Yungas" },
  //           { name: "Caranavi" },
  //           { name: "Abel Iturralde" },
  //           { name: "Juan Bautista Saavedra" },
  //           { name: "Manco Kapac" },
  //           { name: "Gualberto Villaroel" },
  //           { name: "Jose Manuel Pando Solares" },
  //         ],
  //       },
  //     },
  //   },
  // });
  cities.forEach((city: any) => {
    city.provinces.forEach(async (province: any) => {
      await prisma.city.create({
        data: {
          name: city.name,
          provinces: {
            create: {
              name: province.name,
            },
          },
        },
      });
    });

    city.provinces.forEach(({ municipalities, name: provinceName }: any) => {
      municipalities.forEach(async ({ name }: any) => {
        await prisma.municipality.create({
          data: {
            name,
            province: {
              connect: {
                name: provinceName,
              },
            },
          },
        });
      });
    });
  });
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
