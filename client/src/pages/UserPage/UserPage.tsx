import React from "react";
import { UserList } from "./components/UserList";
import { UserProvider } from "./context/UserContext";

export type UserProps = {};

const UserPage: React.FC<UserProps> = ({ }) => {
  return <UserProvider>
    <UserList />
  </UserProvider>;
};

export default UserPage;
