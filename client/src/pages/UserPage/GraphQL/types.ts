import { gql } from '@apollo/client';
export const UserItemFragment = gql`
  fragment UserItem on User {
    names
    username
    firstLastName
    secondLastName
    status
    connection
  }
`

export const GET_ALL_USERS_QUERY = gql`
  query AllUsers($filterText: String) {
    users: getAllUsers(filterText: $filterText){
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
  mutation UpdateStateUserByUsername ($username: String, $input: UserInput) {
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
`