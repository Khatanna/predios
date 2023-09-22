import React from "react";
import { UserList } from "./components/UserList";

export type UserProps = {};

const UserPage: React.FC<UserProps> = ({ }) => {
  return <UserList />;
};

export default UserPage;
