import React from 'react';
import { Col, Form, InputGroup, ListGroup, Row } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import { Controller, useForm } from 'react-hook-form';
import { useCustomMutation } from '../../hooks';
import { Property } from '../PropertyPage/models/types';

export type HomeProps = {
}

const GET_PROPERTY_WITH_CURSOR = `
	query($nextCursor: String) {
		result: getProperty(nextCursor: $nextCursor) {
			nextCursor
			property {
				name
				code
				codeOfSearch
				plots
				bodies
				sheets
				area
				polygone
				expertiseOfArea
				secondState
				agrupationIdentifier
				groupedState {
					name
				}
				beneficiaries {
					id
					name
				}
				city {
					name
				}
				province {
					name
					code
				}
				municipality {
					name
				}
				type {
					name
				}
				activity {
					name
				}
				clasification {
					name
				}
				observations {
					id
					observation
					type
				}
				reference {
					name
				}
				responsibleUnit {
					name
				}
				subDirectory {
					name
				}
				state {
					name
				}
			}
		}
	}
`

const HomePage: React.FC<HomeProps> = ({ }) => {
	const [_, { mutateAsync, data }] = useCustomMutation<{ result: { property: Property, nextCursor: string } }, { nextCursor?: string }>(GET_PROPERTY_WITH_CURSOR)
	const { getValues, register, control } = useForm<Property>({
		defaultValues: async () => {
			const result = await mutateAsync({ nextCursor: undefined })
			console.log(result.data.result.property)

			return result.data.result.property
		}
	})

	return <Form className='row'>
		<Col xs={3}>
			<Row>
				<Col xs={12}>
					<Form.Label>
						Beneficiarios
					</Form.Label>
					<ListGroup numbered className='mt-2'>
						{data?.data.result.property.beneficiaries.map(beneficiary => (
							<ListGroup.Item className='d-flex align-items-center gap-1'>
								<div className='me-auto'>{beneficiary.name}</div>
								<ThreeDotsVertical role='button' />
							</ListGroup.Item>
						))}
					</ListGroup>
				</Col>
			</Row>
		</Col>
		<Col xs={6} className='border-start border-dark'>
			<Row>
				<Col xs={4}>
					<Form.Label>
						Nombre del predio
					</Form.Label>
					<Form.Control {...register('name')} size='sm' />
				</Col>
				<Col xs={2}>
					<Form.Label>
						Poligono
					</Form.Label>
					<Form.Control {...register('polygone')} placeholder='Poligono' size='sm' />
				</Col>
				<Col xs={2}>
					<Form.Label>
						Codigo
					</Form.Label>
					<Form.Control {...register('code')} size='sm' />
				</Col>
				<Col xs={2}>
					<Form.Label>
						Departamento
					</Form.Label>
					<Form.Control
						aria-label='Departamento'
						size='sm'
						{...register('city.name')}
					/>
				</Col>
				<Col xs={3}>
					<Form.Label>
						Provincia
					</Form.Label>
					<InputGroup className="mb-3" size="sm">
						<InputGroup.Text id="basic-addon1" >
							{getValues('province.code')}
						</InputGroup.Text>
						<Form.Control
							aria-label='Provincia'
							size='sm'
							aria-describedby="basic-addon1"
							{...register('province.name')}
						/>
					</InputGroup>
				</Col>
				<Col xs={2}>
					<Form.Label>
						Municipio
					</Form.Label>
					<Form.Control
						aria-label='Municipio'
						size='sm'
						{...register('municipality.name')}
					/>
				</Col>
				<Col xs={2}>
					<Form.Label>
						Parcelas
					</Form.Label>
					<Form.Control
						type='text'
						placeholder='Parcelas'
						aria-label='Municipio'
						size='sm'
						{...register('plots')}
					/>
				</Col>
				<Col xs={4}>
					<Form.Label>
						Estado
					</Form.Label>
					<Form.Control
						aria-label='Estado'
						size='sm'
						{...register('state.name')}
					/>
				</Col>
				<Col xs={2}>
					<Form.Label>
						<small>
							Superficie (ha)
						</small>
					</Form.Label>
					<Form.Control
						type='text'
						placeholder='Superficie (ha)'
						aria-label='Superficie'
						size='sm'
						{...register('area')}
					/>
				</Col>
				<Col xs={3}>
					<Form.Label>
						<small>
							Superficie pericias (ha)
						</small>
					</Form.Label>
					<Form.Control
						type='text'
						placeholder='Superficie pericias (ha)'
						aria-label='Superficie pericias'
						size='sm'
						{...register('expertiseOfArea')}
					/>
				</Col>
				<Col xs={3}>
					<Form.Label>
						Tipo de predio
					</Form.Label>
					<Form.Control
						aria-label='Tipo de predio'
						size='sm'
						{...register('type.name')}
					/>
				</Col>
				<Col xs={3}>
					<Form.Label>
						Subcarpeta
					</Form.Label>
					<Form.Control
						aria-label='Subcarpeta'
						size='sm'
						{...register('subDirectory.name')}
					/>
				</Col>
				<Col xs={3}>
					<Form.Label>
						Actividad
					</Form.Label>
					<Form.Control
						aria-label='Actividad'
						size='sm'
						{...register('activity.name')}
					/>
				</Col>
				<Col xs={3}>
					<Form.Label>
						Clasificación
					</Form.Label>
					<Form.Control
						aria-label='Clasificación'
						size='sm'
						{...register('clasification.name')}
					/>
				</Col>
				<Col xs={2}>
					<Form.Label>
						Cuerpos
					</Form.Label>
					<Form.Control
						type='text'
						placeholder='Cuerpos'
						aria-label='Cuerpos'
						size='sm'
						{...register('bodies')}
					/>
				</Col>
				<Col xs={2}>
					<Form.Label>
						Fojas
					</Form.Label>
					<Form.Control
						type='text'
						placeholder='Fojas'
						aria-label='Fojas'
						size='sm'
						{...register('sheets')}
					/>
				</Col>
				<Col xs={4}>
					<Form.Label>
						Codigo de busqueda
					</Form.Label>
					<Form.Control
						type='text'
						placeholder='Codigo de busqueda'
						aria-label='Codigo de busqueda'
						size='sm'
						{...register('codeOfSearch')}
					/>
				</Col>
				<Col xs={4}>
					<Form.Label>
						Unidad responsable
					</Form.Label>
					<Form.Control
						aria-label='Unidad responsable'
						size='sm'
						{...register('responsibleUnit.name')}
					/>
				</Col>
				<Col xs={12}>
					<Form.Label>
						Observación
					</Form.Label>

					<Controller
						name='observations'
						control={control}
						defaultValue={[]}
						render={({ field }) => (
							<div>
								{field.value.filter(o => o.type === 'STANDARD').map(({ id, observation }) => (
									<>
										<Form.Control
											as='textarea'
											rows={5}
											key={id}
											aria-label='Observacion'
											placeholder='Observacion'
											size='sm'
											value={observation}
											onChange={(e) => {
												field.onChange(
													field.value.map((item) =>
														item.id === id ? { ...item, observation: e.target.value } : item
													)
												);
											}}
										>
										</Form.Control>
									</>
								))}
							</div>
						)}
					></Controller>
				</Col>
			</Row>
		</Col>
		<Col xs={3} className='border-start border-dark'>
			<Row>
				<Col xs={12}>
					<Form.Label>
						Estado 2
					</Form.Label>
					<Form.Control
						placeholder='Estado 2'
						aria-label='Estado 2'
						size='sm'
						{...register('secondState')}
					/>
				</Col>
				<Col xs={12}>
					<Form.Label>
						Id Agrupación
					</Form.Label>
					<Form.Control
						placeholder='Id de agrupación'
						aria-label='Id de agrupación'
						size='sm'
						{...register('agrupationIdentifier')}
					/>
				</Col>
				<Col xs={12}>
					<Form.Label>
						Estado agrupado
					</Form.Label>
					<Form.Control
						aria-label='Estado agrupado'
						size='sm'
						{...register('groupedState.name')}
					/>
				</Col>
				<Col xs={12}>
					<Form.Label>
						Juridico
					</Form.Label>
					<Form.Select
						aria-label='Juridico'
						size='sm'
					>
						<option value={""} selected disabled>Juridico</option>
					</Form.Select>
				</Col>
				<Col xs={12}>
					<Form.Label>
						Tecnico
					</Form.Label>
					<Controller
						name='users'
						control={control}
						defaultValue={[]}
						render={({ field }) => (
							<div>
								{field.value.length !== 0 ? field.value.filter(o => o.type.name === 'Tecnico').map(({ id, names }) => (
									<Form.Control
										key={id}
										aria-label='technical'
										placeholder='Tecnico'
										size='sm'
										value={names}
										onChange={(e) => {
											field.onChange(
												field.value.map((item) =>
													item.id === id ? { ...item, observation: e.target.value } : item
												)
											);
										}}
									>
									</Form.Control>
								)) : <Form.Control
									aria-label='technical'
									placeholder='Tecnico'
									size='sm'
								>
								</Form.Control>}
							</div>
						)}
					></Controller>

				</Col>
				<Col xs={12}>
					<Form.Label>
						Referencia
					</Form.Label>
					<Form.Control
						aria-label='Referencia'
						size='sm'
						{...register('reference.name')}
					/>
				</Col>
				<Col xs={12}>
					<Form.Label>
						Observación Técnica
					</Form.Label>

					<Controller
						name='observations'
						control={control}
						defaultValue={[]}
						render={({ field }) => (
							<div>
								{field.value.filter(o => o.type === 'TECHNICAL').map(({ id, observation }) => (
									<>
										<Form.Control
											as='textarea'
											rows={5}
											key={id}
											aria-label='Observacion'
											placeholder='Observacion'
											size='sm'
											value={observation}
											onChange={(e) => {
												field.onChange(
													field.value.map((item) =>
														item.id === id ? { ...item, observation: e.target.value } : item
													)
												);
											}}
										>
										</Form.Control>
									</>
								))}
							</div>
						)}
					></Controller>
				</Col>
			</Row>
		</Col>
	</Form>;
};

