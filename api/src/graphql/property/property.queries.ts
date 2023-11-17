import { GraphQLArgs } from "graphql";
import { Context } from "../../types";
import { hasPermission, prisma } from "../../utilities";

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
        folderLocation: true,
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
      orderBy: {
        registryNumber: 'asc',
      }
    });

    return result;
  } catch (e) {
    throw e;
  }
};

export const getProperty = async (_parent: any, { nextCursor, prevCursor }: { nextCursor?: string, prevCursor?: string }, context: Context) => {
  try {
    // console.log
    const property = await context.prisma.property.findFirstOrThrow({
      skip: nextCursor || prevCursor ? 1 : 0,
      take: prevCursor ? - 1 : 1,
      cursor: nextCursor ? {
        id: nextCursor
      } : prevCursor ? {
        id: prevCursor
      } : undefined,
      orderBy: {
        registryNumber: nextCursor ? 'asc' : prevCursor ? 'desc' : 'asc'
      },
      include: {
        beneficiaries: {
          include: {
            properties: true
          },
          orderBy: {
            createdAt: 'asc'
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
        folderLocation: true,
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
        fileNumber: true,
        trackings: {
          include: {
            responsible: true,
            state: true
          }
        },
      },
    });
    let prevProperty;

    if (nextCursor || prevCursor) {
      prevProperty = await context.prisma.property.findFirst({
        cursor: {
          id: nextCursor ?? prevCursor
        },
        take: -1,
        skip: 1,
        orderBy: {
          registryNumber: 'asc'
        }
      });
    }

    return {
      nextCursor: property?.id,
      prevCursor: prevProperty?.id,
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
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        activity: true,
        clasification: true,
        observations: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        type: true,
        folderLocation: true,
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
        },
        fileNumber: true,
      },
    });

    // console.log(property.observations)
    return property
  } catch (e) {
    throw e;
  }
}
export const searchPropertyByAttribute = async (_parent: any, { code, codeOfSearch, agrupationIdentifier }: { code: string, codeOfSearch: string, agrupationIdentifier: string }, { prisma, userContext }: Context) => {
  try {
    hasPermission(userContext, 'READ', 'PROPERTY');
    console.log({ code, codeOfSearch, agrupationIdentifier });
    const properties = await prisma.property.findMany({
      take: 8,
      where: {
        OR: [
          {
            code: {
              contains: code
            },
            agrupationIdentifier: {
              contains: agrupationIdentifier
            },
            codeOfSearch: {
              contains: codeOfSearch
            }
          }
        ]
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
        folderLocation: true,
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

    return properties
  } catch (e) {
    throw e;
  }
}