import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import { Code, Status } from "../constants";

export const throwPrismaError = (e: Prisma.PrismaClientKnownRequestError) => {
  console.log(e.code);
  return new GraphQLError(
    e.code === "P2000"
      ? `El valor proporcionado para la columna es demasiado largo para el tipo de columna. Columna: `
      : e.code === "P2002"
        ? "Este recurso ya esta creado"
        : e.code === "P2022"
          ? "las columnas de esta entidad no estan especificadas en la base de datos"
          : e.message,
    {
      extensions: {
        code: Code.BAD_REQUEST,
        http: { status: Status.BAD_REQUEST },
      },
    },
  );
}