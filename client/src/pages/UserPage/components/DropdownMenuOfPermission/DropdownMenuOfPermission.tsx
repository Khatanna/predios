import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import { Permission } from '../../../PermissionPage/models/types';

export type DropdownMenuOfPermissionProps = {
	permissionOfUser: { status: string, permission: Permission }
}

const UPDATE_STATE_OF_PERMISSION_BY_USERNAME = `
	mutation UpdateStateOfPermissionUserByUsername ($input: UpdateStateOfPermissionUserByUsernameInput){
		result: updateStateOfPermissionUserByUsername(input: $input) {
			updated
		}
	}
`

// const DELETE_PERMISSION_OF_USER_BY_USERNAME = `
// 	mutation DeletePermissionOfUserByUsername ($input: DeletePermissionOfUserByUsernameInput){
// 		result: deletePermissionOfUserByUsername(input: $input) {
// 			deleted
// 		}
// 	}
// `

const DropdownMenuOfPermission: React.FC<DropdownMenuOfPermissionProps> = ({ permissionOfUser: { permission: { level, resource }, status } }) => {
	//const [deletePermissionForUser] = useCustomMutation();
	// const queryClient = useQueryClient();
	// const [updatePermissionOfUser] = useCustomMutation<{ result: { updated: boolean } }, {
	// 	input: {
	// 		username: string, data: {
	// 			status: string
	// 			resource: string
	// 			level: string
	// 		}
	// 	}
	// }
	// >(UPDATE_STATE_OF_PERMISSION_BY_USERNAME, {
	// 	onSuccess({ result }) {
	// 		if (result.updated) {
	// 			queryClient.invalidateQueries(['getPermissionByUsername'])
	// 		}
	// 	},
	// 	onError(e) {
	// 		customSwalError(e, "Ocurrio un error al intentar actualizar el estado de este permiso");
	// 	}
	// });
	// const [deletePermissionOfUser] = useCustomMutation<{ result: { deleted: boolean } }, {
	// 	input: {
	// 		username: string, data: {
	// 			resource: string,
	// 			level: string
	// 		}
	// 	}
	// }>(DELETE_PERMISSION_OF_USER_BY_USERNAME, {
	// 	onSuccess({ result }) {
	// 		if (result.deleted) {
	// 			queryClient.invalidateQueries(['getPermissionByUsername'])
	// 		}
	// 	},
	// 	onError(e) {
	// 		customSwalError(e, "Ocurrio un error al intentar eliminar el estado de este permiso");
	// 	}
	// })
	// const handleDelete = () => {
	// 	Swal.fire({
	// 		icon: 'question',
	// 		title: '¿Esta seguro de eliminar el permiso de este usuario?',
	// 		text: 'Una vez eliminado el permiso no se podra recuperar 😉',
	// 		footer: `Usuario: ${username}`,
	// 		showDenyButton: true,
	// 		confirmButtonText: 'Eliminar',
	// 		confirmButtonColor: 'green',
	// 		denyButtonText: `Cancelar`,
	// 	}).then((result) => {
	// 		// posiblemente confirmar con la contraseña de administrador
	// 		if (result.isConfirmed) {
	// 			deletePermissionOfUser({ input: { username, data: { level, resource } } })
	// 		}
	// 	})
	// }
	// const handleStatus = () => {
	// 	updatePermissionOfUser({ input: { username, data: { status: status === 'ENABLE' ? 'DISABLE' : 'ENABLE', level, resource } } })
	// }

	return <Dropdown align={"end"}>
		<Dropdown.Toggle as={ThreeDotsVertical} variant="link" role="button" />

		<Dropdown.Menu>
			<Dropdown.Item >
				{status === "ENABLE" ? "⛔ Deshabilitar" : "✔ Habilitar"}
			</Dropdown.Item>
			{/* <Dropdown.Item onClick={handleDelete}>
				🗑 Eliminar
			</Dropdown.Item> */}
		</Dropdown.Menu>
	</Dropdown>
};

export default DropdownMenuOfPermission;
