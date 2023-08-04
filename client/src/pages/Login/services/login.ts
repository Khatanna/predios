import { instance } from "../../../utilities/config/axios";
import { APILoginResponse, FormLoginValues, GraphQLResponse } from "../models/types";

const LOGIN_QUERY = `
	query Query($username: String, $password: String)	{
		auth: login(username: $username, password: $password) {
      accessToken
      refreshToken
    }
	}
`;

export const login = async ({ username, password }: FormLoginValues) => {
  const { data } = await instance.post<GraphQLResponse<APILoginResponse>>('/', {
    query: LOGIN_QUERY,
    variables: {
      username, password
    }
  })

  return { ...data, error: data.errors ? data.errors[0] : undefined };
}