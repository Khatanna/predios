import { Status } from "../models/types";

export const negateStatus = (status: Status): Status => {
  if (status === "ENABLE") {
    return "DISABLE";
  }

  return "ENABLE";
};
