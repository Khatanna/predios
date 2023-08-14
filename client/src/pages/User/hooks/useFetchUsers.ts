import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import {
  GraphQLErrorResponse,
  GraphQLResponse,
} from "../../Login/models/types";
import { APIGetAllUser } from "../models/user";
import { useAxios } from "../../../hooks";

const GET_ALL_USERS_QUERY = `
  query AllUsers {
    allUsers {
      name
      username
			firstLastName
			secondLastName
    }
  }
`;

export const useFetchUsers = () => {
  const axios = useAxios();
  const { isLoading, error, data } = useQuery<
    AxiosResponse<GraphQLResponse<APIGetAllUser>>,
    AxiosError<GraphQLErrorResponse>
  >(["get_users"], async () => {
    return await axios.post<GraphQLResponse<APIGetAllUser>>("/", {
      query: GET_ALL_USERS_QUERY,
    });
  });

  return {
    isLoading,
    error,
    data,
  };
};
