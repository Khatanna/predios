import { Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Table } from "../../../../components/Table";
import { useAuthStore } from "../../../../state/useAuthStore";
import { useFetchUsers } from "../../hooks";
import { columns } from "../../utils/TableColumns";
import { getConditionalRowStyle } from "../../utils/getConditionalRowStyle";
import { SubHeaderComponent } from "../SubHeaderComponent";
import { UserActions } from "../UserActions";
import { gql, useSubscription } from "@apollo/client";
const ON_CONNECTED_SUBCRIPTION = gql`
  subscription OnUserConnected {
    userConnected {
      username
      connected
    }
  }
`;

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { loading, error, data, setData } = useFetchUsers();

  useSubscription<{
    userConnected: { username: string; connected: boolean };
  }>(ON_CONNECTED_SUBCRIPTION, {
    onData({ data }) {
      if (data.data && data.data.userConnected) {
        setData((currentData) => {
          return currentData.map((user) => {
            if (user.username === data.data?.userConnected.username) {
              return {
                ...user,
                connection: data.data?.userConnected.connected
                  ? "ONLINE"
                  : "OFFLINE",
              };
            }

            return user;
          });
        });
      }
    },
  });

  const conditionalRowStyle = getConditionalRowStyle(user);
  if (error) {
    return (
      <div className="my-2">
        <Alert variant="danger">
          {error?.message ?? "Ocurrio un error al listar los usuarios"}
        </Alert>
      </div>
    );
  }

  return (
    <Table
      name="usuarios"
      columns={columns}
      data={data}
      conditionalRowStyles={conditionalRowStyle}
      progressPending={loading}
      dense
      onRowDoubleClicked={(user) => navigate("permissions", { state: user })}
      paginationPerPage={20}
      actions={<UserActions />}
      subHeaderComponent={<SubHeaderComponent />}
    />
  );
};

export default UserList;
