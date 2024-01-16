import { gql } from "@apollo/client";

export const GET_ALL_USER_TYPES_QUERY = gql`
  query GetAllUserTypes {
    options: getAllUserTypes {
      name
    }
  }
`;

export const GET_ALL_ROLES = gql`
  query GetAllRoles {
    options: getAllRoles {
      name
    }
  }
`;
