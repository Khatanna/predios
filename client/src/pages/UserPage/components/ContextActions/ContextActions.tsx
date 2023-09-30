export type ContextActionsProps = {
}

const ContextActions: React.FC<ContextActionsProps> = ({ }) => {

	// const [updateStateOfManyUsers, { isLoading: isLoadingUpdateUsers }] = useCustomMutation<{ result: { count: number } }, { input: { usernames: string[], status: string } }>(UPDATE_STATE_OF_MANY_USERS, {
	// 	onSuccess({ result }) {
	// 		if (result.count) {
	// 			customSwalSuccess("Usuarios actualizados", `Se actualizo el estado de ${result.count} usuarios`)
	// 			// queryClient.invalidateQueries(['getAllUsers'])
	// 		}
	// 	},
	// 	onError(e) {
	// 		customSwalError(e, "Ocurrio un error al intentar actualizar a los usuarios")
	// 	}
	// })

	// const handleStatusMany = (status: string) => {
	// 	const usernames = rowsSelected.filter(user => user.status !== status).map(user => user.username);
	// 	// setShowContextMenu(!showContextMenu);

	// 	updateStateOfManyUsers({ input: { usernames, status } })
	// }

	return <div className="d-flex gap-2">
		{/* <Button variant="danger" size="sm">Eliminar</Button>
		<Button variant="warning" size="sm" onClick={() => handleStatusMany('DISABLE')}>Deshabilitar</Button>
		<Button variant="success" size="sm">Otorgar permisos</Button>
		<Button variant="primary" size="sm" onClick={() => handleStatusMany('ENABLE')}>Habilitar</Button> */}
	</div>
};

export default ContextActions;
