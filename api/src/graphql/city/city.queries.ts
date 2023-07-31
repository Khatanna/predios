import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllCities = async () => {
  return prisma.city.findMany({
    include: { provinces: { include: { municipalitys: true } } },
  });
};
