import React, { useState } from 'react';
import { Button, Col, Form, FormControlProps, Row } from 'react-bootstrap';
import { useForm, UseFormRegister } from 'react-hook-form';
import pencil from 'bootstrap-icons/icons/pencil.svg'
import pencilFill from 'bootstrap-icons/icons/pencil-fill.svg'
import pencilSquare from 'bootstrap-icons/icons/pencil-square.svg';
import check from 'bootstrap-icons/icons/check-circle.svg';

export type HomeProps = {
}

type FormProps = {
	[index: string]: string
}

const CustomInput = ({ placeholder, register, name, ...rest }: FormControlProps & { register: UseFormRegister<FormProps>; name: string }) => {
	const [edit, setEdit] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [labelValue, setLabelValue] = useState(placeholder)
	const [showInputEdit, setShowInputEdit] = useState(false);
	const [showMenu, setShowMenu] = useState(false);
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log(e)
		setLabelValue(e.target.value)
	}

	return <Form.Group>
		<div className={`input-wrapper position-relative ${showInputEdit ? 'show' : 'd-none'}`}  >
			<Form.Control value={labelValue} onChange={handleChange} size='sm' className='my-1' />
			<img
				src={check}
				role='button'
				alt='check'
				className='position-absolute top-50 end-0 translate-middle'
				onClick={() => setShowInputEdit(false)}
			/>
		</div>
		<Form.Label onMouseOver={() => {
			setShowEdit(true)
		}}

			onMouseOut={() => {
				setShowEdit(false);
			}} className={!showInputEdit ? 'show' : 'd-none'} >
			{labelValue} {showEdit && <img src={pencilSquare} onClick={() => setShowInputEdit(!showInputEdit)} />}
		</Form.Label>
		<div className='input-wrapper position-relative'>
			<Form.Control
				aria-label={labelValue}
				placeholder={labelValue}
				disabled={!edit}
				size='sm'
				{...register(name)}
				{...rest}
				onContextMenu={(e) => {
					e.preventDefault()
					console.log("click derecho")
					setShowMenu(true)
				}}

			// onBlur={() => setEdit(false)}
			/>
			<img
				src={edit ? pencil : pencilFill}
				role='button'
				alt='name'
				className='position-absolute top-50 end-0 translate-middle'
				onClick={() => setEdit(!edit)}
			/>
			<div
				className={`position-absolute z-1 top-50 end-0 translate-middle-x ${showMenu ? 'show' : 'd-none'}`}
				onMouseLeave={() => setShowMenu(false)}
			>
				<ul className='list-unstyled bg-body-tertiary border rounded-1' >
					<li style={{ cursor: 'pointer' }} className='mx-2'>
						<small>
							Editar campo
						</small>
					</li>
					<li style={{ cursor: 'pointer' }} className='mx-2'>
						<small>
							Editar nombre
						</small>
					</li>
				</ul>
			</div>
		</div>
	</Form.Group>
}


