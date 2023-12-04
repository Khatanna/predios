export type GraphQLResponse<T> = {
  data: T;
};

export type GraphQLErrorResponse = {
  errors: Error[];
};

export type UserAuthenticate = {
  username: string;
  connection: string;
};
