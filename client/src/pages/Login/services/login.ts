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
  try {
    return await instance.post<GraphQLResponse<APILoginResponse>>('/', {
      query: LOGIN_QUERY,
      variables: {
        username, password
      }
    }, {
      headers: {
        operation: 'Login',
      }
    })
  } catch (e) {
    throw e
  }
}