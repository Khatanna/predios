import React from 'react';
import { StateCell } from '../StateCell';
import { PersonCircle } from 'react-bootstrap-icons';
import { Dropdown } from 'react-bootstrap';
import { useAuth, useCustomMutation } from '../../hooks';
import { customSwalError, customSwalSuccess } from '../../utilities/alerts';
import { useQueryClient } from '@tanstack/react-query';
import { StatusConnection } from '../../utilities/constants';

const LOGOUT = `
  mutation Logout($username: String, $token: String) {
    logout(username: $username, token: $token)
  }
`

const Avatar: React.FC = () => {
	const queryClient = useQueryClient();
	const { logout, user, refreshToken } = useAuth();

	const [logoutOfBackend] = useCustomMutation<{ logout: boolean }, { username: string, token: string }>(LOGOUT, {
		onSuccess({ logout }) {
			if (logout) {
				customSwalSuccess('Mensaje de sesión', 'Se ha cerrado la sesión correctamente')
			}
		},
		onError(error) {
			customSwalError("Ocurrio un error al intentar cerrar la sesión", error);
		},
	}, { headers: { operation: 'Logout' } })

	const handleLogout = () => {
		if (user && refreshToken) {
			logoutOfBackend({ username: user.username, token: refreshToken })
			queryClient.clear();
			logout()
		}
	}

	return <>
		<div className="mx-4 align-items-center d-flex flex-column ">
			<div className="text-success fw-bold">{user?.username}</div>
			<StateCell status={user?.connection} values={StatusConnection} />
		</div>
		<Dropdown align={"end"} role="button">
			<Dropdown.Toggle
				as={PersonCircle}
				fontSize={32}
			/>
			<Dropdown.Menu>
				<Dropdown.Item
				>
					👁‍🗨 Mi cuenta
				</Dropdown.Item>
				<Dropdown.Item
				>
					⚙ Configuraciones
				</Dropdown.Item>
				<Dropdown.Item
					onClick={handleLogout}
				>
					🔐 Cerrar sesión
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	</>;
};

export default Avatar;
