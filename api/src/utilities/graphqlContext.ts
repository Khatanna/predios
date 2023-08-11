import { isOperationAuthLess } from "./isOperationAuthLess";
import { StandaloneServerContextFunctionArgument } from "@apollo/server/standalone";
import { getUserWithAccessToken } from "./getUserWithAcessToken";
import { throwUnAuthenticateError } from "./throwUnAuthenticateError";
import { AuthResponses } from "../constants";
import { TokenExpiredError } from "jsonwebtoken";

export const graphqlContext = async ({ req }: StandaloneServerContextFunctionArgument) => {
  const token = req.headers.authorization
  const operation = req.headers.operation!;
  console.log("server context:", token);
  if (isOperationAuthLess(operation)) {
    return {};
  }

  if (token) {
    const user = getUserWithAccessToken(token);

    if (!user) {
      throw throwUnAuthenticateError(AuthResponses.UNAUTHENTICATED)
    }

    return { user };
  }

  throw throwUnAuthenticateError(AuthResponses.UNAUTHENTICATED)
}
