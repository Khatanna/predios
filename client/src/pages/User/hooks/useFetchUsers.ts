import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  GraphQLErrorResponse,
  GraphQLResponse,
} from "../../Login/models/types";
import { APIGetAllUser } from "../models/types";
import { useAxios } from "../../../hooks";
import { useUsersStore } from "../state/useUsersStore";
import { useEffect } from "react";
import { getAllUsers } from "../services";

export const useFetchUsers = () => {
  const axios = useAxios();
  const { setUsers } = useUsersStore();
  const { isLoading, error, data } = useQuery<
    GraphQLResponse<APIGetAllUser>,
    AxiosError<GraphQLErrorResponse>
  >(["get_users"], () => getAllUsers(axios));

  useEffect(() => {
    console.log("set all users")
    if (data) {
      setUsers(data.data.allUsers)
    }
  }, [data, setUsers])

  return {
    isLoading,
    error
  };
};
