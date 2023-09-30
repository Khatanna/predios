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
const delay = 5;
console.log("initializing seed");
async function main() {
  await prisma.userType.createMany({
    data: userTypes,
    skipDuplicates: true,
  });

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
    )
  });

  const permissionsID: string[] = []
  for (const permission of permissions) {
    await new Promise((resolve) => setTimeout(resolve, delay));
    const { id } = await prisma.permission.create({ data: permission });
    console.log("permiso creado")
    permissionsID.push(id);
  }

  await prisma.user.create({
    data: {
      names: "Carlos Elmer",
      firstLastName: "Chambi",
      secondLastName: "Valencia",
      username: "carlos.chambi",
      password: bcrypt.hashSync("Inra12345", 10),
      type: {
        connect: {
          name: 'Pasante'
        }
      }
    },
  });

  for (const username of ["carlos.chambi"]) {
    for (const id of permissionsID) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      console.log("permiso asignado a: " + username)
      await prisma.userPermission.create({
        data: {
          permission: {
            connect: {
              id,
            },
          },
          user: {
            connect: {
              username,
            },
          },
        },
      });
    }
  }

  for (const city of cities) {
    await prisma.city.create({
      data: {
        name: city.name,
      },
    });

    /// @ts-ignore
    await prisma.$transaction(city.provinces.map((province: any) => {
      return prisma.province.create({
        data: {
          name: province.name,
          city: { connect: { name: city.name } },
          municipalities: {
            createMany: {
              data: province.municipalities.map((m: any) => ({ name: m.name })),
            },
          },
          code: province.code,
        },
      });
    }))
  }

  await prisma.property.create({
    data: {
      beneficiaries: {
        connectOrCreate: [
          { where: { name: "Roberto Torrez" }, create: { name: "Roberto Torrez" } },
          { where: { name: "Yola Blanco" }, create: { name: "Yola Blanco" } },
          { where: { name: "Eleuterio Torrez Aguilar" }, create: { name: "Eleuterio Torrez Aguilar" } },
          { where: { name: "Maria Nemecia Mujica" }, create: { name: "Maria Nemecia Mujica" } },
          { where: { name: "Julia Libertad Aguilar" }, create: { name: "Julia Libertad Aguilar" } },
          { where: { name: "Flia. Saucedo Choque" }, create: { name: "Flia. Saucedo Choque" } },
          { where: { name: "Graciela Mamani Callisaya" }, create: { name: "Graciela Mamani Callisaya" } },
          { where: { name: "Exalta Mamani" }, create: { name: "Exalta Mamani" } },
        ]
      },
      plots: 8,
      activity: {
        connectOrCreate: {
          where: { name: 'Agricola' },
          create: { name: 'Agricola' }
        }
      },
      type: {
        connectOrCreate: {
          where: { name: 'Comunitario' },
          create: { name: 'Comunitario' }
        }
      },
      clasification: {
        connectOrCreate: {
          where: { name: 'Pequeña' },
          create: { name: 'Pequeña' }
        }
      },
      bodies: 5,
      name: "Comunidad Sullcata",
      area: "8.9420",
      expertiseOfArea: "8.942",
      code: "500570",
      codeOfSearch: "DEP161",
      polygone: "Indefinido",
      observations: {
        createMany: {
          data: [
            { type: 'STANDARD', observation: '5 FOLDERS SOLO FLIP SIN FOLDER,CONFLICTO  DERECHO PROPIETARIO , SE ENCUENTRA EN   TRATAMIENTO CONCLUIDO  PARA SU PROSECUCION MEDIANTE PROCEDIMIENTO' },
            { type: 'TECHNICAL', observation: 'PARA PROCEDIMIENTO COMUN DE SANEAMIENTO, ACTUALMENTE EN SEGUIMIENTO POR LAS PARTES INTERESADAS' }
          ]
        }
      },
      groupedState: {
        connectOrCreate: {
          where: {
            name: 'Proceso departamental'
          },
          create: {
            name: 'Proceso departamental'
          }
        }
      },
      city: {
        connect: {
          name: 'La Paz'
        }
      },
      province: {
        connect: {
          name: 'Ingavi'
        }
      },
      municipality: {
        connect: {
          name: 'Guaqui'
        }
      },
      reference: {
        connectOrCreate: {
          where: {
            name: 'Verificado',
          },
          create: {
            name: 'Verificado',
          }
        }
      },
      secondState: 'POL.',
      state: {
        connectOrCreate: {
          where: {
            name: 'Conflicto'
          },
          create: {
            name: 'Conflicto',
            order: 'Sin definir',
            stage: {
              connectOrCreate: {
                where: {
                  name: 'Campo'
                },
                create: {
                  name: 'Campo'
                }
              }
            }
          },
        }
      },
      responsibleUnit: {
        connectOrCreate: {
          where: {
            name: 'Conflictos'
          },
          create: {
            name: 'Conflictos'
          }
        }
      },
      subDirectory: {
        connectOrCreate: {
          where: {
            name: 'Conflictos'
          },
          create: {
            name: 'Conflictos'
          }
        }
      }
    },
  })
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
