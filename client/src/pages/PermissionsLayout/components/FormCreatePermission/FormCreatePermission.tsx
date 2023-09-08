import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useCreatePermission, useUpdatePermission } from '../../hooks';
import { Level, Permission, Resource } from '../../types.d';
import { ArrowLeftCircle } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router';
import { levels, resources } from '../../../../utilities/constants';
// import { useAuthStore } from '../../../../state/useAuthStore';

interface FormCreatePermissionProps {
	permission?: Pick<Permission, 'name' | 'description' | 'resource' | 'level'>
}

interface FormFields {
	description: string;
	name: string;
	resource: Resource;
	level: Level
}

const FormCreatePermission: React.FC<FormCreatePermissionProps> = ({ permission }) => {
	const navigate = useNavigate();
	//const { user } = useAuthStore();

	// if (!user?.permissions['PERMISSIONS@CREATE']) {
	// 	return <>No tiene permisos</>
	// }

	const { register, handleSubmit } = useForm<FormFields>({
		defaultValues: {
			description: '',
			name: '',
			resource: Resource.DEFAULT,
			level: Level.DEFAULT,
			...permission,
		}
	})
	const { createPermission, isLoading } = useCreatePermission();
	const { updatePermission } = useUpdatePermission();

	const submit = (input: FormFields) => {
		if (permission) {
			updatePermission({ input })
		} else {
			createPermission({ input })
		}
	}

	if (isLoading) {
		return <div>cargando...</div>
	}

	return <Row >
		<Col xs={6}>
			<ArrowLeftCircle
				size={"24"}
				title="Volver"
				color="green"
				onClick={() => navigate(-1)}
				role="button"
				className="my-2"
			/>
			<Form className='row g-3 position-absolute start-50 top-50 translate-middle ' onSubmit={handleSubmit(submit)}>
				<Col xs="4">
					<Form.Group>
						<Form.Label>Nombre</Form.Label>
						<Form.Control type='text' placeholder='Nombre' {...register('name')} />
					</Form.Group>
				</Col>
				<Col xs="4">
					<Form.Group>
						<Form.Label>Recurso</Form.Label>
						<Form.Select placeholder='Recurso' {...register('resource')} disabled={Boolean(permission)}>
							<option value="" selected disabled>Recurso</option>

							{Object.entries(resources).map(([resource, name]) => (
								<option value={resource} key={crypto.randomUUID()}>{name}</option>
							))}
						</Form.Select>
					</Form.Group>
				</Col>
				<Col xs="4">
					<Form.Group>
						<Form.Label>Nivel de acceso</Form.Label>
						<Form.Select placeholder='Nivel de acceso' {...register('level')} disabled={Boolean(permission)}>
							<option value="" selected disabled>Nivel de acceso</option>

							{Object.entries(levels).map(([level, name]) => (
								<option value={level} key={crypto.randomUUID()}>{name}</option>
							))}
						</Form.Select>
					</Form.Group>
				</Col>
				<Form.Group>
					<Form.Label>Descripción</Form.Label>
					<Form.Control as="textarea" type='text' placeholder='descripción...' {...register('description')} rows={6} style={{ resize: 'none' }} />
				</Form.Group>
				<Form.Group>
					<Button type='submit' variant='success' className='w-100'>{permission ? 'Actualizar' : 'Crear'} permiso</Button>
				</Form.Group>
			</Form>
		</Col>
	</Row>;
};

export default FormCreatePermission;
