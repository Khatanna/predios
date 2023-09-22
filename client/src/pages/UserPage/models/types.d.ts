export type UserType = {
  id: string;
  name: string;
};

export type User = {
  id: string
  names: string;
  firstLastName: string;
  secondLastName: string;
  username: string;
  password: string;
  type: UserType;
  typeId: string;
  status: string;
  createdAt: string;
  connection: string;
};

export type UserForForm = Pick<User, 'names' | 'firstLastName' | 'secondLastName' | 'username' | 'password' | 'status' | 'typeId'>

export type APIGetAllUser = {
  allUsers: User[];
};

export interface UpdateUserResponse {
  result: {
    updated: boolean;
    user: UserForForm;
  };
}

export interface CreateUserTypeResponse {
  result: {
    created: boolean;
  };
}

export interface CreateUserTypeVariables {
  input: Omit<UserType, "id">;
}

export interface CreateUserResponse {
  result: {
    created: boolean;
  };
}
