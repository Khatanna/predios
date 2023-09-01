import { Alert, Spinner } from "react-bootstrap";
import { DataTableUser } from "../DataTableUser";
import { useFetchUsers } from "../../hooks/useFetchUsers";
import { useUsersStore } from "../../state/useUsersStore";

const UserList: React.FC = () => {
  const { isLoading, error } = useFetchUsers();
  const { users } = useUsersStore()
  if (isLoading) {
    return <div className="position-absolute top-50 start-50 translate-middle">
      <Spinner variant="success" />
    </div>;
  }

  if (error) {
    return (
      <div className="my-2">
        <Alert variant="danger">
          <Alert.Heading>No tiene los permisos suficientes</Alert.Heading>
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <DataTableUser data={users} />
  );
};

export default UserList;
