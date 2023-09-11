import { City, Permission, PrismaClient, User, UserType } from "@prisma/client";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

function getData(resource: string) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, `./seeds/${resource}.json`), {
      encoding: "utf-8",
    }),
  );
}

const { cities }: { cities: City[] } = getData("locations");
const { permissions }: { permissions: Permission[] } = getData("permissions");
const { users }: { users: User[] } = getData("users");
const { userTypes }: { userTypes: UserType[] } = getData("userTypes");

console.log("initializing seed");
async function main() {
  await prisma.userType.createMany({
    data: userTypes,
    skipDuplicates: true,
  });

  // console.log(users)
  await prisma.user.createMany({
    data: users.map(
      ({
        names,
        firstLastName,
        secondLastName,
        username,
        password,
        typeId,
      }) => ({
        names,
        firstLastName,
        secondLastName,
        username,
        password,
        typeId,
      }),
    ),
  });
  await prisma.permission.createMany({
    data: permissions,
  });

  await prisma.user.create({
    data: {
      names: "Carlos Elmer",
      firstLastName: "Chambi",
      secondLastName: "Valencia",
      username: "carlos.chambi",
      password: bcrypt.hashSync("Inra12345", 10),
      role: "ADMIN",
    },
  });

  (await prisma.permission.findMany({ select: { id: true } })).forEach(
    async ({ id }) => {
      await prisma.userPermission.create({
        data: {
          permission: {
            connect: {
              id,
            },
          },
          user: {
            connect: {
              username: "carlos.chambi",
            },
          },
        },
      });
    },
  );

  cities.forEach(async (city: any) => {
    await prisma.city.create({
      data: {
        name: city.name,
      },
    });

    city.provinces.forEach(async (province: any) => {
      await prisma.province.create({
        data: {
          name: province.name,
          city: { connect: { name: city.name } },
          municipalitys: {
            createMany: {
              data: province.municipalities.map((m: any) => ({ name: m.name })),
            },
          },
          code: province.code,
        },
      });
    });
  });
}

main()
  .catch((e) => {
    console.log("error", e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("finalized seed");
    await prisma.$disconnect();
  });
