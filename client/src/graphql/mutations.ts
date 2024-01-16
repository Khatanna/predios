import { gql } from "@apollo/client";

export const roleMutations = {
  create: gql`
    mutation CreateRole($name: String) {
      result: createRole(name: $name) {
        name
      }
    }
  `,
  delete: gql`
    mutation DeleteRole($name: String) {
      result: deleteRole(name: $name) {
        name
      }
    }
  `,
  update: gql`
    mutation UpdateRole($currentName: String, $name: String) {
      result: updateRole(currentName: $currentName, name: $name) {
        name
      }
    }
  `,
};
export const userTypeMutations = {
  create: gql`
    mutation CreateUserType($name: String) {
      result: createUserType(name: $name) {
        name
      }
    }
  `,
  delete: gql`
    mutation DeleteUserType($name: String) {
      result: deleteUserType(name: $name) {
        name
      }
    }
  `,
  update: gql`
    mutation UpdateUserType($currentName: String, $name: String) {
      result: updateUserType(currentName: $currentName, name: $name) {
        name
      }
    }
  `,
};
