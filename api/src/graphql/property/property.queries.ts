import { GraphQLArgs, specifiedDirectives } from "graphql";
import { Context } from "../../types";
import { hasPermission, prisma } from "../../utilities";
import { Property } from "@prisma/client";

export const getAllProperties = async (
  _parent: any,
  _args: GraphQLArgs,
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "READ", "PROPERTY");
    const result = await prisma.property.findMany({
      include: {
        beneficiaries: {
          include: {
            properties: true,
          },
        },
        activity: true,
        clasification: true,
        observations: {
          include: {
            property: true,
          },
        },
        type: true,
        folderLocation: true,
        groupedState: true,
        reference: true,
        responsibleUnit: true,
        state: {
          include: {
            stage: true,
          },
        },
        city: {
          include: {
            provinces: {
              include: {
                municipalities: true,
              },
            },
          },
        },
        province: {
          include: {
            municipalities: true,
          },
        },
        municipality: true,
      },
      orderBy: {
        registryNumber: "asc",
      },
    });

    return result;
  } catch (e) {
    throw e;
  }
};

export const getPropertyByRegistryNumber = async (
  _parent: any,
  { id }: { id: string },
  context: Context,
) => {
  try {
    const property = await prisma.property.findFirstOrThrow({
      where: {
        id,
      },
      include: {
        beneficiaries: {
          include: {
            properties: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        activity: true,
        clasification: true,
        observations: {
          include: {
            property: true,
          },
        },
        type: true,
        folderLocation: true,
        groupedState: true,
        reference: true,
        responsibleUnit: true,
        state: {
          include: {
            stage: true,
          },
        },
        city: {
          include: {
            provinces: {
              include: {
                municipalities: true,
              },
            },
          },
        },
        province: {
          include: {
            municipalities: true,
          },
        },
        municipality: true,
        technical: {
          include: {
            user: true,
          },
        },
        legal: {
          include: {
            user: true,
          },
        },
        fileNumber: true,
        trackings: {
          include: {
            responsible: true,
            state: true,
          },
        },
      },
    });

    const next = await prisma.property.findFirst({
      where: {
        registryNumber: {
          gt: property.registryNumber,
        },
      },
      select: {
        id: true,
      },
      orderBy: {
        registryNumber: "asc",
      },
    });

    const prev = await prisma.property.findFirst({
      where: {
        registryNumber: {
          lt: property.registryNumber,
        },
      },
      select: {
        id: true,
      },
      orderBy: {
        registryNumber: "desc",
      },
    });

    return {
      property,
      next: next?.id,
      prev: prev?.id,
    };
  } catch (e) {
    throw e;
  }
};

export const getProperty = async (
  _parent: any,
  { nextCursor, prevCursor }: { nextCursor?: string; prevCursor?: string },
  context: Context,
) => {
  try {
    const property = await context.prisma.property.findFirstOrThrow({
      skip: nextCursor || prevCursor ? 1 : 0,
      take: prevCursor ? -1 : 1,
      cursor: nextCursor
        ? {
            id: nextCursor,
          }
        : prevCursor
        ? {
            id: prevCursor,
          }
        : undefined,
      orderBy: {
        registryNumber: nextCursor ? "asc" : prevCursor ? "desc" : "asc",
      },
      include: {
        beneficiaries: {
          include: {
            properties: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        activity: true,
        clasification: true,
        observations: {
          include: {
            property: true,
          },
        },
        type: true,
        folderLocation: true,
        groupedState: true,
        reference: true,
        responsibleUnit: true,
        state: {
          include: {
            stage: true,
          },
        },
        city: {
          include: {
            provinces: {
              include: {
                municipalities: true,
              },
            },
          },
        },
        province: {
          include: {
            municipalities: true,
          },
        },
        municipality: true,
        technical: {
          include: {
            user: true,
          },
        },
        legal: {
          include: {
            user: true,
          },
        },
        fileNumber: true,
        trackings: {
          include: {
            responsible: true,
            state: true,
          },
        },
      },
    });
    let prevProperty;

    if (nextCursor || prevCursor || property) {
      prevProperty = await context.prisma.property.findFirst({
        cursor: {
          id: nextCursor ?? prevCursor ?? property.id,
        },
        take: -1,
        skip: 1,
        orderBy: {
          registryNumber: "asc",
        },
      });
    }

    return {
      nextCursor: property?.id,
      prevCursor: prevProperty?.id,
      property,
    };
  } catch (e) {
    throw e;
  }
};

export const getPropertyById = (
  _parent: any,
  { id }: { id: string },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "READ", "PROPERTY");

    return prisma.property.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        beneficiaries: {
          include: {
            properties: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        activity: true,
        clasification: true,
        observations: {
          orderBy: {
            createdAt: "desc",
          },
        },
        type: true,
        folderLocation: true,
        groupedState: true,
        reference: true,
        responsibleUnit: true,
        state: {
          include: {
            stage: true,
          },
        },
        city: {
          include: {
            provinces: {
              include: {
                municipalities: true,
              },
            },
          },
        },
        province: {
          include: {
            municipalities: true,
          },
        },
        municipality: true,
        technical: {
          include: {
            user: true,
          },
        },
        legal: {
          include: {
            user: true,
          },
        },
        trackings: {
          include: {
            responsible: true,
            state: true,
          },
        },
        fileNumber: true,
      },
    });
  } catch (e) {
    throw e;
  }
};
export const searchPropertyByAttribute = async (
  _parent: any,
  {
    page,
    limit,
    orderBy = "asc",
    code,
    codeOfSearch,
    agrupationIdentifier,
    name,
    beneficiary,
  }: {
    page: number;
    limit: number;
    orderBy: "asc" | "desc";
    code: string;
    codeOfSearch: string;
    agrupationIdentifier: string;
    name: string;
    beneficiary: string;
  },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "READ", "PROPERTY");
    const properties = await prisma.property.findMany({
      where: {
        OR: [
          {
            code: code !== "" ? { contains: code } : undefined,
          },
          {
            agrupationIdentifier:
              agrupationIdentifier !== ""
                ? { contains: agrupationIdentifier }
                : undefined,
          },
          {
            codeOfSearch:
              codeOfSearch !== "" ? { contains: codeOfSearch } : undefined,
          },
          {
            name: name !== "" ? { contains: name } : undefined,
          },
          {
            beneficiaries:
              beneficiary !== ""
                ? { some: { name: { contains: beneficiary } } }
                : undefined,
          },
        ],
      },
      include: {
        beneficiaries: {
          include: {
            properties: true,
          },
        },
        activity: true,
        clasification: true,
        observations: {
          include: {
            property: true,
          },
        },
        type: true,
        folderLocation: true,
        groupedState: true,
        reference: true,
        responsibleUnit: true,
        state: {
          include: {
            stage: true,
          },
        },
        city: {
          include: {
            provinces: {
              include: {
                municipalities: true,
              },
            },
          },
        },
        province: {
          include: {
            municipalities: true,
          },
        },
        municipality: true,
        technical: {
          include: {
            user: true,
          },
        },
        legal: {
          include: {
            user: true,
          },
        },
        trackings: {
          include: {
            responsible: true,
            state: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        registryNumber: orderBy,
      },
    });

    const total = await prisma.property.count({
      where: {
        OR: [
          {
            code: code !== "" ? { contains: code } : undefined,
          },
          {
            agrupationIdentifier:
              agrupationIdentifier !== ""
                ? { contains: agrupationIdentifier }
                : undefined,
          },
          {
            codeOfSearch:
              codeOfSearch !== "" ? { contains: codeOfSearch } : undefined,
          },
          {
            name: name !== "" ? { contains: name } : undefined,
          },
          {
            beneficiaries:
              beneficiary !== ""
                ? { some: { name: { contains: beneficiary } } }
                : undefined,
          },
        ],
      },
      orderBy: {
        registryNumber: orderBy,
      },
    });

    return {
      page,
      limit,
      total,
      properties,
    };
  } catch (e) {
    throw e;
  }
};

export const getProperties = async (
  _parent: any,
  {
    page = 1,
    limit = 20,
    orderBy = "asc",
    fieldOrder = "registryNumber",
    all = false,
    unit,
  }: {
    page: number;
    limit?: number;
    fieldOrder: keyof Property;
    orderBy: "asc" | "desc";
    all: boolean;
    unit: string;
  },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "READ", "PROPERTY");
    const total = await prisma.property.count({
      where:
        unit && unit !== "all"
          ? {
              responsibleUnit: {
                name: unit,
              },
            }
          : undefined,
    });
    const properties = await prisma.property.findMany({
      where:
        unit && unit !== "all"
          ? {
              responsibleUnit: {
                name: unit,
              },
            }
          : undefined,
      include: {
        beneficiaries: true,
        activity: true,
        clasification: true,
        observations: true,
        type: true,
        folderLocation: true,
        groupedState: true,
        reference: true,
        responsibleUnit: true,
        state: {
          include: {
            stage: true,
          },
        },
        city: true,
        province: true,
        municipality: true,
        fileNumber: true,
        legal: {
          include: {
            user: true,
          },
        },
        technical: {
          include: {
            user: true,
          },
        },
        trackings: {
          include: {
            responsible: true,
            state: true,
          },
        },
      },
      skip: all ? 0 : (page - 1) * limit,
      take: all ? total : limit,
      orderBy: {
        [fieldOrder]: orderBy,
      },
    });

    return {
      total,
      properties,
    };
  } catch (e) {
    throw e;
  }
};
export const getPropertyByAttribute = async (
  _parent: any,
  {
    fieldName,
    value,
    page,
    limit,
    orderBy = "asc",
  }: {
    page: number;
    limit: number;
    orderBy: "asc" | "desc";
    fieldName: string;
    value: string;
  },
  { prisma, userContext }: Context,
) => {
  try {
    hasPermission(userContext, "READ", "PROPERTY");
    const properties = prisma.property.findMany({
      where: {
        [fieldName]: {
          contains: value,
        },
      },
      include: {
        beneficiaries: {
          include: {
            properties: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        activity: true,
        clasification: true,
        observations: {
          orderBy: {
            createdAt: "desc",
          },
        },
        type: true,
        folderLocation: true,
        groupedState: true,
        reference: true,
        responsibleUnit: true,
        state: {
          include: {
            stage: true,
          },
        },
        city: {
          include: {
            provinces: {
              include: {
                municipalities: true,
              },
            },
          },
        },
        province: {
          include: {
            municipalities: true,
          },
        },
        municipality: true,
        technical: {
          include: {
            user: true,
          },
        },
        legal: {
          include: {
            user: true,
          },
        },
        trackings: {
          include: {
            responsible: true,
            state: true,
          },
        },
        fileNumber: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        registryNumber: orderBy,
      },
    });
    const total = await prisma.property.count({
      where: {
        [fieldName]: {
          contains: value,
        },
      },
      orderBy: {
        registryNumber: orderBy,
      },
    });

    return {
      page,
      limit,
      total,
      properties,
    };
  } catch (e) {
    throw e;
  }
};
