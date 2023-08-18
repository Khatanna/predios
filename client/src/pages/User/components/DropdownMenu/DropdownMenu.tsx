import React from 'react';
import { User } from '../../models/types';
import Swal from 'sweetalert2';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import { useUsersStore } from '../../state/useUsersStore';
import { useMutation } from '@tanstack/react-query';
import { useAxios } from '../../../../hooks';
import { AxiosError } from 'axios';
import { GraphQLErrorResponse, GraphQLResponse } from '../../../Login/models/types';

export type DropdownMenuProps = {
	user: User
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ user }) => {
	const { deleteUser } = useUsersStore();
	const axios = useAxios();
	const { mutate: deleteUserByUsername } = useMutation<GraphQLResponse<{ deleted: boolean, user: User }>, AxiosError<GraphQLErrorResponse>, { username: string }>({
		mutationFn: async ({ username }) => {
			const { data } = await axios.post<{ data: GraphQLResponse<{ deleted: boolean, user: User }> }>('/', {
				query: `
					mutation DeleteUserByUsername ($username: String){
						data: deleteUserByUsername(username: $username) {
							deleted
						}
					}	
				`,
				variables: {
					username
				}
			});
			return data.data
		},
		onSuccess({ data }, { username }) {
			if (data.deleted) {
				deleteUser(username);
			}
			Swal.fire({
				title: "Inhabilitado!",
				text: `El usuario: (${user.username}) ha sido inhabilitado.`,
				icon: "success",
				confirmButtonText: "Continuar",
			});
		},
		onError(error) {
			Swal.fire({
				title: "Error al inhabilitar",
				text: error.response?.data.errors[0].message,// `El usuario: (${user.username}) no ha sido inhabilitado.`,
				icon: "error",
				confirmButtonText: "Continuar",
			});
		}
	})
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
			confirmButtonText: "Confirmar",
			cancelButtonText: "Cancelar",
			reverseButtons: true,
		});

		if (result.isConfirmed) {
			deleteUserByUsername({ username: user.username });
		}
	};

	return (
		<Dropdown align={"end"}>
			<Dropdown.Toggle as={ThreeDotsVertical} variant="link" cursor={'pointer'} />

			<Dropdown.Menu>
				<Dropdown.Item
					eventKey="1"
					to={`../edit/${user.username}`}
					state={user}
					as={Link}
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

export default DropdownMenu;

