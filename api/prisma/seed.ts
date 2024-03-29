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
const trackings: Record<string, string>[] = getData("Seguimientos");
console.log("initializing seed");

const createRoles = () => {
  return prisma.role.createMany({
    data: roles,
  });
};

async function main() {
  const propertiesMapped = properties.map(
    ({
      nombre,
      beneficiario,
      poligono,
      superficie,
      superficie_pericia,
      observacion,
      parcelas,
      estado,
      tipo,
      ubicacion_de_carpeta,
      actividad,
      clasificacion,
      cuerpos,
      fojas,
      expediente,
      codigo_de_busqueda,
      unidad_responsable,
      observacion_tecnica,
      segunda_observacion,
      departamento,
      provincia,
      municipio,
      codigo,
      tecnico,
      estado_agrupado,
      referencia,
      juridico,
      id_de_agrupacion,
      estado_2,
    }) => {
      const observations: { observation: string }[] = [];

      if (observacion) {
        observations.push({ observation: observacion });
      }

      if (segunda_observacion) {
        observations.push({ observation: segunda_observacion });
      }

      // Todo lo que no sea verificado va para observacion
      if (referencia && referencia.toLocaleLowerCase() !== "verificado") {
        observations.push({ observation: referencia });
      }

      const technicalUsername =
        tecnico?.toLowerCase() === "ariel lucana"
          ? "ariel.lucana"
          : tecnico?.toLowerCase() === "beltran alavi"
          ? "beltran.alavi"
          : tecnico?.toLowerCase() === "claudia garnica"
          ? "claudia.garnica"
          : tecnico?.toLowerCase() === "cristina mamani"
          ? "cristina.mamani"
          : tecnico?.toLowerCase() === "david canaviri"
          ? "david.canaviri"
          : tecnico?.toLowerCase() === "david oscar"
          ? "david.mamani"
          : tecnico?.toLowerCase() === "edgar paredes"
          ? "edgar.paredes"
          : tecnico?.toLowerCase() === "edgar tola"
          ? "edgar.tola"
          : tecnico?.toLowerCase() === "edwin aruquipa"
          ? "edwin.aruquipa"
          : tecnico?.toLowerCase() === "edwin mamani"
          ? "edwin.mamani"
          : tecnico?.toLowerCase() === "edwin siñani"
          ? "edwin.siñani"
          : tecnico?.toLowerCase() === "emilio condori"
          ? "emilio.condori"
          : tecnico?.toLowerCase() === "franz troche"
          ? "franz.troche"
          : tecnico?.toLowerCase() === "gloria silva"
          ? "gloria.silva"
          : tecnico?.toLowerCase() === "guadalupe mayta"
          ? "guadalupe.mayta"
          : tecnico?.toLowerCase() === "javier limachi"
          ? "javier.limachi"
          : tecnico?.toLowerCase() === "joel ruiz"
          ? "marcelo.ruiz"
          : tecnico?.toLowerCase() === "lorenzo viquini"
          ? "lorenzo.viquini"
          : tecnico?.toLowerCase() === "lourdes quispe"
          ? "lourdes.quispe"
          : tecnico?.toLowerCase() === "luis siñani"
          ? "luis.siñani"
          : tecnico?.toLowerCase() === "marco a. ergueta"
          ? "marco.ergueta"
          : tecnico?.toLowerCase() === "max arias"
          ? "maximo.arias"
          : tecnico?.toLowerCase() === "olivia quispe"
          ? "olivia.quispe"
          : tecnico?.toLowerCase() === "omar fladine"
          ? "omar.fladine"
          : tecnico?.toLowerCase() === "pablo mamani"
          ? "pablo.mamani"
          : tecnico?.toLowerCase() === "reynaldo segovia"
          ? "reynaldo.segovia"
          : tecnico?.toLowerCase() === "roger chura"
          ? "roger.chura"
          : tecnico?.toLowerCase() === "roger magne"
          ? "roger.magne"
          : tecnico?.toLowerCase() === "ruddy bautista"
          ? "ruddy.bautista"
          : tecnico?.toLowerCase() === "samuel calle"
          ? "samuel.calle"
          : tecnico?.toLowerCase() === "vilma vargas"
          ? "vilma.vargas"
          : undefined;
      const legalUsername =
        juridico?.toLowerCase() === "abrahan luna"
          ? "abraham.luna"
          : juridico?.toLowerCase() === "aleida san martin"
          ? "denisse.gabriel"
          : juridico?.toLowerCase() === "andrea villarroel"
          ? "andrea.villarroel"
          : juridico?.toLowerCase() === "carmen m. acapa"
          ? "carmen.acapa"
          : juridico?.toLowerCase() === "caterin cartagena"
          ? "katherine.cartagena"
          : juridico?.toLowerCase() === "cristina centellas"
          ? "cristina.centellas"
          : juridico?.toLowerCase() === "delmira endara cespedes"
          ? "delmira.endara"
          : juridico?.toLowerCase() === "franz isla"
          ? "franz.isla"
          : juridico?.toLowerCase() === "javier herrera"
          ? "javier.herrera"
          : juridico?.toLowerCase() === "karen rojas"
          ? "tatiana.rojas"
          : juridico?.toLowerCase() === "karina rodriguez"
          ? "karina.rodriguez"
          : juridico?.toLowerCase() === "lisbeth soliz"
          ? "lisbeth.soliz"
          : juridico?.toLowerCase() === "lizeth castillo"
          ? "lizeth.castillo"
          : juridico?.toLowerCase() === "luis canaviri"
          ? "luis.canaviri"
          : juridico?.toLowerCase() === "marco zeballos"
          ? "marco.zeballos"
          : juridico?.toLowerCase() === "maria lopez"
          ? "maria.lopez"
          : juridico?.toLowerCase() === "mariela yarichime"
          ? "mariela.yarichime"
          : juridico?.toLowerCase() === "mayra ramirez"
          ? "mayra.ramirez"
          : juridico?.toLowerCase() === "milenka escobar"
          ? "milenka.escobar"
          : juridico?.toLowerCase() === "miriam callisaya"
          ? "miriam.callisaya"
          : juridico?.toLowerCase() === "miriam castañeta"
          ? "miriam.castañeta"
          : juridico?.toLowerCase() === "nelson alcon vargas"
          ? "nelson.alcon"
          : juridico?.toLowerCase() === "norma merida"
          ? "norma.merida"
          : juridico?.toLowerCase() === "omar mamani"
          ? "omar.mamani"
          : juridico?.toLowerCase() === "regina tarqui"
          ? "regina.tarqui"
          : juridico?.toLowerCase() === "roxana rodriguez"
          ? "constancia.rodriguez"
          : juridico?.toLowerCase() === "sharon"
          ? "sharon.laura"
          : juridico?.toLowerCase() === "susan alanoca"
          ? "susan.alanoca"
          : juridico?.toLowerCase() === "zulema mollinedo"
          ? "zulema.mollinedo"
          : undefined;
      return prisma.property.create({
        data: {
          code: codigo ? codigo + "" : "",
          area: superficie ? superficie + "" : "",
          expertiseOfArea: superficie_pericia ? superficie_pericia + "" : "",
          name: nombre ? nombre.substring(0, 255) : "",
          polygone: poligono ? poligono + "" : "",
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
          clasification: clasificacion
            ? {
                connectOrCreate: {
                  where: {
                    name: clasificacion,
                  },
                  create: {
                    name: clasificacion,
                  },
                },
              }
            : undefined,
          type: tipo
            ? {
                connectOrCreate: {
                  where: {
                    name: tipo,
                  },
                  create: {
                    name: tipo,
                  },
                },
              }
            : undefined,
          folderLocation: ubicacion_de_carpeta
            ? {
                connectOrCreate: {
                  where: {
                    name: ubicacion_de_carpeta,
                  },
                  create: {
                    name: ubicacion_de_carpeta,
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
          agrupationIdentifier: id_de_agrupacion ? id_de_agrupacion + "" : "",
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
          legal: legalUsername
            ? {
                create: {
                  user: {
                    connect: {
                      username: legalUsername,
                    },
                  },
                },
              }
            : undefined,
          technical: technicalUsername
            ? {
                create: {
                  user: {
                    connect: {
                      username: technicalUsername,
                    },
                  },
                },
              }
            : undefined,
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

  const propertyIDS: Record<string, string> = {};
  for (let { codigo } of trackings) {
    if (codigo) {
      const property = await prisma.property.findFirst({
        where: {
          code: codigo + "",
        },
        select: { id: true },
      });
      if (property) {
        propertyIDS[codigo + ""] = property.id;
      }
    }
  }

  const pivot = await prisma.state.findFirst();

  const trackingsMapped = trackings
    .map(
      ({ codigo, fecha_de_inicio, observacion, nota, estado, responsable }) => {
        const stateName =
          +estado === 27
            ? "Con Proyecto de Resolucion elaborado"
            : +estado === 23
            ? "RFS remitida a Control de Calidad"
            : +estado === 28
            ? "Elaboracion de Proyecto de Resolucion"
            : +estado === 44
            ? "Paralizado/Observado"
            : +estado === 47
            ? "Control de Calidad Relevamiento en campo"
            : +estado === 58
            ? "SOLICITUD ADMITIDA"
            : +estado === 61
            ? "RELEVAMIENTO DE INFORMACION EN CAMPO TERMINADO"
            : +estado === 65
            ? "CON PROYECTO DE RESOLUCION FINAL DE SANEAMIENTO"
            : +estado === 66
            ? "FALTA DE DOCUMENTOS"
            : +estado === 67
            ? "PARALIZADA POR OPOSICION AL SANEAMIENTO"
            : +estado === 71
            ? "POR REPLANTEO"
            : +estado === 72
            ? "CON SENTENCIA DE TRIBUNAL AGROAMBIENTAL"
            : +estado === 80
            ? "REMITIDA A OTRAS INSTITUCIONES"
            : +estado === 81
            ? "CONFLICTO LIMITE POLITICO ADMINISTRATIVO"
            : +estado === 82
            ? "CONFLICTO ORGANICO"
            : +estado === 83
            ? "COMPLEMENTACION EN CAMPO"
            : +estado === 84
            ? "CONFLICTO DE DERECHO PROPIETARIO"
            : +estado === 85
            ? "CONFLICTO DE LIMITES ENTRE PREDIOS"
            : +estado === 128
            ? "Conflicto"
            : pivot!.name;

        const username =
          +responsable === 1
            ? "constancia.rodriguez"
            : +responsable === 2
            ? "miriam.castañeta"
            : +responsable === 3
            ? "milenka.escobar"
            : +responsable === 4
            ? "mayra.ramirez"
            : +responsable === 5
            ? "lizeth.castillo"
            : +responsable === 6
            ? "cristina.centellas"
            : +responsable === 7
            ? "andrea.villarroel"
            : +responsable === 8
            ? "javier.herrera"
            : +responsable === 9
            ? "carmen.acapa"
            : +responsable === 10
            ? "miriam.callisaya"
            : +responsable === 12
            ? "zulema.mollinedo"
            : +responsable === 13
            ? "nelson.alcon"
            : +responsable === 14
            ? "franz.isla"
            : +responsable === 15
            ? "lisbeth.soliz"
            : +responsable === 16
            ? "denisse.gabriel"
            : +responsable === 17
            ? "abraham.luna"
            : +responsable === 18
            ? "regina.tarqui"
            : +responsable === 20
            ? "delmira.endara"
            : +responsable === 21
            ? "benito.flores"
            : +responsable === 22
            ? "omar.mamani"
            : +responsable === 23
            ? "luis.canaviri"
            : undefined;

        if (propertyIDS[codigo]) {
          const [day, month, year] = fecha_de_inicio
            ? fecha_de_inicio.replace(/\//g, "-").split("-")
            : "31-31-9999";
          const fechaFinal = `${year}-${month}-${day}`;

          return prisma.tracking.create({
            data: {
              dateOfInit: fechaFinal,
              observation: observacion ? observacion : "Sin observacion",
              numberOfNote: nota ? nota : "Sin nota",
              state: {
                connectOrCreate: {
                  where: {
                    name: stateName,
                  },
                  create: {
                    name: stateName,
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
              },
              property: {
                connect: {
                  id: propertyIDS[codigo],
                },
              },
              responsible: {
                connect: username
                  ? {
                      username,
                    }
                  : undefined,
              },
            },
          });
        }

        return [];
      },
    )
    .flat();

  await prisma.$transaction(trackingsMapped);

  for (const permission of permissions) {
    await new Promise((resolve) => setTimeout(resolve, delay));

    const roles: { roleId: string; assignedBy: string }[] = [];

    if (permission.level === "READ" && permission.resource !== "RECORD") {
      roles.push({
        roleId: "bcbc1695-ec95-4757-8bfd-9cdce7c12cc5",
        assignedBy: "carlos.chambi",
      });
    }

    if (
      permission.resource !== "USER" &&
      permission.resource !== "PERMISSION" &&
      permission.resource !== "RECORD" &&
      permission.resource !== "USERTYPE" &&
      permission.resource !== "ROLE" &&
      permission.resource !== "ROLEHASPERMISSION"
    ) {
      roles.push({
        roleId: "354c1d7d-3935-4ae8-9058-ca1c01c9af0d",
        assignedBy: "carlos.chambi",
      });
    }

    roles.push({
      roleId: "9b8a7068-c716-4abf-8664-b53c2851b714",
      assignedBy: "carlos.chambi",
    });

    await prisma.permission.create({
      data: {
        ...permission,
        roles: {
          createMany: {
            data: roles,
          },
        },
      },
    });
    console.log("permiso creado");
  }

  for (const username of ["carlos.chambi", "daniel.chipana"]) {
    await prisma.user.update({
      where: {
        username,
      },
      data: {
        role: {
          connect: {
            name: "administrador",
          },
        },
      },
    });
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
