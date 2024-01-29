import { User } from "./pages/UserPage/models/types";

export type GraphQLResponse<T> = {
  data: T;
};

export type GraphQLErrorResponse = {
  errors: Error[];
};

export type UserAuthenticate = Pick<
  User,
  "username" | "role" | "names" | "firstLastName" | "secondLastName"
>;
