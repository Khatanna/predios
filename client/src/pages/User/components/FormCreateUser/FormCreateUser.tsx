import React, { useState } from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useAxios } from '../../../../hooks';
import Swal from 'sweetalert2';
import { AxiosError, AxiosResponse } from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PlusCircle, XCircle, ArrowLeftCircle, CheckCircle } from 'react-bootstrap-icons';
import type { User, UserType } from '../../models/types';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Error } from '../../../Login/styled-components/Error';
import { useNavigate } from 'react-router-dom';

//     mutationFn: async ({ username, usertype }) => {
//       return axios.post('/', {
//         query: `mutation UpdateUserByUsername($data: ForUpdateUserByUsername) {
//             updateUserByUsername(data: $data) {
//               updated
//             }
//           }          
//         `,
//         variables: {
//           data: {
//             username,
//             data: { type: { name: usertype } }
//           }
//         }
//       })

export interface FormCreateUserProps {
	user?: User
}

const schema = yup.object({
	names: yup.string().required('El nombre es un campo obligatorio'),
	username: yup.string()
		.required('El nombre de usuario es un campo obligatorio'),
	firstLastName: yup.string()
		.required('El apellido paterno del usuario es un campo obligatorio'),
	secondLastName: yup.string()
		.required('El apellido paterno del usuario es un campo obligatorio'),
	password: yup.string()
		.required('La contraseña es un campo obligatorio')
		.min(8, 'La contraseña debe tener almenos 8 caracteres')
		.max(32, 'La contraseña no debe tener mas de 32 caracteres'),
	type: yup.object({
		name: yup.string().required("El tipo es requerido")
	}).required(),
	status: yup.string().required('El usuario debe tener un estado').required()
})

const TypeOptions = ({ selected }: { selected?: string }) => {
	const axios = useAxios();
	const { data } = useQuery(['getAllTypes'], async () => {
		return axios.post('/', {
			query: `{
				userTypes: getAllUserTypes {
					name
				}
			}`
		})
	})

	return <>
		{
			data?.data.data.userTypes.map(({ name }: UserType) => (
				<option value={name} key={crypto.randomUUID()} selected={!!selected && selected.localeCompare(name) === 0}>{name}</option>
			))
		}
	</>
}

const useFetchPostUser = () => {
	const axios = useAxios();
	const { mutate } = useMutation<AxiosResponse<{ created: boolean }>, AxiosError<{ errors: { message: string }[] }>, User>({
		mutationFn: async (data) => {
			return axios.post('/', {
				query: `mutation CreateUser($data: ForCreateUser) {
					result: createUser(data: $data) {
						created
					}
				}`,
				variables: {
					data: { ...data, type: { name: data.type?.name } }
				}
			})
		},
		onSuccess() {
			Swal.fire({
				icon: 'success', title: 'Usuario creado correctamente'
			})
		},
		onError(e) {
			Swal.fire({
				icon: 'error',
				title: 'Ocurrio un error',
				text: e.response?.data.errors[0].message,
			})
		}
	})

	return {
		postUser: mutate
	}
}

const useFetchPostUserType = () => {
	const axios = useAxios();
	const { mutate } = useMutation<AxiosResponse<{ created: boolean }>, AxiosError<{ errors: { message: string }[] }>, UserType>({
		mutationFn: async (data: UserType) => {
			return axios.post('/', {
				query: `mutation CreateUserType ($data: ForCreateTypeUser){
					createUserType(data: $data) {
						created
					}
				}`,
				variables: {
					data
				}
			})
		},
		onSuccess() {
			Swal.fire({
				icon: 'success',
				title: 'Nuevo tipo agregado'
			})
		},
		onError(error) {
			Swal.fire({
				icon: 'error',
				title: 'Ocurrio un error',
				text: error.response?.data.errors[0].message,
			})
		}
	})

	return {
		postUserType: mutate,
	}
}

