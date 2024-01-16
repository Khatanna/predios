import { Dropdown } from "react-bootstrap";
import { DropdownMenu as Menu } from "../../../../components/DropdownMenu";
import { gql, useMutation } from "@apollo/client";
import { Property } from "../../models/types";
import { toast } from "sonner";
import { GET_ALL_PROPERTIES_QUERY } from "../PropertyList/PropertyList";
import { useAuthStore } from "../../../../state/useAuthStore";
import Swal from "sweetalert2";
export type DropdownMenuProps = {
	property: Property
}

const DELETE_PROPERTY_MUTATION = gql`
	mutation DeleteProperty($id: String) {
		property: deleteProperty(id: $id) {
			name
		}
	}
`

const DropdownMenu: React.FC<DropdownMenuProps> = ({ property }) => {
	const [deleteProperty] = useMutation<{ property: Property }, { id: string }>(DELETE_PROPERTY_MUTATION, {
		refetchQueries: [GET_ALL_PROPERTIES_QUERY]
	})
	const handleDelete = () => {
		Swal.fire({
			title: "¿Esta seguro 🧐?",
			html: `<div>
			¿Quiere eliminar este predio?
			</div>
			<div><b>${property.name}</b></div>`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, eliminar",
			cancelButtonText: 'Cancelar'
		}).then((result) => {
			if (result.isConfirmed) {
				toast.promise(
					deleteProperty(
						{
							variables: {
								id: property.id
							}
						}),
					{
						loading: 'Eliminando predio',
						success: 'Predio eliminado',
						error: 'Ocurrio un error intente mas tarde'
					}
				)
			}
		});
	}

	return (
		<Menu>
			<Dropdown.Item onClick={handleDelete}>🗑 Eliminar</Dropdown.Item>
		</Menu>
	);
};

export default DropdownMenu;
