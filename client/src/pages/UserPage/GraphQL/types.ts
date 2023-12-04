import { gql } from "@apollo/client";

export const GET_ALL_USERS_QUERY = gql`
  query AllUsers($filterText: String) {
    users: getAllUsers(filterText: $filterText) {
      names
      username
      firstLastName
      secondLastName
      status
      connection
      type {
        name
      }
      role {
        name
      }
    }
  }
`;

export const DISABLE_USER_MUTATION = gql`
  mutation UpdateStateUserByUsername($username: String, $input: UserInput) {
    user: updateStateUserByUsername(username: $username, input: $input) {
      names
      username
      firstLastName
      secondLastName
      status
      connection
      role {
        name
      }
      type {
        name
      }
    }
  }
`;

export const DELETE_USER_BY_USERNAME_MUTATION = gql`
  mutation DeleteUserByUsername($username: String) {
    user: deleteUserByUsername(username: $username) {
      username
    }
  }
`;
