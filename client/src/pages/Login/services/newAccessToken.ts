import axios from "axios";

const GET_NEW_ACCESS_TOKEN_QUERY = `
	query Query($refreshToken: String)	{
		accessToken: getNewAccessToken(refreshToken: $refreshToken)
	}
`;
const baseURL = import.meta.env.VITE_API_URL;
export const getNewAccessToken = (refreshToken: string) => {
  return axios.post(
    baseURL,
    {
      query: GET_NEW_ACCESS_TOKEN_QUERY,
      variables: {
        refreshToken,
      },
    },
    { headers: { operation: "Login" } },
  );
};
