import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from 'react-bootstrap';
import { APIGetAllUser } from '../../models/user';
import { getAllUsers } from '../../services';

export type UserListProps = {
}

const UserList: React.FC<UserListProps> = ({ }) => {
	const { isLoading, error, data } = useQuery<any, any, APIGetAllUser>(['get_users'], () => getAllUsers())

	if (isLoading) {
		return <Spinner />
	}

	if (error) {
		return <div>No hay usuarios</div>
	}
	return <div>
		Usuarios:
		{data?.allUsers.map(user => (
			<div key={crypto.randomUUID()}>{user.name}</div>
		))}
	</div>;
};

export default UserList;
