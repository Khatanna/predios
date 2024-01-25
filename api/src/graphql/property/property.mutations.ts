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
    console.log({ trackings, beneficiaries, observations });
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
        observations: Array.isArray(observations)
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

    if (Array.isArray(beneficiaries)) {
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
          update: {
            properties: {
              connect: {
                id: property.id,
              },
            },
          },
        });
      }
    }

    if (Array.isArray(trackings)) {
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
  { id, fieldName, value }: { id: string; fieldName?: string; value: string },
  { prisma, userContext, pubSub }: Context,
) => {
  hasPermission(userContext, "UPDATE", "PROPERTY");
  let propertyUpdated;
  console.log({ fieldName, value });
  if (fieldName?.includes("trackings")) {
    propertyUpdated = await prisma.property.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        trackings: true,
      },
    });
    const trackings = propertyUpdated.trackings.sort(
      (a, b) =>
        new Date(b.dateOfInit).getTime() - new Date(a.dateOfInit).getTime(),
    );

    const [, index, field] = fieldName.split(".");

    const tracking = trackings[+index];
    console.log({ tracking });
    if (field.includes("responsible")) {
      await prisma.tracking.update({
        where: {
          id: tracking.id,
        },
        data: {
          responsible:
            value.length === 0
              ? {
                  disconnect: {
                    username: value,
                  },
                }
              : {
                  connect: {
                    username: value,
                  },
                },
        },
      });
    } else if (field.includes("state")) {
      await prisma.tracking.update({
        where: {
          id: tracking.id,
        },
        data: {
          state: {
            connect: {
              name: value,
            },
          },
        },
      });
    } else {
      await prisma.tracking.update({
        where: {
          id: tracking.id,
        },
        data: {
          [field]: value,
        },
      });
    }

    fieldName = `trackings.${field}`;
  } else if (fieldName === "fileNumber.number") {
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
    propertyUpdated = await prisma.property.update({
      where: {
        id,
      },
      data: {
        [fieldName === "legal.user.username" ? "legal" : "technical"]:
          resolveUser(value, id),
      },
    });
  } else if (fieldName?.includes(".")) {
    propertyUpdated = await prisma.property.update({
      where: {
        id,
      },
      data: { ...resolveNestedField({}, fieldName.split("."), value) },
    });
  } else {
    if (fieldName) {
      propertyUpdated = await prisma.property.update({
        where: {
          id,
        },
        data: {
          [fieldName]: value,
        },
      });
    }
  }

  if (propertyUpdated && fieldName) {
    const suscribers = await prisma.subscription.findMany({
      where: {
        propertyId: propertyUpdated.id,
      },
      include: {
        user: true,
      },
    });

    for (let suscriber of suscribers) {
      if (suscriber.user.username !== userContext?.username) {
        await prisma.notification.create({
          data: {
            fieldName,
            read: false,
            timeAgo: `${new Date().getTime()}`,
            title: "Predio actualizado",
            property: {
              connect: {
                id: propertyUpdated.id,
              },
            },
            to: {
              connect: {
                id: suscriber.userId,
              },
            },
            from: {
              connect: {
                id: userContext?.id,
              },
            },
          },
        });
      }
      await pubSub.publish("CHANGE_PROPERTY", {
        propertyChange: {
          fieldName,
          to: suscriber.user,
          from: userContext,
          property: propertyUpdated,
        },
      });
    }
  }

  return propertyUpdated;
};
export const updateFieldNumber = async (
  _parent: any,
  { id, fieldName, value }: { id: string; fieldName: string; value: number },
  { prisma, userContext, pubSub }: Context,
) => {
  hasPermission(userContext, "UPDATE", "PROPERTY");
  const propertyUpdated = await prisma.property.update({
    where: {
      id,
    },
    data: {
      [fieldName]: value,
    },
  });

  const suscribers = await prisma.subscription.findMany({
    where: {
      propertyId: propertyUpdated.id,
    },
    include: {
      user: true,
    },
  });

  for (let suscriber of suscribers) {
    if (suscriber.user.username !== userContext?.username) {
      await prisma.notification.create({
        data: {
          fieldName,
          read: false,
          timeAgo: `${new Date().getTime()}`,
          title: "Predio actualizado",
          property: {
            connect: {
              id: propertyUpdated.id,
            },
          },
          to: {
            connect: {
              id: suscriber.userId,
            },
          },
          from: {
            connect: {
              id: userContext?.id,
            },
          },
        },
      });
    }
    await pubSub.publish("CHANGE_PROPERTY", {
      propertyChange: {
        fieldName,
        to: suscriber.user,
        from: userContext,
        property: propertyUpdated,
      },
    });
  }

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
  if (value.length === 0) {
    return {
      delete: {
        property: {
          id: propertyId,
        },
      },
    };
  }
  return {
    upsert: {
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
