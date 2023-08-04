import { instance } from "../../../utilities/config/axios"
import { APIGetAllUsersResponse } from "../models/user"

const GET_ALL_USERS_QUERY = `
  query AllUsers {
    allUsers {
      name
    }
  }
`

export const getAllUsers = async () => {
  const { data } = await instance.post<APIGetAllUsersResponse>('/', {
    query: GET_ALL_USERS_QUERY,
  })

  return data.data;
}