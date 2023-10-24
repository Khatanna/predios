import { GraphQLArgs } from "graphql";
import { Context } from "../../types";
import { hasPermission } from "../../utilities";

export const getAllProperties = async (_parent: any,
  _args: GraphQLArgs,
  { prisma, userContext }: Context,) => {
  try {
    hasPermission(userContext, "READ", "PROPERTY")
    const result = await prisma.property.findMany({
      include: {
        beneficiaries: {
          include: {
            properties: true
          }
        },
        activity: true,
        clasification: true,
        observations: {
          include: {
            property: true
          }
        },
        type: true,
        subDirectory: true,
        groupedState: true,
        reference: true,
        responsibleUnit: true,
        state: {
          include: {
            stage: true
          }
        },
        city: {
          include: {
            provinces: {
              include: {
                municipalities: true
              }
            },
          }
        },
        province: {
          include: {
            municipalities: true
          }
        },
        municipality: true,
      },
    });

    return result;
  } catch (e) {
    throw e;
  }
};

export const getProperty = async (_parent: any, { nextCursor }: { nextCursor?: string }, context: Context) => {
  try {
    const property = await context.prisma.property.findFirstOrThrow({
      skip: nextCursor ? 1 : 0,
      cursor: nextCursor ? {
        id: nextCursor
      } : undefined,
      orderBy: {
        id: 'asc'
      },
      include: {
        beneficiaries: {
          include: {
            properties: true
          }
        },
        activity: true,
        clasification: true,
        observations: {
          include: {
            property: true
          }
        },
        type: true,
        subDirectory: true,
        groupedState: true,
        reference: true,
        responsibleUnit: true,
        state: {
          include: {
            stage: true
          }
        },
        city: {
          include: {
            provinces: {
              include: {
                municipalities: true
              }
            },
          }
        },
        province: {
          include: {
            municipalities: true
          }
        },
        municipality: true,
        technical: {
          include: {
            user: true
          }
        },
        legal: {
          include: {
            user: true
          }
        },
      },
    });

    return {
      nextCursor: property.id,
      property
    }
  } catch (e) {
    throw e;
  }
}
export const getPropertyById = async (_parent: any, { id }: { id: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'PROPERTY');

    const property = await prisma.property.findUniqueOrThrow({
      where: {
        id
      },
      include: {
        beneficiaries: {
          include: {
            properties: true
          }
        },
        activity: true,
        clasification: true,
        observations: {
          include: {
            property: true
          }
        },
        type: true,
        subDirectory: true,
        groupedState: true,
        reference: true,
        responsibleUnit: true,
        state: {
          include: {
            stage: true
          }
        },
        city: {
          include: {
            provinces: {
              include: {
                municipalities: true
              }
            },
          }
        },
        province: {
          include: {
            municipalities: true
          }
        },
        municipality: true,
        technical: {
          include: {
            user: true
          }
        },
        legal: {
          include: {
            user: true
          }
        },
        trackings: {
          include: {
            responsible: true,
            state: true
          }
        }
      },
    });
    return property
  } catch (e) {
    throw e;
  }
}
