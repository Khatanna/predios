export type UserAuthenticate = {
  username: string;
  connection: string;
  // permissions: Record<
  //   string,
  //   Pick<Permission, "resource" | "level" | "status">
  // >;
};

export type GraphQLResponse<T> = {
  data: T;
};

export type GraphQLErrorResponse = {
  errors: Error[];
};
