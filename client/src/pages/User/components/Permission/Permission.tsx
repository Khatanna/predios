import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Button, Col, Form, Modal } from 'react-bootstrap';
import { PlusCircle } from 'react-bootstrap-icons';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router';
import { useCustomMutation } from '../../../../hooks';
import { Level, Permission, Resource } from '../../../PermissionsLayout/types.d';
import { levels, resources } from '../../../../utilities/constants';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';
import { DataTablePermission } from '../../../PermissionsLayout/components/DataTablePermission';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';

const GET_PERMISSION_BY_USERNAME = `query ($username: String) {
	data: getUserByUsername(username: $username) {
		permissions {
			name
			level
			resource
			description
			status
		}
	}
}`

interface FormValues {
	resource: Resource
	level: Level[]
}

const CREATE_PERMISSION_FOR_USER_MUTATION = `mutation CreatePermission($input: UpdatePermissionsUserByUsernameInput) {
	result: createPermissionForUser(input: $input) {
		updated
	}
}`

const Permission: React.FC = () => {
	const queryClient = useQueryClient();
	const { state } = useLocation();
	const username: string = state.username;
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const [createPermission] = useCustomMutation<{ result: { updated: boolean } }, { input: { username: string, data: { resource: string, level: string } } }>(CREATE_PERMISSION_FOR_USER_MUTATION, {
		onSuccess({ result }) {

			if (result.updated) {
				customSwalSuccess('Permisos otorgados', 'Se otorgaron permisos al usuario' + username)
				queryClient.invalidateQueries(['getPermissionByUsername'])
			}
		},
		onError(error) {
			customSwalError(error, "Ocurrio un error al intentar otorgar permisos al usuario" + username)
		}
	})

	const { data, isLoading } = useCustomQuery<{ data: { permissions: Permission[] } }, { username: string }>(GET_PERMISSION_BY_USERNAME, ['getPermissionByUsername'], { username });
	const { register, handleSubmit, reset } = useForm<FormValues>({
		defaultValues: {
			resource: Resource.DEFAULT,
			level: []
		}
	});

	const submit = (data: FormValues) => {
		createPermission({ input: { username, data: { resource: data.resource, level: data.level[0] } } })
		reset();
	}

	if (isLoading) {
		return <div>Cargando...</div>
	}

	return <>
		<DataTablePermission permissions={data?.data.permissions ?? []} user={state} />

		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Otorgar permisos</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form className='row g-3' onSubmit={handleSubmit(submit)}>
					<Col xs="12">
						<Form.Group>
							<Form.Label>Entidad</Form.Label>
							<Form.Select placeholder='Tipo' {...register('resource')}>
								<option value="" selected disabled>Entidad</option>

								{Object.entries(resources).map(([resource, name]) => (
									<option value={resource} key={crypto.randomUUID()}>{name}</option>
								))}
							</Form.Select>
						</Form.Group>
					</Col>
					<Col xs="12">
						<Form.Group>
							<Form.Label>Tipos</Form.Label>
							{Object.entries(levels).map(([level, name]) => (
								<Form.Check
									type={'checkbox'}
									label={name}
									value={level}
									id={`disabled-default-${level}`}
									{...register('level')}
								/>
							))}
						</Form.Group>
					</Col>
					<Col>
						<Button variant="success" onClick={handleClose} className='w-100' type="submit">
							Otorgar permisos
						</Button>
					</Col>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="danger" onClick={handleClose}>
					Cerrar
				</Button>

			</Modal.Footer>
		</Modal>
		<PlusCircle className='position-fixed end-0 bottom-0 m-3' size={32} color='orange' role='button' onClick={handleShow} />
	</>
};

export default Permission;