const FormCreateUser: React.FC<FormCreateUserProps> = ({ user }) => {
	const navigate = useNavigate();
	const [showEditUserType, setShowEditUserType] = useState(false);
	const [userType, setUserType] = useState('');
	const { postUserType } = useFetchPostUserType();
	const { postUser } = useFetchPostUser();
	const { register, setValue, getValues, handleSubmit, reset, formState: { errors } } = useForm({
		defaultValues: {
			names: '',
			firstLastName: '',
			secondLastName: '',
			username: '',
			password: '',
			status: 'habilitado',
			type: {
				name: ''
			},
			...user,
		},
		resolver: yupResolver(schema)
	});

	const handleSetCredentials = () => {
		const [secondLastName, firstLastName, ...names] = getValues('names')
			.trim()
			.toLocaleLowerCase()
			.split(/\s/)
			.map(w => w[0].toUpperCase().concat(w.slice(1)))
			.reverse()
		setValue('names', names.reverse().join(' '))
		setValue('firstLastName', firstLastName, { shouldValidate: true })
		setValue('secondLastName', secondLastName, { shouldValidate: true })
		setValue('username', names[0].concat(".", firstLastName).toLocaleLowerCase(), { shouldValidate: true })
		setValue('password', 'Inra12345', { shouldValidate: true })
	}

	const submit = (data: User) => {
		postUser(data);
		reset();
	}

	return <Row>
		<Col md={5}>
			<ArrowLeftCircle size={"24"} title='Volver' color='green' onClick={() => navigate(-1)} role='button' />
			<Form className='row g-3 position-absolute top-50 start-50 translate-middle' onSubmit={handleSubmit(submit)}>
				<Col xs={user ? 9 : 12}>
					<Form.Group>
						<Form.Label>
							Nombres
						</Form.Label>
						<div className='input-wrapper position-relative'>
							<Form.Control placeholder='Nombres' {...register('names')} onKeyDown={(e) => e.key === 'Enter' && handleSetCredentials()} autoComplete='off' />
							<CheckCircle
								role='button'
								className='position-absolute top-50 end-0 translate-middle img-fluid'
								onClick={handleSetCredentials} />
						</div>
						<Error>{errors.names?.message}</Error>
					</Form.Group>
				</Col>
				{user && <Col xs={3}>
					<Form.Group>
						<Form.Label>
							Estado
						</Form.Label>
						<Form.Select placeholder='Nombres' {...register('status')} >
							{['ENABLE', 'DISABLE'].map(s => (
								<option value={s}>{s === 'ENABLE' ? 'Habilitado' : 'Deshabilitado'}</option>
							))}
						</Form.Select>
					</Form.Group>
				</Col>}
				<Col xs={12} md={6}>
					<Form.Group>
						<Form.Label >
							Apellido paterno
						</Form.Label>
						<Form.Control placeholder='Apellido paterno' {...register('firstLastName')} autoComplete='off' />
						<Error>{errors.firstLastName?.message}</Error>
					</Form.Group>
				</Col>
				<Col xs={12} md={6}>
					<Form.Group>
						<Form.Label >
							Apellido materno
						</Form.Label>
						<Form.Control placeholder='Apellido materno'{...register('secondLastName')} autoComplete='off' />
						<Error>{errors.secondLastName?.message}</Error>
					</Form.Group>
				</Col>
				<Col xs={12} md={4}>
					<Form.Group>
						<Form.Label >
							Nombre de usuario
						</Form.Label>
						<Form.Control placeholder='Nombre de usuario' {...register('username')} autoComplete='off' />
						<Error>{errors.username?.message}</Error>
					</Form.Group>
				</Col>
				<Col xs={12} md={4}>
					<Form.Group>
						<Form.Label >
							Contraseña
						</Form.Label>
						<Form.Control placeholder='Contraseña' {...register('password')} autoComplete='off' />
						<Error>{errors.password?.message}</Error>
					</Form.Group>
				</Col>
				<Col xs={12} md={4}>
					<Form.Group>
						<Form.Label >
							Tipo
						</Form.Label>
						{showEditUserType ?
							<div className='input-wrapper position-relative'>
								<InputGroup>
									<InputGroup.Text><XCircle style={{ cursor: 'pointer' }} onClick={() => setShowEditUserType(false)} />	</InputGroup.Text>
									<Form.Control placeholder='Tipo' autoComplete='off' value={userType} onChange={(e) => setUserType(e.target.value)} className='bg-success-subtle' />
									<CheckCircle
										role='button'
										className='position-absolute top-50 end-0 translate-middle img-fluid'
										onClick={() => {
											if (userType.length !== 0) {
												postUserType({ name: userType[0].toUpperCase().concat(userType.slice(1)) })
												setUserType('')
											} else {
												const Toast = Swal.mixin({
													toast: true,
													position: "top",
													showConfirmButton: false,
													timer: 3500,
													timerProgressBar: true,
													didOpen: (toast: HTMLElement) => {
														toast.addEventListener("mouseenter", Swal.stopTimer);
														toast.addEventListener("mouseleave", Swal.resumeTimer);
													},
												});

												Toast.fire({
													icon: "warning",
													title: "No se puede crear un tipo sin nombre",
												});
											}
										}}
									/>
								</InputGroup>
							</div> : <InputGroup>
								<InputGroup.Text><PlusCircle style={{ cursor: 'pointer' }} onClick={() => setShowEditUserType(true)} /></InputGroup.Text>
								<Form.Select {...register('type.name')} autoComplete='off'>
									<option value={""} selected disabled>Tipo</option>
									<TypeOptions selected={user?.type?.name} />
								</Form.Select>
							</InputGroup>}
						<Error>{errors.type?.name?.message}</Error>
					</Form.Group>
				</Col>
				<Col xs={12}>
					<Button className='float-end btn-success' type='submit'>Crear usuario</Button>
				</Col>
			</Form>
		</Col>
	</Row>
};

export default FormCreateUser;
