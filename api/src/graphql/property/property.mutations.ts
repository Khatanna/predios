import {
  Activity,
  Beneficiary,
  City,
  Clasification,
  FileNumber,
  FolderLocation,
  GroupedState,
  Municipality,
  Observation,
  Prisma,
  Property,
  Province,
  Reference,
  State,
  Tracking,
  Type,
  Unit,
  User,
} from "@prisma/client";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";
import { resolveNestedField } from "../../utilities/resolveNestedField";

type TrackingInput = {
  state: State;
  responsible: User;
} & Tracking;

type PropertyInput = Property & {
  activity: Pick<Activity, "name">;
  clasification: Pick<Clasification, "name">;
  state: Pick<State, "name">;
  groupedState: Pick<GroupedState, "name">;
  city: Pick<City, "name">;
  province: Pick<Province, "name">;
  municipality: Pick<Municipality, "name">;
  folderLocation: Pick<FolderLocation, "name">;
  technical?: { user: Pick<User, "username"> };
  legal?: { user: Pick<User, "username"> };
  type: Pick<Type, "name">;
  responsibleUnit: Pick<Unit, "name">;
  reference: Pick<Reference, "name">;
  fileNumber: Pick<FileNumber, "number" | "id">;
  technicalObservation: string;
  trackings: TrackingInput[];
  beneficiaries: Pick<Beneficiary, "name">[];
  observations: Pick<Observation, "observation">[];
};

export const createProperty = async (
  _parent: any,
  {
    input: {
      name,
      area,
      expertiseOfArea,
      plots,
      bodies,
      sheets,
      code,
      codeOfSearch,
      agrupationIdentifier,
      secondState,
      polygone,
      technicalObservation,
      fileNumber,
      activity,
      clasification,
      state,
      groupedState,
      city,
      province,
      municipality,
      folderLocation,
      technical,
      legal,
      type,
      responsibleUnit,
      reference,
      trackings,
      beneficiaries,
      observations,
    },
  }: { input: PropertyInput },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "CREATE", "PROPERTY");
    const property = await prisma.property.create({
      data: {
        name,
        area,
        expertiseOfArea,
        plots,
        bodies,
        sheets,
        code,
        codeOfSearch,
        agrupationIdentifier,
        secondState,
        polygone,
        technicalObservation,
        fileNumber: {
          create: fileNumber,
        },
        observations: observations
          ? {
              createMany: {
                data: observations,
              },
            }
          : undefined,
        activity: {
          connect: activity,
        },
        clasification: {
          connect: clasification,
        },
        state: {
          connect: state,
        },
        groupedState: {
          connect: groupedState,
        },
        city: {
          connect: city,
        },
        province: {
          connect: province,
        },
        municipality: {
          connect: municipality,
        },
        folderLocation: {
          connect: folderLocation,
        },
        type: {
          connect: type,
        },
        responsibleUnit: {
          connect: responsibleUnit,
        },
        reference: {
          connect: reference,
        },
        technical:
          technical && technical.user && technical.user.username
            ? {
                create: {
                  user: {
                    connect: technical.user,
                  },
                },
              }
            : undefined,
        legal:
          legal && legal.user && legal.user.username
            ? {
                create: {
                  user: {
                    connect: legal.user,
                  },
                },
              }
            : undefined,
      },
    });

    if (beneficiaries) {
      for (let beneficiary of beneficiaries) {
        await prisma.beneficiary.upsert({
          where: {
            name: beneficiary.name,
          },
          create: {
            name: beneficiary.name,
            properties: {
              connect: {
                id: property.id,
              },
            },
          },
          update: {},
        });
      }
    }

    if (trackings) {
      for (let tracking of trackings) {
        await prisma.tracking.create({
          data: {
            observation: tracking.observation,
            dateOfInit: tracking.dateOfInit,
            numberOfNote: tracking.numberOfNote,
            state: {
              connect: {
                name: tracking.state.name,
              },
            },
            responsible: tracking.responsible?.username
              ? {
                  connect: {
                    username: tracking.responsible.username,
                  },
                }
              : undefined,
            property: {
              connect: {
                id: property.id,
              },
            },
          },
        });
      }
    }

    return property;
  } catch (e) {
    throw e;
  }
};

export const updateProperty = async (
  _parent: any,
  { input: { id } }: { input: PropertyInput },
  { prisma, userContext }: Context,
) => {
  hasPermission(userContext, "UPDATE", "PROPERTY");
  const propertyUpdated = await prisma.property.update({
    where: {
      id,
    },
    data: {},
    include: {
      beneficiaries: {
        select: { name: true },
      },
    },
  });

  return propertyUpdated;
};
export const updateField = async (
  _parent: any,
  { id, fieldName, value }: { id: string; fieldName: string; value: string },
  { prisma, userContext }: Context,
) => {
  hasPermission(userContext, "UPDATE", "PROPERTY");
  let propertyUpdated;
  console.log({ fieldName, value });
  if (fieldName === "fileNumber.number") {
    propertyUpdated = await prisma.property.update({
      where: {
        id,
      },
      data: {
        fileNumber: resolveFileNumber(value, id),
      },
    });
  } else if (
    fieldName === "legal.user.username" ||
    fieldName === "technical.user.username"
  ) {
    console.log(value);
    propertyUpdated = await prisma.property.update({
      where: {
        id,
      },
      data: {
        [fieldName === "legal.user.username" ? "legal" : "technical"]: {
          upsert: resolveUser(value, id),
        },
      },
    });
  } else if (fieldName.includes(".")) {
    propertyUpdated = await prisma.property.update({
      where: {
        id,
      },
      data: { ...resolveNestedField({}, fieldName.split("."), value) },
    });
  } else {
    propertyUpdated = await prisma.property.update({
      where: {
        id,
      },
      data: {
        [fieldName]: value,
      },
    });
  }

  return propertyUpdated;
};
export const updateFieldNumber = async (
  _parent: any,
  { id, fieldName, value }: { id: string; fieldName: string; value: number },
  { prisma, userContext }: Context,
) => {
  hasPermission(userContext, "UPDATE", "PROPERTY");
  console.log({ fieldName, value });
  const propertyUpdated = await prisma.property.update({
    where: {
      id,
    },
    data: {
      [fieldName]: value,
    },
  });

  return propertyUpdated;
};

const resolveFileNumber = (value: string, propertyId: string) => {
  return value.length === 0
    ? {
        delete: {
          propertyId,
        },
      }
    : {
        upsert: {
          where: {
            propertyId,
          },
          create: {
            number: value,
          },
          update: {
            number: value,
          },
        },
      };
};
const resolveUser = (value: string, propertyId: string) => {
  return {
    where: {
      propertyId,
    },
    create: {
      user: {
        connect: {
          username: value,
        },
      },
    },
    update: {
      user: {
        connect: {
          username: value,
        },
      },
    },
  };
};

export const deleteProperty = async (
  _parent: any,
  { id }: { id: string },
  { prisma, userContext }: Context,
) => {
  hasPermission(userContext, "UPDATE", "PROPERTY");

  return await prisma.property.delete({
    where: {
      id,
    },
  });
};
