import axios from "axios";

const GET_NEW_ACCESS_TOKEN_QUERY = `
	query Query($refreshToken: String)	{
		accessToken: getNewAccessToken(refreshToken: $refreshToken)
	}
`;

export const getNewAccessToken = (refreshToken: string) => {
  return axios.post('https://172.18.0.202:3001/', {
    query: GET_NEW_ACCESS_TOKEN_QUERY,
    variables: {
      refreshToken
    },
  }, { headers: { operation: 'Login' } });
}