import { useQuery } from '@tanstack/react-query';
import React from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useAxios } from '../../../../hooks';
import { User } from '../../models/types';
import { Form } from 'react-bootstrap'

export type UsertypeProps = {
}

type UserType = {
	name: string
	users: User[]
}

const columns: TableColumn<UserType>[] = [
	{
		name: "Nro",
		selector: (_row, index) => (index || 0) + 1,
	},
	{
		name: "Tipo",
		selector: (row: UserType) => row.name,
		sortable: true,
	},
	{
		name: 'Usuarios',
		cell: (row) => <Form.Select size='sm'>
			<option value="" selected disabled>Usuarios con el tipo {row.name.toLocaleLowerCase()}</option>
			{row.users.map(user => (<option value={user.username}>{user.username}</option>))}
		</Form.Select>,
		sortable: true,
	}
]

const Usertype: React.FC<UsertypeProps> = ({ }) => {
	const axios = useAxios();
	const { isLoading, error, data } = useQuery(['fetchAllUserTypes'], {
		queryFn: () => {
			return axios.post('/', {
				query: `{
					userTypes: getAllUserTypes {
						name
						users {
							username
						}
					}
				}`
			})
		}
	})

	if (isLoading) {
		return <div>cargando...</div>
	}

	if (error) {
		return <div>{JSON.stringify(error)}</div>
	}

	return <DataTable
		columns={columns}
		data={data?.data.data.userTypes}
	/>
};

export default Usertype;
