import { AxiosInstance } from "axios";
const GET_ALL_USERS_QUERY = `
  query AllUsers {
    allUsers {
      names
      username
			firstLastName
			secondLastName
      status
      createdAt
      typeId
      type {
        name
      }
    }
  }
`;

export const getAllUsers = async (axios: AxiosInstance) => {
  const { data } = await axios.post('/', {
    query: GET_ALL_USERS_QUERY,
  });

  return data;
}