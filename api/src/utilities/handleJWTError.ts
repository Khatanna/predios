import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from "jsonwebtoken"
import { throwUnAuthenticateError } from "./throwUnAuthenticateError"
import { TokenErrorMessage } from "../constants"

export const handleJWTError = (error: unknown) => {
  if (error instanceof TokenExpiredError) {
    return throwUnAuthenticateError(TokenErrorMessage.EXPIRED_TOKEN)
  }

  if (error instanceof JsonWebTokenError) {
    return throwUnAuthenticateError(TokenErrorMessage.INVALID_TOKEN)
  }

  if (error instanceof NotBeforeError) {
    return throwUnAuthenticateError(error.message)
  }
}
