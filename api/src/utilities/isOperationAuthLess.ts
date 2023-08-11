import { GraphQLError } from "graphql";
import { Code, Status } from "../constants";

const operationAuthLess = ['login', 'logout']

export const isOperationAuthLess = (operation: string | string[] = '') => {
  if (Array.isArray(operation)) {
    throw new GraphQLError('Solo se permite una operacion por peticion', {
      extensions: {
        code: Code.UNAUTHENTICATED,
        http: { status: Status.UNAUTHORIZED },
      },
    });
  }
  return operationAuthLess.includes(operation.toLocaleLowerCase());
}