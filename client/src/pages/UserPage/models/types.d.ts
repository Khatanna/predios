export type UserType = {
  id: string;
  name: string;
};

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
  role: {
    name: string
  }
};

export type UserTypeInput = Omit<UserType, "id">;

export type UserInput = Omit<User, "id" | "type"> &
  UserTypeInput;
