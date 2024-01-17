import { User } from "../models/types";
import { capitalizeString } from "./capitalizeString";

export const buildFullName = (
  user?: Pick<User, "names" | "firstLastName" | "secondLastName">,
) => {
  if (!user) return;

  if (user.names.includes(' ')) {
    return `${user.names.split(' ').map(capitalizeString).join(' ')} ${capitalizeString(
      user.firstLastName,
    )} ${capitalizeString(user.secondLastName) ?? ""}`;
  }

  return `${capitalizeString(user.names)} ${capitalizeString(
    user.firstLastName,
  )} ${capitalizeString(user.secondLastName) ?? ""}`;
};
