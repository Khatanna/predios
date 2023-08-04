import { instance } from "../../../utilities/config/axios";
import { APILoginResponse, FormLoginValues, GraphQLResponse } from "../models/types";

const GET_NEW_ACCESS_TOKEN_QUERY = `
	query Query($refreshToken: String)	{
		accessToken: getNewAccessToken(refreshToken: $refreshToken)
	}
`;

export const newAccessToken = async (refreshToken: string) => {
  const { data } = await instance.post<GraphQLResponse<APILoginResponse>>('/', {
    query: GET_NEW_ACCESS_TOKEN_QUERY,
    variables: {
      refreshToken
    }
  })

  console.log(data);
  return { ...data, error: data.errors ? data.errors[0] : undefined };
}