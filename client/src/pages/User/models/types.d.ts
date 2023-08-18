export type UserType = {
  name: string
}

export type User = {
  names: string;
  firstLastName: string;
  secondLastName: string;
  username: string;
  type?: UserType
  status: string
}

export type APIGetAllUser = {
  allUsers: User[]
}
