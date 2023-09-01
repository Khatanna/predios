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
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      throw new GraphQLError(e.code === "P2002" ? "Ya existe este tipo" : e.message, {
        extensions: {
          code: Code.BAD_REQUEST,
          http: { status: Status.BAD_REQUEST },
        }
      });
    }

    throw new GraphQLError("Error del servidor", {
      extensions: {
        code: Code.INTERNAL_SERVER_ERROR,
        http: { status: Status.INTERNAL_SERVER_ERROR },
      }
    });
  }
}