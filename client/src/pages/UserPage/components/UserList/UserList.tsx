import { Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Table } from "../../../../components/Table";
import { useAuthStore } from "../../../../state/useAuthStore";
import { useFetchUsers } from "../../hooks";
import { columns } from "../../utils/TableColumns";
import { getConditionalRowStyle } from "../../utils/getConditionalRowStyle";
import { SubHeaderComponent } from "../SubHeaderComponent";
import { UserActions } from "../UserActions";
import { InfoCircle } from "react-bootstrap-icons";
// import { } from 'react-bootstrap-icons'
const UserList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { loading, error, data } = useFetchUsers();

  const conditionalRowStyle = getConditionalRowStyle(user);
  if (error) {
    return (
      <div className="my-2">
        <Alert variant="danger">
          <div className="fw-bold fs-5 d-flex gap-3">
            <InfoCircle fontSize={32} />
            {error.message ?? "Ocurrio un error al listar los usuarios"}
          </div>
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