export default HomePage;

// const CustomInput = ({ placeholder, register, name, ...rest }: FormControlProps & { register: UseFormRegister<FormProps>; name: string }) => {
// 	const [edit, setEdit] = useState(false);
// 	const [showEdit, setShowEdit] = useState(false);
// 	const [labelValue, setLabelValue] = useState(placeholder)
// 	const [showInputEdit, setShowInputEdit] = useState(false);
// 	const [showMenu, setShowMenu] = useState(false);
// 	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		console.log(e)
// 		setLabelValue(e.target.value)
// 	}
// 	return <Form.Group>
// 		<div className={`input-wrapper position-relative ${showInputEdit ? 'show' : 'd-none'}`}  >
// 			<Form.Control value={labelValue} onChange={handleChange} size='sm' className='my-1' />
// 			{/* <img
// 				src={check}
// 				role='button'
// 				alt='check'
// 				className='position-absolute top-50 end-0 translate-middle'
// 				onClick={() => setShowInputEdit(false)}
// 			/> */}
// 		</div>
// 		<Form.Label onMouseOver={() => {
// 			setShowEdit(true)
// 		}}

// 			onMouseOut={() => {
// 				setShowEdit(false);
// 			}} className={!showInputEdit ? 'show' : 'd-none'} >
// 			{/* {labelValue} {showEdit && <img src={pencilSquare} onClick={() => setShowInputEdit(!showInputEdit)} />} */}
// 		</Form.Label>
// 		<div className='input-wrapper position-relative'>
// 			<Form.Control
// 				aria-label={labelValue}
// 				placeholder={labelValue}
// 				disabled={!edit}
// 				size='sm'
// 				{...register(name)}
// 				{...rest}
// 				onContextMenu={(e) => {
// 					e.preventDefault()
// 					console.log("click derecho")
// 					setShowMenu(true)
// 				}}

// 			// onBlur={() => setEdit(false)}
// 			/>
// 			<img
// 				// src={edit ? pencil : pencilFill}
// 				role='button'
// 				alt='name'
// 				className='position-absolute top-50 end-0 translate-middle'
// 				onClick={() => setEdit(!edit)}
// 			/>
// 			<div
// 				className={`position-absolute z-1 top-50 end-0 translate-middle-x ${showMenu ? 'show' : 'd-none'}`}
// 				onMouseLeave={() => setShowMenu(false)}
// 			>
// 				<ul className='list-unstyled bg-body-tertiary border rounded-1' >
// 					<li style={{ cursor: 'pointer' }} className='mx-2'>
// 						<small>
// 							Editar campo
// 						</small>
// 					</li>
// 					<li style={{ cursor: 'pointer' }} className='mx-2'>
// 						<small>
// 							Editar nombre
// 						</small>
// 					</li>
// 				</ul>
// 			</div>
// 		</div>
// 	</Form.Group>
// }
