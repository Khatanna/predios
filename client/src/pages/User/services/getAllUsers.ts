import { instance } from "../../../utilities/config/axios"
import { GraphQLResponse } from "../../Login/models/types"
import { APIGetAllUser } from "../models/user"

const GET_ALL_USERS_QUERY = `
  query AllUsers {
    allUsers {
      name
      username
    }
  }
`

export const getAllUsers = async () => {
  try {
    return await instance.post<GraphQLResponse<APIGetAllUser>>('/', {
      query: GET_ALL_USERS_QUERY,
    })
  } catch (e) {
    throw e;
  }
}