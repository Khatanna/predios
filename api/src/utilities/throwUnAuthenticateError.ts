import { GraphQLError } from "graphql"
import { Code, Status } from "../constants"

export const throwUnAuthenticateError = (message: string): GraphQLError => {
  return new GraphQLError(message, {
    extensions: {
      code: Code.UNAUTHENTICATED,
      http: { status: Status.UNAUTHORIZED },
    }
  })
}