import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Accordion, Alert, Button, Col, Form, Modal } from 'react-bootstrap';
import { PlusCircle } from 'react-bootstrap-icons';
import { TableColumn } from 'react-data-table-component';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router';
import { Chip } from '../../../../components/Chip';
import { Icon } from '../../../../components/Icon';
import { StateCell } from '../../../../components/StateCell';
import { Table } from '../../../../components/Table';
import { useCustomMutation } from '../../../../hooks';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';
import { StateOfStatus, levels, resources } from '../../../../utilities/constants';
import { Permission } from '../../../PermissionPage/models/types';
import { User } from '../../models/types';
import { DropdownMenuOfPermission } from '../DropdownMenuOfPermission';
const GET_PERMISSION_BY_USERNAME = `query ($username: String) {
	data: getUserByUsername(username: $username) {
		permissions {
			status
			createdAt
			permission {
				name
				level
				resource
				description
			}
			user {
				username
			}
		}
	}
}`

export type Resource = keyof typeof resources;
type Level = keyof typeof levels;

interface FormValues {
	permissions: Record<Resource, { resource: Resource, levels: Level[] }>
}

const CREATE_PERMISSION_FOR_USER_MUTATION = `mutation CreatePermission($input: UpdatePermissionsUserByUsernameInput) {
	result: createPermissionForUser(input: $input) {
		created
		permissions {
			permission {
				name
			}
		}
	}
}`
const columns: TableColumn<{ status: string, permission: Permission, createdAt: string, user: User }>[] = [
	{
		name: "Nro",
		selector: (_row, index) => (index || 0) + 1,
		width: "80px",
		sortFunction: (a, b) => Number(a.createdAt) - Number(b.createdAt),
	},
	{
		name: 'Nombre',
		selector: (row) => row.permission.name,
		wrap: true,
		reorder: true
	},
	{
		name: 'Descripción',
		selector: (row) => row.permission.description,
		wrap: true,
		reorder: true,
		grow: 2
	},
	{
		name: 'Recurso',
		cell: (row) => <Chip text={resources[row.permission.resource as Resource]} background={row.permission.resource} />,
		reorder: true,
		sortFunction: (a, b) => a.permission.resource.localeCompare(b.permission.resource),
	},
	{
		name: 'Nivel de acceso',
		cell: (row) => <Chip text={levels[row.permission.level as Level]} background={row.permission.level} outline={true} />,
		reorder: true,
		sortFunction: (a, b) => a.permission.level.localeCompare(b.permission.level)
	},
	{
		name: 'Estado',
		cell: ({ status }) => <StateCell status={status} values={StateOfStatus} />,
		reorder: true,
		sortFunction: (a, b) => a.status.localeCompare(b.status)
	},
	{
		id: 'dropdown',
		cell: (row) => <DropdownMenuOfPermission permissionOfUser={row} />,
		button: true,
		width: '30px',
		allowOverflow: true,
	},
];

const LocalResources = Object.entries(resources);
const LocalLevels = Object.entries(levels);

const Permission: React.FC = () => {
	const queryClient = useQueryClient();
	const { state } = useLocation();
	const username: string = state.username;
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [createPermission] = useCustomMutation<{ result: { created: boolean, permissions: { permission: Pick<Permission, 'name'> }[] } }, { input: { username: string, data: { resource: Resource, levels: Level[] }[] } }>(CREATE_PERMISSION_FOR_USER_MUTATION, {
		onSuccess({ result }) {
			if (result.created) {
				const ul = document.createElement('ul');
				ul.classList.add('list-unstyled')
				result.permissions.forEach(({ permission }) => {
					const li = document.createElement('li');
					li.innerText = permission.name;
					ul.appendChild(li)
				})

				customSwalSuccess(
					'Permisos otorgados',
					`Se otorgaron los siguientes permisos al usuario: ${username}`,
					ul
				)
				queryClient.invalidateQueries(['getPermissionByUsername'])
			}
		},
		onError(error) {
			customSwalError(error, `Ocurrio un error al intentar otorgar permisos al usuario (${username})`)
		}
	})
	const { data, isLoading, error } = useCustomQuery<{ data: { permissions: { status: string, createdAt: string, permission: Permission, user: User }[] } }>(GET_PERMISSION_BY_USERNAME, ['getPermissionByUsername', { username }]);

	const { register, handleSubmit, reset } = useForm<FormValues>({
		defaultValues: {
			permissions: Object.keys(resources).reduce((acc: Record<Resource, { resource: Resource, levels: Level[] }>, resource) => {
				acc[resource as Resource] = {
					resource: resource as Resource,
					levels: []
				}

				return acc;
			}, {} as Record<Resource, { resource: Resource, levels: Level[] }>)
		}
	});

	const submit = (data: FormValues) => {
		createPermission({ input: { username, data: Object.values(data.permissions) } })
		setShow(false);
		reset();
	}

	if (error) {
		return (
			<div className="my-2">
				<Alert variant="danger">{error}</Alert>
			</div>
		);
	}

	return <>
		<Table
			name={`permisos del usuario (${state.username})`}
			columns={columns}
			data={data?.data.permissions ?? []}
			progressPending={isLoading}
			actions={
				data?.data.permissions.length === (LocalResources.length * 4) ? null :
					<Icon placement='left' label='Crear nuevos permisos para el usuario'>
						<PlusCircle size={32} color='orange' role='button' onClick={handleShow} />
					</Icon>
			}
			title={`Permisos del usuario: ${state.names.concat(" ", state.firstLastName, " ", state.secondLastName)}`}
			pointerOnHover={false}
		/>

		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Crear permisos al usuario: <strong>{state.username}</strong></Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form className='row g-3 justify-content-center' onSubmit={handleSubmit(submit)}>
					<Col xs="10">
						<Form.Group>
							<Accordion >
								{LocalResources.filter(([localResource]) => {
									const levels = data?.data.permissions.reduce((acc: string[], { permission: { resource, level } }) => {
										if (localResource === resource) {
											acc.push(level)
										}

										return acc;
									}, []) ?? []

									return levels.length !== 4;
								}).map(([resource, name]) => {
									return <Accordion.Item eventKey={resource} key={crypto.randomUUID()} >
										<Accordion.Header className='d-flex align-items-center'>
											<div className='d-flex gap-2 align-items-center'>Permisos de: <Chip text={name} background={resource} /></div>
										</Accordion.Header>
										<Accordion.Body>
											{LocalLevels.filter(([level]) => {
												return !data?.data.permissions.some(p => p.permission.level === level && p.permission.resource === resource)
											}).map(([level, name]) => (
												<Form.Check
													type={'checkbox'}
													label={name}
													value={level}
													id={crypto.randomUUID()}
													{...register(`permissions.${resource as Resource}.levels`)}
												/>
											))}
										</Accordion.Body>
									</Accordion.Item>
								})}
							</Accordion>
						</Form.Group>
					</Col>
					<Col xs="10">
						<Button variant="success" className='text-white shadow float-end' type="submit">
							Crear permisos para este usuario
						</Button>
					</Col>
				</Form>
			</Modal.Body>
		</Modal>
	</>
};

export default Permission;
