import { User } from "../../UserPage/models/types";

export type FormLoginValues = {
  username: string;
  password: string;
};

export type Error = {
  message: string;
};

export type LoginResponse = {
  auth: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
};

export type GetNewAccessTokenResponse = {
  accessToken: string;
};
