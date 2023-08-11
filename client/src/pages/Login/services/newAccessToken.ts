import { instance } from "../../../utilities/config/axios";
import { APINewAccessTokenResponse, GraphQLResponse } from "../models/types";

const GET_NEW_ACCESS_TOKEN_QUERY = `
	query Query($refreshToken: String)	{
		accessToken: getNewAccessToken(refreshToken: $refreshToken)
	}
`;

export const getNewAccessToken = async (refreshToken: string) => {
  try {
    return await instance.post<GraphQLResponse<APINewAccessTokenResponse>>('/', {
      query: GET_NEW_ACCESS_TOKEN_QUERY,
      variables: {
        refreshToken
      },
    }, { headers: { operation: 'Login' } });
  } catch (e) {
    throw e;
  }
}