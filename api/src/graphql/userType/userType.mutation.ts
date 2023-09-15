import { Prisma, UserType, PrismaClient } from "@prisma/client"
import { GraphQLError } from "graphql"
import { Code, Status } from "../../constants";
const prisma = new PrismaClient();

export const createUserType = async (_: any, { input }: { input: UserType }) => {
  try {
    const userType = await prisma.userType.create({ data: input });

    return {
      created: Boolean(userType),
      userType
    }
  } catch (e) {
    throw e;
  }
}