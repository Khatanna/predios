import { City, Permission, PrismaClient, User, UserType, Type, FolderLocation, Activity, Clasification, Unit, Stage, State, GroupedState, Reference, Role } from "@prisma/client";
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
const { types }: { types: Type[] } = getData('types');
const { folderLocations }: { folderLocations: FolderLocation[] } = getData('folderLocations');
const { activities }: { activities: Activity[] } = getData('activities');
const { clasifications }: { clasifications: Clasification[] } = getData('clasifications');
const { units }: { units: Unit[] } = getData('units');
const { stages }: { stages: Stage[] } = getData('stages');
const { states }: { states: Array<State & { stage: Stage }> } = getData('states');
const { groupedStates }: { groupedStates: GroupedState } = getData('groupedStates');
const { references }: { references: Reference } = getData('references');
const { roles }: { roles: Role } = getData('roles');
const delay = 3;
console.log("initializing seed");

const createTypes = async () => {
  await prisma.type.createMany({
    data: types,
    skipDuplicates: true,
  });
}

const createFolderLocations = async () => {
  await prisma.folderLocation.createMany({
    data: folderLocations,
    skipDuplicates: true,
  })
}

const createActivities = async () => {
  await prisma.activity.createMany({
    data: activities,
    skipDuplicates: true,
  })
}

const createClasifications = async () => {
  await prisma.clasification.createMany({
    data: clasifications,
    skipDuplicates: true,
  })
}

const createUnits = async () => {
  await prisma.unit.createMany({
    data: units,
    skipDuplicates: true,
  })
}

const createStages = async () => {
  await prisma.stage.createMany({
    data: stages,
    skipDuplicates: true,
  })
}

const createStates = async () => {
  for (let state of states) {
    await prisma.state.create({
      data: {
        name: state.name,
        order: state.order,
        stage: {
          connect: state.stage
        }
      }
    })
  }
}

const createGroupedStates = async () => {
  await prisma.groupedState.createMany({
    data: groupedStates,
    skipDuplicates: true
  })
}

const createReferences = async () => {
  await prisma.reference.createMany({
    data: references,
    skipDuplicates: true
  })
}

const createRoles = async () => {
  await prisma.role.createMany({
    data: roles
  })
}

async function main() {
  await createRoles();
  await createTypes();
  await createFolderLocations();
  await createActivities();
  await createClasifications();
  await createUnits();
  await createStages();
  await createStates();
  await createGroupedStates();
  await createReferences();
  await prisma.userType.createMany({
    data: userTypes,
    skipDuplicates: true,
  });

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true
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
      },
      role: {
        connectOrCreate: {
          where: {
            name: 'Administrador',
          },
          create: {
            name: 'Administrador'
          }
        }
      }
    }
  });

  for (const username of ["carlos.chambi", 'daniel.chipana']) {
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
            { observation: '5 FOLDERS SOLO FLIP SIN FOLDER,CONFLICTO  DERECHO PROPIETARIO , SE ENCUENTRA EN   TRATAMIENTO CONCLUIDO  PARA SU PROSECUCION MEDIANTE PROCEDIMIENTO' }
          ]
        }
      },
      technicalObservation: 'PARA PROCEDIMIENTO COMUN DE SANEAMIENTO, ACTUALMENTE EN SEGUIMIENTO POR LAS PARTES INTERESADAS',
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
      folderLocation: {
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
