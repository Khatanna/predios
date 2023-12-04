import {
  City,
  Permission,
  PrismaClient,
  User,
  UserType,
  Type,
  FolderLocation,
  Activity,
  Clasification,
  Unit,
  Stage,
  State,
  GroupedState,
  Reference,
  Role,
  Property,
} from "@prisma/client";
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
const { types }: { types: Type[] } = getData("types");
const { folderLocations }: { folderLocations: FolderLocation[] } =
  getData("folderLocations");
const { activities }: { activities: Activity[] } = getData("activities");
const { clasifications }: { clasifications: Clasification[] } =
  getData("clasifications");
const { units }: { units: Unit[] } = getData("units");
const { stages }: { stages: Stage[] } = getData("stages");
const { states }: { states: Array<State & { stage: Stage }> } =
  getData("states");
const { groupedStates }: { groupedStates: GroupedState } =
  getData("groupedStates");
const { references }: { references: Reference } = getData("references");
const { roles }: { roles: Role } = getData("roles");
const delay = 1;
const properties: Record<string, string>[] = getData("DAT_PREDIO");
console.log("initializing seed");
const createTypes = async () => {
  await prisma.type.createMany({
    data: types,
    skipDuplicates: true,
  });
};

const createFolderLocations = async () => {
  await prisma.folderLocation.createMany({
    data: folderLocations,
    skipDuplicates: true,
  });
};

const createActivities = async () => {
  await prisma.activity.createMany({
    data: activities,
    skipDuplicates: true,
  });
};

const createClasifications = async () => {
  await prisma.clasification.createMany({
    data: clasifications,
    skipDuplicates: true,
  });
};

const createUnits = async () => {
  await prisma.unit.createMany({
    data: units,
    skipDuplicates: true,
  });
};

const createStages = async () => {
  await prisma.stage.createMany({
    data: stages,
    skipDuplicates: true,
  });
};

const createStates = async () => {
  for (let state of states) {
    await prisma.state.create({
      data: {
        name: state.name,
        // order: state.order,
        stage: {
          connect: state.stage,
        },
      },
    });
  }
};

const createGroupedStates = async () => {
  await prisma.groupedState.createMany({
    data: groupedStates,
    skipDuplicates: true,
  });
};

const createReferences = async () => {
  await prisma.reference.createMany({
    data: references,
    skipDuplicates: true,
  });
};

const createRoles = () => {
  return prisma.role.createMany({
    data: roles,
  });
};

