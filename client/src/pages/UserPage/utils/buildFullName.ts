import { User } from "../models/types";
import { capitalizeString } from "./capitalizeString";

export const buildFullName = (
  user?: Pick<User, "names" | "firstLastName" | "secondLastName">,
) => {
  if (!user) return;

  return `${capitalizeString(user.names)} ${capitalizeString(
    user.firstLastName,
  )} ${capitalizeString(user.secondLastName) ?? ""}`;
};
