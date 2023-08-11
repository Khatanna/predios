export type Permission = {
  name: string;
  description: string;
}

export type UserAuthenticate = {
  username: string;
  permissions: Permission[]
}