import { instance } from "../../../utilities/config/axios"
import { APIIsAuthResponse, GraphQLResponse } from "../models/types"

const IS_AUTH_QUERY = `
	query Query($id: ID, $token: String)	{
		isAuth(id: $id, token: $token) 
	}
`
export const isAuth = async (id?: string, token?: string) => {
  const { data } = await instance.post<GraphQLResponse<APIIsAuthResponse>>('/', {
    query: IS_AUTH_QUERY,
    variables: { id, token }
  })

  return data.data.isAuth;
}