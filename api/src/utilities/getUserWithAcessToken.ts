import { verify } from "jsonwebtoken";
import { handleJWTError } from "./handleJWTError";

export const getUserWithAccessToken = (token: string) => {
  try {
    const user = verify(token, process.env.ACCESS_TOKEN_SECRET!);

    if (typeof user !== "string") {
      return user;
    }

    return user;
  } catch (e) {
    throw e;
  }
};
