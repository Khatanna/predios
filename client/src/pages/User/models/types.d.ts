export type UserType = {
  id: string;
  name: string;
}

export type User = {
  names: string;
  firstLastName: string;
  secondLastName: string;
  username: string;
  password: string;
  type: UserType;
  typeId: string;
  status: string;
  createdAt?: Date;
  role: string;
  permissions: Permission[]
}

export type APIGetAllUser = {
  allUsers: User[]
}

export interface UpdateUserResponse {
  result: {
    updated: boolean
    user: User
  }
}

export interface UpdateUserVariables {
  input: {
    username: string;
    data: Omit<User, 'createdAt' | 'type' | 'permissions'>
  }
}

export interface CreateUserTypeResponse {
  result: {
    created: boolean;
  }
}

export interface CreateUserTypeVariables {
  input: Omit<UserType, 'id'>
}

export interface CreateUserResponse {
  result: {
    created: boolean;
  }
}

export interface CreateUserVariables {
  input: Omit<User, 'createdAt' | 'type' | 'permissions'>
}