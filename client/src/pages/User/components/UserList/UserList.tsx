import { Alert, Spinner } from "react-bootstrap";
import { DataTableUser } from "../DataTableUser";
import { useFetchUsers } from "../../hooks/useFetchUsers";
import { useAuth } from "../../../../hooks";

const UserList: React.FC = () => {
  const { isLoading, error, data } = useFetchUsers();
  const { user } = useAuth()

  if (!user?.permissions['USER@READ']) {
    return <div className="my-2">
      <Alert variant="danger">
        <Alert.Heading>No tiene los permisos suficientes</Alert.Heading>
        No tiene permisos para ver la lista de usuarios
      </Alert>
    </div>
  }

  if (isLoading) {
    return <div className="position-absolute top-50 start-50 translate-middle">
      <Spinner variant="success" />
    </div>;
  }

  if (error) {
    return (
      <div className="my-2">
        <Alert variant="danger">
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <DataTableUser data={data?.allUsers ?? []} isLoading={isLoading} />
  );
};

export default UserList;
