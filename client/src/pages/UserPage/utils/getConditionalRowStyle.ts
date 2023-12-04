import { ConditionalStyles } from "react-data-table-component";
import { User } from "../models/types";
import { UserAuthenticate } from "../../../types";

export const getConditionalRowStyle = (
  user?: UserAuthenticate,
): ConditionalStyles<User>[] => {
  if (user) {
    return [
      {
        when: ({ username }) => username === user.username,
        style: {
          color: "orange",
          fontWeight: "bold",
        },
      },
    ];
  }

  return [];
};
