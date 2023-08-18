import { AxiosInstance } from "axios";
import { GraphQLResponse } from "../../Login/models/types";
import { APIGetAllUser } from "../models/types";

const GET_ALL_USERS_QUERY = `
  query AllUsers {
    allUsers {
      names
      username
			firstLastName
			secondLastName
      status
      type {
        name
      }
    }
  }
`;

export const getAllUsers = async (axios: AxiosInstance) => {
  const { data } = await axios.post<GraphQLResponse<APIGetAllUser>>('/', {
    query: GET_ALL_USERS_QUERY,
  });

  return data;
}