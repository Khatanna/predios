export type User = {
  name: string;
  firstLastName: string;
  secondLastName: string;
  username: string;
}

export type APIGetAllUser = {
  allUsers: User[]
}
