import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import { Code, Status } from "../constants";

export const throwPrismaError = (e: Prisma.PrismaClientKnownRequestError) => {
  return new GraphQLError(
    e.code === "P2000"
      ? `El valor proporcionado para la columna es demasiado largo para el tipo de columna. Columna: `
      : e.code === "P2002"
        ? "Este permiso ya esta creado"
        : e.message,
    {
      extensions: {
        code: Code.BAD_REQUEST,
        http: { status: Status.BAD_REQUEST },
      },
    },
  );
}