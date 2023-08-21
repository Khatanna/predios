import React from "react";
import { Dropdown } from "react-bootstrap";
import { ThreeDotsVertical } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { User } from "../../models/types";

export type DropdownMenuProps = {
  user: User;
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({ user }) => {
  // const { deleteUser } = useUsersStore();
  // const axios = useAxios();
  // const { mutate: deleteUserByUsername } = useMutation<
  //   GraphQLResponse<{ deleted: boolean; user: User }>,
  //   AxiosError<GraphQLErrorResponse>,
  //   { username: string }
  // >({
  //   mutationFn: async ({ username }) => {
  //     const { data } = await axios.post<{
  //       data: GraphQLResponse<{ deleted: boolean; user: User }>;
  //     }>("/", {
  //       query: `
  // 				mutation DeleteUserByUsername ($username: String){
  // 					data: deleteUserByUsername(username: $username) {
  // 						deleted
  // 					}
  // 				}
  // 			`,
  //       variables: {
  //         username,
  //       },
  //     });
  //     return data.data;
  //   },
  //   onSuccess({ data }, { username }) {
  //     if (data.deleted) {
  //       deleteUser(username);
  //     }
  //     Swal.fire({
  //       title: "Inhabilitado!",
  //       text: `El usuario: (${user.username}) ha sido inhabilitado.`,
  //       icon: "success",
  //       confirmButtonText: "Continuar",
  //     });
  //   },
  //   onError(error) {
  //     Swal.fire({
  //       title: "Error al inhabilitar",
  //       text: error.response?.data.errors[0].message,
  //       icon: "error",
  //       confirmButtonText: "Continuar",
  //     });
  //   },
  // });

  return (
    <Dropdown align={"end"}>
      <Dropdown.Toggle as={ThreeDotsVertical} variant="link" role="button" />

      <Dropdown.Menu>
        <Dropdown.Item to={`../edit/${user.username}`} state={user} as={Link}>
          ✏ Editar
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropdownMenu;
