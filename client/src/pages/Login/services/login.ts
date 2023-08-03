import { instance } from "../../../utilities/config/axios";
import { APIIsAuthResponse, FormLoginValues, GraphQLResponse } from "../models/types";

const LOGIN_QUERY = `
	query Query($username: String, $password: String)	{
		token: login(username: $username, password: $password) 
	}
`;

export const login = async ({ username, password }: FormLoginValues) => {
  const { data } = await instance.post<GraphQLResponse<APIIsAuthResponse>>('/', {
    query: LOGIN_QUERY,
    variables: {
      username, password
    }
  })

  return { ...data, error: data.errors ? data.errors[0] : undefined };
}