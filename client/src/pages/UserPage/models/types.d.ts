import { StateOfStatus } from "../../../utilities/constants";

export type UserType = {
  id: string;
  name: string;
};

export type Role = {
  name: string;
};

export type Status = keyof typeof StateOfStatus;

export type User = {
  id: string;
  names: string;
  firstLastName: string;
  secondLastName: string;
  username: string;
  password: string;
  type: UserType;
  status: string;
  createdAt?: string;
  connection: string;
  role: Role;
};

export type UserItem = User & { fullName: string };

export type UserTypeInput = Omit<UserType, "id">;

export type UserInput = Omit<User, "id" | "type"> & UserTypeInput;
