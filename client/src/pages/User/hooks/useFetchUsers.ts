import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { GraphQLErrorResponse, GraphQLResponse } from "../../Login/models/types";
import { APIGetAllUser } from "../models/user";
import { useAuth, useAxios } from "../../../hooks";
import { getNewAccessToken } from "../../Login/services";

const GET_ALL_USERS_QUERY = `
  query AllUsers {
    allUsers {
      name
      username
			firstLastName
			secondLastName
    }
  }
`

export const useFetchUsers = () => {
  const { refreshToken } = useAuth();
  const axios = useAxios();
  const { isLoading, error, data } = useQuery<
    AxiosResponse<GraphQLResponse<APIGetAllUser>>,
    AxiosError<GraphQLErrorResponse>
  >(['get_users'], async () => {
    try {
      return await axios.post<GraphQLResponse<APIGetAllUser>>('/', {
        query: GET_ALL_USERS_QUERY,
      })
    } catch (e) {
      throw e;
    }
  },
    // {
    //   retry: (failureCount, error: AxiosError) => {
    //     if (failureCount < 2 && error.response?.status === 401) {
    //       console.log({ failureCount });
    //       axios.interceptors.request.use(async config => {
    //         config.headers.Authorization = (await getNewAccessToken(refreshToken!)).data.data.accessToken;

    //         return config;
    //       }, error => error)
    //       return true;
    //     }
    //     return false;
    //   }
    // }
  );

  return {
    isLoading,
    error,
    data
  }
}