async function main() {
  // await createTypes();
  // await createFolderLocations();
  // await createActivities();
  // await createClasifications();
  // await createUnits();
  // await createStages();
  // await createStates();
  // await createGroupedStates();
  // await createReferences();
  const propertiesMapped = properties.map(
    ({
      codigo,
      superficie,
      superficie_pericia,
      nombre,
      poligono,
      cuerpos,
      fojas,
      parcelas,
      departamento,
      provincia,
      municipio,
      observacion,
      tipo_de_predio,
      ubicación_de_carpeta,
      actividad,
      clasificación,
      expediente,
      unidad_responsable,
      estado_agrupado,
      estado_2,
      estado,
      codigo_de_busqueda,
      id_de_agrupacion_social,
      beneficiario,
      observacion_tecnica,
      segunda_observacion,
      referencia,
    }) => {
      const observations: { observation: string }[] = [];

      if (observacion) {
        observations.push({ observation: observacion });
      }

      if (segunda_observacion) {
        observations.push({ observation: segunda_observacion });
      }

      if (referencia && referencia.toLocaleLowerCase() !== "verificado") {
        observations.push({ observation: referencia });
      }

      return prisma.property.create({
        data: {
          code: codigo ? codigo + "" : "",
          area: superficie ? superficie + "" : "",
          expertiseOfArea: superficie_pericia ? superficie_pericia + "" : "",
          name: nombre ? nombre : "",
          polygone: poligono ? poligono + "" : "Predio sin nombre",
          bodies: cuerpos ? +cuerpos : 0,
          plots: parcelas ? +parcelas : 0,
          sheets: fojas ? +fojas : 0,
          fileNumber: expediente
            ? {
                create: {
                  number: expediente,
                },
              }
            : undefined,
          reference: {
            connectOrCreate: {
              where: {
                name: "Verificado",
              },
              create: {
                name: "Verificado",
              },
            },
          },
          city: {
            connect: {
              name: "La Paz",
            },
          },
          province: provincia
            ? {
                connect: {
                  name: provincia,
                },
              }
            : {
                connect: {
                  name: "Por definir",
                },
              },
          municipality: municipio
            ? {
                connect: {
                  name: municipio,
                },
              }
            : {
                connect: {
                  name: "Por definir",
                },
              },
          responsibleUnit: unidad_responsable
            ? {
                connectOrCreate: {
                  where: {
                    name: unidad_responsable,
                  },
                  create: {
                    name: unidad_responsable,
                  },
                },
              }
            : undefined,
          activity: actividad
            ? {
                connectOrCreate: {
                  where: {
                    name: actividad,
                  },
                  create: {
                    name: actividad,
                  },
                },
              }
            : undefined,
          clasification: clasificación
            ? {
                connectOrCreate: {
                  where: {
                    name: clasificación,
                  },
                  create: {
                    name: clasificación,
                  },
                },
              }
            : undefined,
          type: tipo_de_predio
            ? {
                connectOrCreate: {
                  where: {
                    name: tipo_de_predio,
                  },
                  create: {
                    name: tipo_de_predio,
                  },
                },
              }
            : undefined,
          folderLocation: ubicación_de_carpeta
            ? {
                connectOrCreate: {
                  where: {
                    name: ubicación_de_carpeta,
                  },
                  create: {
                    name: ubicación_de_carpeta,
                  },
                },
              }
            : undefined,
          state: estado
            ? {
                connectOrCreate: {
                  where: {
                    name: estado,
                  },
                  create: {
                    name: estado,
                    stage: {
                      connectOrCreate: {
                        where: {
                          name: "Departamental",
                        },
                        create: {
                          name: "Departamental",
                        },
                      },
                    },
                  },
                },
              }
            : undefined,
          secondState: estado_2 ? estado_2 : "",
          groupedState: estado_agrupado
            ? {
                connectOrCreate: {
                  where: {
                    name: estado_agrupado,
                  },
                  create: {
                    name: estado_agrupado,
                  },
                },
              }
            : undefined,
          codeOfSearch: codigo_de_busqueda,
          observations: {
            createMany: {
              data: observations,
            },
          },
          agrupationIdentifier: id_de_agrupacion_social
            ? id_de_agrupacion_social + ""
            : "",
          beneficiaries: beneficiario
            ? {
                connectOrCreate: {
                  where: {
                    name: beneficiario,
                  },
                  create: {
                    name: beneficiario,
                  },
                },
              }
            : undefined,
          technicalObservation: observacion_tecnica ? observacion_tecnica : "",
          // legal: {
          //   connectOrCreate: {
          //     where: {
          //       user: {
          //         username:
          //       }
          //     }
          //   }
          // }
        },
      });
    },
  );

  const user = prisma.user.create({
    data: {
      names: "Carlos Elmer",
      firstLastName: "Chambi",
      secondLastName: "Valencia",
      username: "carlos.chambi",
      password: bcrypt.hashSync("Inra12345", 10),
      type: {
        connect: {
          name: "Pasante",
        },
      },
      role: {
        connectOrCreate: {
          where: {
            name: "Administrador",
          },
          create: {
            name: "Administrador",
          },
        },
      },
    },
  });

  for (const city of cities) {
    await prisma.city.create({
      data: {
        name: city.name,
      },
    });

    await prisma.$transaction(
      /// @ts-ignore
      city.provinces.map((province: any) => {
        return prisma.province.create({
          data: {
            name: province.name,
            city: { connect: { name: city.name } },
            municipalities: {
              createMany: {
                data: province.municipalities.map((m: any) => ({
                  name: m.name,
                })),
              },
            },
            code: province.code,
          },
        });
      }),
    );
  }

  await prisma.$transaction([
    createRoles(),
    prisma.userType.createMany({
      data: userTypes,
      skipDuplicates: true,
    }),
    prisma.user.createMany({
      data: users,
      skipDuplicates: true,
    }),
    user,
    ...propertiesMapped,
  ]);

  const permissionsID: string[] = [];
  for (const permission of permissions) {
    await new Promise((resolve) => setTimeout(resolve, delay));
    const { id } = await prisma.permission.create({ data: permission });
    console.log("permiso creado");
    permissionsID.push(id);
  }

  for (const username of ["carlos.chambi", "daniel.chipana"]) {
    for (const id of permissionsID) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      console.log("permiso asignado a: " + username);
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
