import { Alert, Spinner } from "react-bootstrap";
import { useFetchUsers } from "../../hooks/useFetchUsers";
import { DataTableUser } from "../DataTableUser";
import { useAuthStore } from "../../../../state/useAuthStore";

const UserList: React.FC = () => {
  const { isLoading, error, data } = useFetchUsers();
  const { user } = useAuthStore();

  // if (!user?.permissions["USER@READ"]) {
  //   return (
  //     <div className="my-2">
  //       <Alert variant="danger">
  //         <Alert.Heading>No tiene los permisos suficientes</Alert.Heading>
  //         No tiene permisos para ver la lista de usuarios
  //       </Alert>
  //     </div>
  //   );
  // }

  // if (user?.permissions["USER@READ"].status === "DISABLE") {
  //   return (
  //     <div className="my-2">
  //       <Alert variant="danger">
  //         <Alert.Heading>Estos permisos estan deshabilitados</Alert.Heading>
  //         El administrador ha deshablitado estos permisos para todos los
  //         usuarios
  //       </Alert>
  //     </div>
  //   );
  // }

  if (isLoading) {
    return (
      <div className="position-absolute top-50 start-50 translate-middle">
        <Spinner variant="success" />
        cargando lista de usuarios...
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-2">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return <DataTableUser data={data?.allUsers ?? []} isLoading={isLoading} />;
};

export default UserList;
