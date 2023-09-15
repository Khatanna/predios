import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import { Code, Status } from "../constants";
import { getError } from "./getError";

export const throwPrismaError = (e: Prisma.PrismaClientKnownRequestError) => {
  const errorMessage = getError(e.message)[e.code];
  return new GraphQLError(
    errorMessage,
    {
      extensions: {
        code: Code.BAD_REQUEST,
        http: { status: Status.BAD_REQUEST },
      },
    },
  );
}