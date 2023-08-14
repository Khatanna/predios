import React, { forwardRef } from "react";
import { Dropdown, Spinner } from "react-bootstrap";
import DataTable, { TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useFetchUsers } from "../../hooks/useFetchUsers";
import { User } from "../../models/user";

export type UserListProps = {};

const CustomToggle = React.forwardRef(
  ({ children, onClick }: any, ref: any) => (
    <a
      ref={ref}
      href=""
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="text-black"
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-three-dots-vertical"
        viewBox="0 0 16 16"
      >
        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
      </svg>
    </a>
  ),
);

const Dots = ({ user }: { user: User }) => {
  // const axios = useAxios();
  const navigate = useNavigate();
  const CustomMenu = forwardRef(
    (
      { children, style, className, "aria-labelledby": labeledBy }: any,
      ref: any,
    ) => {
      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <ul className="list-unstyled">
            {React.Children.toArray(children).map((c) => (
              <div>{c}</div>
            ))}
          </ul>
        </div>
      );
    },
  );

  const handleDeleteClick = async () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
        actions: "d-flex gap-2",
      },
      buttonsStyling: false,
    });

    const result = await swalWithBootstrapButtons.fire({
      title: "¿Esta seguro?",
      text: `Esta a punto de inhabilitar al usuario: ${user.username}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, deshabilitar",
      cancelButtonText: "No, cancelar!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      swalWithBootstrapButtons.fire({
        title: "Inhabilitado!",
        text: `El usuario: (${user.username}) ha sido inhabilitado.`,
        icon: "success",
        confirmButtonText: "Continuar",
      });

      // const response = await axios.post('/', {
      // 	query: `mutation Mutation($username: String) {
      // 		result: deleteUserByUsername(username: $username) {
      // 			deleted
      // 		}
      // 	}`,
      // 	variables: {
      // 		username: user.username
      // 	}
      // })

      // if (response.data.data.deleted) {

      // }
    } else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire({
        title: "Cancelado",
        text: `El usuario: (${user.username}) no se inhabilitado.`,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle} />

      <Dropdown.Menu as={CustomMenu}>
        <Dropdown.Item
          eventKey="1"
          onClick={() => navigate(`edit/${user.username}`)}
        >
          ✏ Editar
        </Dropdown.Item>
        <Dropdown.Item eventKey="2" onClick={handleDeleteClick}>
          🗑 Eliminar
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const columns: TableColumn<User>[] = [
  {
    name: "Nombre de usuario",
    selector: (row: User) => row.username,
    sortable: true,
  },
  {
    name: "Nombre",
    selector: (row: User) => row.name,
    sortable: true,
  },
  {
    name: "Apellido Paterno",
    selector: (row: User) => row.firstLastName,
    sortable: true,
  },
  {
    name: "Apellido Materno",
    selector: (row: User) => row.secondLastName,
    sortable: true,
  },
  {
    cell: (row) => <Dots user={row} />,
    button: true,
  },
];

const paginationComponentOptions = {
  rowsPerPageText: "Filas por página",
  rangeSeparatorText: "de",
  selectAllRowsItem: true,
  selectAllRowsItemText: "Todos",
};

const UserList: React.FC<UserListProps> = () => {
  const navigate = useNavigate();
  const { isLoading, error, data } = useFetchUsers();
  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div>
        No hay usuarios {JSON.stringify(error.response?.data.errors[0].message)}
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data!.data.data.allUsers}
      selectableRows
      pagination
      paginationComponentOptions={paginationComponentOptions}
      highlightOnHover
      pointerOnHover={true}
      responsive
      striped
      onRowClicked={(row) => {
        navigate(`show/${row.username}`);
      }}
    />
  );
};

export default UserList;
