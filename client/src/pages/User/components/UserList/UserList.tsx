import { Spinner } from "react-bootstrap";
import { DataTableUser } from "../DataTableUser";
import { useFetchUsers } from "../../hooks/useFetchUsers";
import { useUsersStore } from "../../state/useUsersStore";

const UserList: React.FC = () => {
  const { isLoading, error } = useFetchUsers();
  const { users } = useUsersStore()
  if (isLoading) {
    return <Spinner className="position-absolute top-50 start-50 translate-middle" variant="success" />;
  }

  if (error) {
    return (
      <div>
        No hay usuarios {JSON.stringify(error.response?.data.errors[0].message)}
      </div>
    );
  }

  return (
    <DataTableUser data={users} />
  );
};

export default UserList;
