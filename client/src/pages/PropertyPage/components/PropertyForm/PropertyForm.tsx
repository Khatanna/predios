import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Col, Container, Dropdown, DropdownButton, Form, InputGroup, Row } from 'react-bootstrap';
import { CheckLg, XLg } from 'react-bootstrap-icons';
import { Controller, ControllerProps, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { DropdownMenu } from '../../../../components/DropdownMenu';
import { Icon } from '../../../../components/Icon';
import { useCustomMutation } from '../../../../hooks';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import { customSwalError, customSwalSuccess } from '../../../../utilities/alerts';
import { Activity } from '../../../ActivityPage/models/types';
import { City } from '../../../CityPage/models/types';
import { Clasification } from '../../../ClasificationPage/models/types';
import { GroupedState } from '../../../GroupedState/models/types';
import { Province } from '../../../ProvincePage/models/types';
import { Reference } from '../../../ReferencePage/models/types';
import { ResponsibleUnit } from '../../../ResponsibleUnitPage/models/types';
import { State } from '../../../StatePage/models/types';
import { SubDirectory } from '../../../SubDirectoryPage/models/types';
import { Type } from '../../../TypePage/models/types';
import { User } from '../../../UserPage/models/types';
import { Property } from '../../models/types';
import { SelectBeneficiary } from '../SelectBeneficiary';
import { SelectUser } from '../SelectUser';
import { Beneficiary } from '../../../BeneficiaryPage/models/types';
export type PropertyFormProps = {
	property?: Property
}

const GET_QUERY = `
	query GetFields($legal: String, $technical: String) {
		cities: getAllCities {
			name
			provinces {
				name
				code
				municipalities {
					name
				}
			}
		}
		types: getAllTypes {
			name
		}
		activities: getAllActivities {
			name
		}
		clasifications: getAllClasifications {
			name
		}
		states: getAllStates {
			name
		}
		responsibleUnits: getAllResponsibleUnits {
			name
		}
		subDirectories: getAllSubDirectories {
			name
		}
		groupedStates: getAllGroupedStates {
			name
		}
		references: getAllReferences {
			name
		}
		tecnicians: getUsers(type: "tecnico", filterText: $technical) {
			names
			username
			firstLastName
			secondLastName
		}
		legal: getUsers(type: "juridico", filterText: $legal) {
			names
			username
			firstLastName
			secondLastName
		}
	}
`
const CREATE_CITY_MUTATION = `
	mutation CreateCity($name: String) {
		result: createCity(name: $name) {
			name
		}
	}
`

const UPDATE_CITY_MUTATION = `
	mutation UpdateCity($name: String, $newName: String) {
		result: updateCity(name: $name, newName: $newName) {
			name
		}
	}
`
interface ResponseAPI {
	cities: City[];
	types: Type[];
	activities: Activity[];
	states: State[];
	subDirectories: SubDirectory[];
	responsibleUnits: ResponsibleUnit[];
	clasifications: Clasification[];
	groupedStates: GroupedState[];
	references: Reference[];
	tecnicians: User[];
	legal: User[];
}

const Editable: React.FC<{ defaultValue: string, onConfirm: ({ currentValue, newValue }: { currentValue: string, newValue: string }) => void, close: () => void }> = ({ defaultValue, onConfirm, close }) => {
	const [value, setValue] = useState(defaultValue);

	return <InputGroup>
		<InputGroup.Text onClick={close} role='button'>
			<Icon label='Cancelar edición'>
				<XLg color='red' />
			</Icon>
		</InputGroup.Text>

		<Form.Control
			value={value}
			className='text-primary fw-bold'
			onChange={(e) => setValue(e.target.value)}
		/>
		<InputGroup.Text onClick={() => {
			onConfirm({ currentValue: defaultValue, newValue: value });
		}} role='button'>
			<Icon label='Realizar cambio'>
				<CheckLg color='green' />
			</Icon>
		</InputGroup.Text>
	</InputGroup>
}

const DynamicInput: React.FC<{
	children?: React.ReactNode,
	title: string,
	options: { label: string, value: string }[],
	placeholder: string,
	disabled?: boolean,
	onConfirm: ({ currentValue, newValue }: { currentValue: string, newValue: string }) => void,
	onAction: (data: { value: string }) => void
	onSelect?: (value: string) => void
} & Omit<ControllerProps<Property>, 'render'>> = ({ children, disabled = false, defaultValue, name, title, control, options, placeholder, onConfirm, onSelect, onAction }) => {
	const [showEdit, setShowEdit] = useState(false);
	const close = () => {
		setShowEdit(false)
	};

	return <Controller
		name={name}
		control={control}
		render={({ field }) => showEdit ? (<Editable
			defaultValue={field.value as string}
			onConfirm={({ currentValue, newValue }) => {
				onConfirm({ currentValue, newValue })
				close();
			}}
			close={close}
		/>) : (
			<InputGroup >
				{children}
				<Form.Select
					{...field}
					name={name}
					disabled={disabled}
					onDoubleClick={() => setShowEdit(!!field.value)}
					onChange={(e) => {
						if (onSelect) {
							onSelect(e.target.value)
						}
						field.onChange(e);
					}}
				>
					<option disabled selected={!showEdit}>{placeholder}</option>
					{options.map(({ label, value }) => (
						<option value={value} key={crypto.randomUUID()} >{label}</option>
					))}
				</Form.Select>
				{!disabled && <InputGroup.Text>
					<DropdownMenu as={DropdownButton}>
						<Dropdown.Item onClick={() => {
							Swal.fire({
								title,
								input: 'text',
								inputAttributes: {
									autocapitalize: 'off',
									autcomplete: 'off'
								},
								showCancelButton: true,
								confirmButtonText: 'Crear',
								confirmButtonColor: 'green',
								cancelButtonText: 'Cancelar',
								cancelButtonColor: 'red',
								preConfirm: (value) => {
									onAction({ value: value.trim() })
								}
							})
						}}>
							➕ Crear
						</Dropdown.Item>

						{!!field.value && <Dropdown.Item onClick={() => setShowEdit(!!field.value)}>
							✏ Editar
						</Dropdown.Item>}
					</DropdownMenu>
				</InputGroup.Text>}
			</InputGroup>
		)}
	/>
}

const PropertyForm: React.FC<PropertyFormProps> = ({ property }) => {
	const queryClient = useQueryClient();
	const { register, handleSubmit, control, setValue } = useForm<Property>({ defaultValues: property });
	const { data, error } = useCustomQuery<ResponseAPI>(GET_QUERY, ['getFieldForCreate'])
	const [city, setCity] = useState<City | undefined>(property?.city);
	const [province, setProvince] = useState<Province | undefined>(property?.province)
	const submit = (data: Property) => {
		console.log(data)
	}
	const [createCity] = useCustomMutation<{ result: City }, { name: string }>(CREATE_CITY_MUTATION, {
		onSuccess({ result: { name } }) {
			customSwalSuccess("Nuevo departamento agregado", `El departamento ${name} se ha creado correctamente`)
			queryClient.invalidateQueries(['getFieldForCreate'])
		},
		onError(error, { name }) {
			customSwalError(error, `Ocurrio un error al intentar crear el departamento ${name}`)
		},
	})

	const [updateCity] = useCustomMutation<{ result: City }, { name: string, newName: string }>(UPDATE_CITY_MUTATION, {
		onSuccess({ result: { name } }) {
			customSwalSuccess("Departamento actualizado", `El departamento ${name} se ha actualizado correctamente`)
			queryClient.invalidateQueries(['getFieldForCreate'])
		},
		onError(error, { name }) {
			customSwalError(error, `Ocurrio un error al intentar actualizar el departamento ${name}`)
		},
	})

	const options = useMemo(() => {
		const mapper = ({ name }: { name: string }) => ({
			label: name,
			value: name
		})

		return {
			cities: data?.cities.map(mapper) ?? [],
			provinces: city?.provinces.map(mapper) ?? [],
			municipalities: province?.municipalities.map(mapper) ?? [],
			activities: data?.activities.map(mapper) ?? [],
			types: data?.types.map(mapper) ?? [],
			clasification: data?.clasifications.map(mapper) ?? [],
			states: data?.states.map(mapper) ?? [],
			subDirectories: data?.subDirectories.map(mapper) ?? [],
			responsibleUnits: data?.responsibleUnits.map(mapper) ?? [],
			groupedStates: data?.groupedStates.map(mapper) ?? [],
			references: data?.references.map(mapper) ?? []
		}

	}, [data, city, province]);

	const getDefaultValues = (values: Partial<Beneficiary>[]) => {
		return values.map(b => ({
			label: b.name,
			value: b.id
		}))
	}

	if (error) {
		return <div>{error}</div>
	}

	return <Container>
		<h1>Falta el numero de expediente</h1>
		<Form onSubmit={handleSubmit(submit)}>
			<Row>
				<Col className='d-flex flex-column gap-3'>
					<Row>
						<Col>
							<Form.Group>
								<Form.Label >Nombre del predio</Form.Label>
								<Form.Control
									as='textarea'
									rows={2}
									placeholder='Nombre del predio' {...register('name')} autoComplete='off'
								/>
							</Form.Group>
						</Col>
					</Row>
					<Row>
						<Col xs={3}>
							<Form.Group>
								<Form.Label>Codigo</Form.Label>
								<Form.Control placeholder='Codigo' {...register('code')} autoComplete='off' />
							</Form.Group>
						</Col>
						<Col xs={2}>
							<Form.Group>
								<Form.Label>
									Poligono
								</Form.Label>
								<Form.Control placeholder='Poligono' {...register('polygone')} autoComplete='off' />
							</Form.Group>
						</Col>
						<Col>
							<Form.Group>
								<Form.Label>Datos</Form.Label>
								<InputGroup>
									<InputGroup.Text>
										Parcelas
									</InputGroup.Text>
									<Form.Control {...register('plots')} />
									<InputGroup.Text>
										Fojas
									</InputGroup.Text>
									<Form.Control {...register('sheets')} />
									<InputGroup.Text>
										Cuerpos
									</InputGroup.Text>
									<Form.Control {...register('bodies')} />
								</InputGroup>
							</Form.Group>
						</Col>
					</Row>
					<Row>
						<Col>
							<Form.Group>
								<Form.Label>
									Estado
								</Form.Label>
								<DynamicInput
									name='state.name'
									title='Ingrese en nombre del estado'
									placeholder='Estado'
									control={control}
									options={options.states}
									onConfirm={() => { }}
									onSelect={() => { }}
									onAction={() => { }}
								/>
							</Form.Group>
						</Col>
						<Col xs={3}>
							<Form.Group>
								<Form.Label>Codigo de busqueda</Form.Label>
								<Form.Control {...register('codeOfSearch')} placeholder='Codigo de busqueda' autoComplete='off' />
							</Form.Group>
						</Col>

						<Col>
							<Form.Group>
								<Form.Label>Unidad responsable</Form.Label>
								<DynamicInput
									name='responsibleUnit.name'
									title='Ingrese en nombre de la unidad'
									placeholder='Unidad responsable'
									control={control}
									options={options.responsibleUnits}
									onConfirm={() => { }}
									onSelect={() => { }}
									onAction={() => { }}
								/>
							</Form.Group>
						</Col>
					</Row>
					<Row>
						<Col>
							<Form.Group>
								<Form.Label>Departamento</Form.Label>
								<DynamicInput
									name='city.name'
									title='Ingrese el nombre del departamento'
									placeholder='Departamento'
									control={control}
									options={options.cities}
									onConfirm={({ currentValue, newValue }) => {
										updateCity({ name: currentValue, newName: newValue })
									}}
									onSelect={(value) => {
										const city = data?.cities.find(city => city.name === value);
										setCity(city);
									}}
									onAction={({ value }) => {
										createCity({ name: value })
									}}
								/>
							</Form.Group>
						</Col>
						<Col>
							<Form.Group>
								<Form.Label>Provincia</Form.Label>
								<DynamicInput
									name='province.name'
									title='Ingrese el nombre de provincia'
									placeholder='Provincia'
									control={control}
									options={options.provinces}
									disabled={!city && !property}
									onConfirm={() => {
										// updateCity({ name: currentValue, newName: newValue })
									}}
									onSelect={(value) => {
										const province = city?.provinces.find(province => province.name === value);
										setProvince(province);
									}}
									onAction={() => {

									}}
								>
									{province && city!.provinces.length >= 1 && <InputGroup.Text>{province.code}</InputGroup.Text>}
								</DynamicInput>
							</Form.Group>
						</Col>
						<Col>
							<Form.Group>
								<Form.Label>
									Municipio
								</Form.Label>
								<DynamicInput
									name='municipality.name'
									title='Ingrese el nombre del municipio'
									placeholder='Municipio'
									control={control}
									disabled={!province && !property}
									options={options.municipalities}
									onConfirm={() => {
										// updateCity({ name: currentValue, newName: newValue })
									}}
									onSelect={() => {
										// const province = city?.provinces.find(province => province.name === value);
										// setProvince(province);
									}}
									onAction={() => {

									}}
								/>
							</Form.Group>
						</Col>
					</Row>
					<Row>
						<Col xs={5}>
							<Form.Group>
								<Form.Label>Subcarpeta</Form.Label>
								<DynamicInput
									name='subDirectory.name'
									title='Ingrese en nombre de la Sub carpeta'
									placeholder='Subcarpeta'
									control={control}
									options={options.subDirectories}
									onConfirm={() => { }}
									onSelect={() => { }}
									onAction={() => { }}
								/>
							</Form.Group>
						</Col>
						<Col>
							<Form.Group>
								<Form.Label>Datos de superficies</Form.Label>
								<InputGroup>
									<InputGroup.Text>
										Superficie
									</InputGroup.Text>
									<Form.Control {...register('area')} />
									<InputGroup.Text>
										Pericia
									</InputGroup.Text>
									<Form.Control {...register('expertiseOfArea')} />
									<InputGroup.Text className='fw-bold'>
										[ha]
									</InputGroup.Text>
								</InputGroup>
							</Form.Group>
						</Col>
					</Row>
					<Row>
						<Col>
							<Form.Group>
								<Form.Label>Tipo de predio</Form.Label>
								<DynamicInput
									name='type.name'
									title='Ingrese el nombre del tipo de predio'
									placeholder='Tipo de predio'
									control={control}
									options={options.types}
									onConfirm={() => { }}
									onSelect={() => { }}
									onAction={() => { }}
								/>
							</Form.Group>
						</Col>
						<Col>
							<Form.Group>
								<Form.Label>Actividad</Form.Label>
								<DynamicInput
									name='activity.name'
									title='Ingre en nombre de la actividad'
									placeholder='Actividad'
									control={control}
									options={options.activities}
									onConfirm={() => { }}
									onSelect={() => { }}
									onAction={() => { }}
								/>
							</Form.Group>
						</Col>
						<Col>
							<Form.Group>
								<Form.Label>Clasificación</Form.Label>
								<DynamicInput
									name='clasification.name'
									title='Ingrese en nombre de la clasificacion'
									placeholder='Clasificacion'
									control={control}
									options={options.clasification}
									onConfirm={() => { }}
									onSelect={() => { }}
									onAction={() => { }}
								/>
							</Form.Group>
						</Col>
					</Row>
				</Col>
				<Col className='d-flex flex-column gap-3' xs={4}>
					<Row>
						<Col>
							<Form.Group>
								<Form.Label>
									Beneficiarios
								</Form.Label>
								<Controller
									name='beneficiaries'
									control={control}

									render={({ field }) => (
										<>
											< SelectBeneficiary
												{...field}
												defaultValue={getDefaultValues(field.value)}
											/>
										</>
									)}
								/>
							</Form.Group>
						</Col>
					</Row>
					<Row>
						<Col xs={5}>
							<Form.Group>
								<Form.Label>Estado 2</Form.Label>
								<Form.Control {...register('secondState')} placeholder='estado 2' autoComplete='off' />
							</Form.Group>
						</Col>
						<Col>
							<Form.Group>
								<Form.Label>Id de agrupación</Form.Label>
								<Form.Control {...register('agrupationIdentifier')} placeholder='Id de agrupación' autoComplete='off' />
							</Form.Group>
						</Col>
					</Row>
					<Row>
						<Form.Group>
							<Form.Label>Estado agrupado</Form.Label>
							<DynamicInput
								name='groupedState.name'
								title='Ingrese el nombre del estado agrupado'
								placeholder='Estado agrupado'
								control={control}
								options={options.groupedStates}
								onConfirm={() => { }}
								onSelect={() => { }}
								onAction={() => { }}
							/>
						</Form.Group>
					</Row>
					<Row>
						<Col>
							<Form.Group>
								<Form.Label>Juridico</Form.Label>
								<Controller
									name='legal'
									// defaultValue={property?.legal}
									control={control}
									render={({ field }) => (
										<SelectUser
											{...field}
											placeholder="Juridico"
											type='juridico'
										/>
									)}
								/>
							</Form.Group>
						</Col>
					</Row>
					<Row>
						<Col>
							<Form.Group>
								<Form.Label>Tecnico</Form.Label>
								<Controller
									name='technical'
									control={control}
									render={({ field }) => (
										<SelectUser
											{...field}
											placeholder="Tecnico"
											type='tecnico'
										/>
									)}
								/>
							</Form.Group>
						</Col>
					</Row>
					<Row>
						<Form.Group>
							<Form.Label>Referencia</Form.Label>
							<DynamicInput
								name='reference.name'
								title='Ingrese el nombre de la referencia'
								placeholder='Referencia'
								control={control}
								options={options.references}
								onConfirm={() => { }}
								onSelect={() => { }}
								onAction={() => { }}
							/>
						</Form.Group>
					</Row>
				</Col>
			</Row>
			<Row>
				<Col>
					<Button type='submit' className='float-end mt-3'>Crear predio</Button>
				</Col>
			</Row>
		</Form>
	</Container>;
};

export default PropertyForm;