const Home: React.FC<HomeProps> = ({ }) => {
	const [edit, setEdit] = useState(true);
	const { register } = useForm<FormProps>({
		defaultValues: {
			name: '',
			code: '',
			beneficiary: '',
			city: '',
			province: '',
			municipality: '',
			plots: '',
			state: '',
			area: '',
			expertiseOfArea: '',
			type: '',
			subDirectory: '',
			activity: '',
			clasification: '',
			bodies: '',
			sheets: '',
			codeOfSearch: '',
			responsibleUnit: '',
			observation: '',
			secondState: '',
			agrupacionIdentifier: '',
			groupedState: '',
			legal: '',
			technical: '',
			reference: '',
			technicalObservation: '',
			polygone: ''
		}
	});

	// useEffect(() => {
	// 	const form = localStorage.getItem('form');

	// 	if (form) {
	// 		console.log("hay valores por recuperar")
	// 		const parse = JSON.parse(form);
	// 		Object.keys(parse).forEach(fieldName => {
	// 			setValue(fieldName, parse[fieldName])
	// 		})
	// 	}
	// }, [setValue])

	// useEffect(() => {
	// 	localStorage.setItem('form', JSON.stringify(formData));
	// }, [formData])
	//   

	return <Form className='row d-flex mt-1'>
		<Col xs={9}>
			<Row>
				<Col xs={6}>
					<CustomInput
						placeholder='Nombre de predio'
						register={register}
						name={"name"}
					/>
				</Col>
				<Col xs={3}>
					<CustomInput
						placeholder='Proyecto'
						register={register}
						name={"undefined"}
					/>
				</Col>
				<Col xs={3}>
					<CustomInput
						placeholder='Poligono'
						register={register}
						name={"polygone"}
					/>
				</Col>
				<Col xs={4}>
					<CustomInput
						placeholder='Codigo de predio'
						register={register}
						name={"code"}
					/>
				</Col>
				<Col xs={8}>
					<Form.Group>
						<Form.Label>
							Beneficiarios
						</Form.Label>
						<Form.Select
							aria-label='Beneficiarios'
							disabled={edit}
							size='sm'
							{...register('beneficiary')}
						>
							<option value={""} selected disabled>Beneficiarios</option>
						</Form.Select>
					</Form.Group>
				</Col>
				<Col xs={4}>
					<Form.Group>
						<Form.Label>
							Departamento
						</Form.Label>
						<Form.Select
							aria-label='Departamento'
							size='sm'
							disabled={edit}
							{...register('city')}
						>
							<option value={""} selected disabled>Departamento</option>
						</Form.Select>
					</Form.Group>
				</Col>
				<Col xs={4}>
					<Form.Group>
						<Form.Label>
							Provincia
						</Form.Label>
						<Form.Select
							aria-label='Provincia'
							disabled={edit}
							size='sm'
							{...register('province')}
						>
							<option value={""} selected disabled className='text-secondary' >Provincia</option>
						</Form.Select>
					</Form.Group>
				</Col>
				<Col xs={4}>
					<Form.Group>
						<Form.Label>
							Municipio
						</Form.Label>
						<Form.Select
							aria-label='Municipio'
							size='sm'
							disabled={edit}
							{...register('municipality')}
						>
							<option value={""} selected disabled>Municipio</option>
						</Form.Select>
					</Form.Group>
				</Col>
				<Col xs={2}>
					<Form.Group>
						<Form.Label>
							Parcelas
						</Form.Label>
						<Form.Control
							type='text'
							placeholder='Parcelas'
							aria-label='Municipio'
							disabled={edit}
							size='sm'
							{...register('plots')}
							pattern='[0-9]'
						/>
					</Form.Group>
				</Col>
				<Col xs={4}>
					<Form.Group>
						<Form.Label>
							Estado
						</Form.Label>
						<Form.Select
							aria-label='Estado'
							size='sm'
							disabled={edit}
							{...register('state')}
						>
							<option value={""} selected disabled>Estado</option>
						</Form.Select>
					</Form.Group>
				</Col>
				<Col xs={3}>
					<Form.Group>
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
							disabled={edit}
							{...register('area')}
							pattern='[0-9]'
						/>
					</Form.Group>
				</Col>
				<Col xs={3}>
					<Form.Group>
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
							disabled={edit}
							{...register('expertiseOfArea')}
							pattern='[0-9]'
						/>
					</Form.Group>
				</Col>
				<Col xs={3}>
					<Form.Group>
						<Form.Label>
							Tipo de predio
						</Form.Label>
						<Form.Select
							aria-label='Tipo de predio'
							size='sm'
							disabled={edit}
							{...register('type')}
						>
							<option value={""} selected disabled>Tipo de predio</option>
						</Form.Select>
					</Form.Group>
				</Col>
				<Col xs={3}>
					<Form.Group>
						<Form.Label>
							Subcarpeta
						</Form.Label>
						<Form.Select
							aria-label='Subcarpeta'
							size='sm'
							disabled={edit}
							{...register('subDirectory')}
						>
							<option value={""} selected disabled>Subcarpeta</option>
						</Form.Select>
					</Form.Group>
				</Col>
				<Col xs={3}>
					<Form.Group>
						<Form.Label>
							Actividad
						</Form.Label>
						<Form.Select
							aria-label='Actividad'
							size='sm'
							disabled={edit}
							{...register('activity')}
						>
							<option value={""} selected disabled>Actividad</option>
						</Form.Select>
					</Form.Group>
				</Col>
				<Col xs={3}>
					<Form.Group>
						<Form.Label>
							Clasificación
						</Form.Label>
						<Form.Select
							aria-label='Clasificación'
							size='sm'
							disabled={edit}
							{...register('clasification')}
						>
							<option value={""} selected disabled>Clasificación</option>
						</Form.Select>
					</Form.Group>
				</Col>
				<Col xs={2}>
					<Form.Group>
						<Form.Label>
							Cuerpos
						</Form.Label>
						<Form.Control
							type='text'
							placeholder='Cuerpos'
							aria-label='Cuerpos'
							size='sm'
							disabled={edit}
							{...register('bodies')}
							pattern='[0-9]'
						/>
					</Form.Group>
				</Col>
				<Col xs={2}>
					<Form.Group>
						<Form.Label>
							Fojas
						</Form.Label>
						<Form.Control
							type='text'
							placeholder='Fojas'
							aria-label='Fojas'
							size='sm'
							disabled={edit}
							{...register('sheets')}
							pattern='[0-9]'
						/>
					</Form.Group>
				</Col>
				<Col xs={4}>
					<Form.Group>
						<Form.Label>
							Codigo de busqueda
						</Form.Label>
						<Form.Control
							type='text'
							placeholder='Codigo de busqueda'
							aria-label='Codigo de busqueda'
							size='sm'
							disabled={edit}
							{...register('codeOfSearch')}
							pattern='[0-9]'
						/>
					</Form.Group>
				</Col>
				<Col xs={4}>
					<Form.Group>
						<Form.Label>
							Unidad responsable
						</Form.Label>
						<Form.Select
							aria-label='Unidad responsable'
							size='sm'
							disabled={edit}
							{...register('responsibleUnit')}
						>
							<option value={""} selected disabled>Unidad responsable</option>
						</Form.Select>
					</Form.Group>
				</Col>
				<Col xs={12}>
					<Form.Group>
						<Form.Label>
							Observación
						</Form.Label>
						<Form.Control
							as="textarea"
							rows={5}
							aria-label='Observacion'
							placeholder='Observacion'
							size='sm'
							disabled={edit}
							{...register('observation')}
							style={{ resize: 'none' }}>
						</Form.Control>
					</Form.Group>
				</Col>
			</Row>
			<Row className='mt-2'>
				<Col xs={12}>
					<div className='float-end d-flex gap-2'>
						<Button size='sm' onClick={() => setEdit(!edit)}>Editar</Button>
						<Button size='sm'>Anterior</Button>
						<Button size='sm'>Siguiente</Button>
					</div>
				</Col>
			</Row>
		</Col>

		<Col xs={3} className='border-start border-success'>
			<Row>
				<Col xs={12}>
					<Form.Group>
						<Form.Label>
							Estado 2
						</Form.Label>
						<Form.Control
							placeholder='Estado 2'
							aria-label='Estado 2'
							size='sm'
							disabled={edit}
							{...register('secondState')}
						/>
					</Form.Group>
				</Col>
				<Col xs={12}>
					<Form.Group>
						<Form.Label>
							Id Agrupación
						</Form.Label>
						<Form.Control
							placeholder='Id de agrupación'
							aria-label='Id de agrupación'
							{...register('agrupacionIdentifier')}
							size='sm'
							disabled={edit}
						/>
					</Form.Group>
				</Col>
				<Col xs={12}>
					<Form.Group>
						<Form.Label>
							Estado agrupado
						</Form.Label>
						<Form.Select
							aria-label='Estado agrupado'
							size='sm'
							disabled={edit}
							{...register('groupedState')}
						>
							<option value={""} selected disabled>Estado agrupado</option>
						</Form.Select>
					</Form.Group>
				</Col>
				<Col xs={12}>
					<Form.Group>
						<Form.Label>
							Juridico
						</Form.Label>
						<Form.Select
							aria-label='Juridico'
							size='sm'
							disabled={edit}
							{...register('legal')}
						>
							<option value={""} selected disabled>Juridico</option>
						</Form.Select>
					</Form.Group>
				</Col>
				<Col xs={12}>
					<Form.Group>
						<Form.Label>
							Tecnico
						</Form.Label>
						<Form.Select
							aria-label='Tecnico'
							size='sm'
							disabled={edit}
							{...register('technical')}
						>
							<option value={""} selected disabled>Tecnico</option>
						</Form.Select>
					</Form.Group>
				</Col>
				<Col xs={12}>
					<Form.Group>
						<Form.Label>
							Referencia
						</Form.Label>
						<Form.Select
							aria-label='Referencia'
							size='sm'
							disabled={edit}
							{...register('reference')}
						>
							<option value={""} selected disabled>Referencia</option>
						</Form.Select>
					</Form.Group>
				</Col>
				<Col xs={12}>
					<Form.Group>
						<Form.Label>
							Observación Técnica
						</Form.Label>
						<Form.Control
							as="textarea"
							rows={5}
							aria-label='Observación técnica'
							placeholder='Observación técnica'
							size='sm'
							disabled={edit}
							{...register('technicalObservation')}
							style={{ resize: 'none' }}>
						</Form.Control>
					</Form.Group>
				</Col>
			</Row>
		</Col>
	</Form>;
};

export default Home;
