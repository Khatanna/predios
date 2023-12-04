import { User } from "../models/types";
import { capitalizeString } from "../utils/capitalizeString";

export const userListAdapter = (users?: User[]): User[] => {
  if (!users) {
    return [];
  }

  return users.map((user) => ({
    ...user,
    names: user.names
      .split(/\s/)
      .map((w) => w[0] + w.slice(1).toLocaleLowerCase())
      .join(" "),
    firstLastName: capitalizeString(user.firstLastName),
    secondLastName: capitalizeString(user.secondLastName),
  }));
};
