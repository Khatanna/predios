export type UserType = {
  name: string;
};

export type User = {
  names: string;
  firstLastName: string;
  secondLastName: string;
  username: string;
  password: string;
  status: string;
  type: UserType;
  permissions: Permission[]
};

export type Permission = {
  name: string,
  description: string,
  users: User[]
}