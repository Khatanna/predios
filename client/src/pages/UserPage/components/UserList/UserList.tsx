import { Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Table } from "../../../../components/Table";
import { useAuthStore } from "../../../../state/useAuthStore";
import { useFetchUsers } from "../../hooks";
import { columns } from "../../utils/TableColumns";
import { getConditionalRowStyle } from "../../utils/getConditionalRowStyle";
import { SubHeaderComponent } from "../SubHeaderComponent";
import { UserActions } from "../UserActions";

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { loading, error, data } = useFetchUsers();
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

  // subscribeToMore({
  //   document: gql``,
  //   updateQuery: (prev, { subscriptionData }) => {
  //     if(!subscriptionData.data) return prev;

  //     const newFeddItem = subscriptionData.data.users;

  //     return Object.assign({}, prev.users.map(user => ({
  //       ...user,
  //       status: subscriptionData.data.
  //     })));
  //   } 
  // })

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
