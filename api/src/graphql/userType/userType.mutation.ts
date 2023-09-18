import { PrismaClient, UserType } from "@prisma/client";
const prisma = new PrismaClient();

export const createUserType = async (
  _: any,
  { input }: { input: UserType },
) => {
  try {
    const userType = await prisma.userType.create({ data: input });

    return {
      created: Boolean(userType),
      userType,
    };
  } catch (e) {
    throw e;
  }
};
