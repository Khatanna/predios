import React from 'react';
import { City } from '../../../CityPage/models/types';
import { useForm } from 'react-hook-form';
import { useMutationCity } from '../../hooks/useMutationCity';
import { Button, Form } from 'react-bootstrap';
export type CityFormProps = {
	city?: Pick<City, 'name'>;
	closeForm: () => void
}

const CityForm: React.FC<CityFormProps> = ({ city, closeForm }) => {
	const { register, handleSubmit } = useForm<Pick<City, 'name'>>({
		defaultValues: city
	});
	const { createCityMutation, updateCityMutation } = useMutationCity();

	const onSubmit = (data: Pick<City, 'name'>) => {
		if (city) {
			updateCityMutation({ name: city.name, newName: data.name })
		} else {
			createCityMutation(data)
		}
		closeForm()
	}

	return <Form onSubmit={handleSubmit(onSubmit)}>
		<Form.Label>Departamento</Form.Label>
		<Form.Control {...register('name')} placeholder='Departamento' />
		<div className='d-flex flex justify-content-end gap-2 mt-3'>
			<Button variant='success text-white' type='submit'>{city ? "Actualizar" : "Crear"} departamento</Button>
			<Button variant='danger' onClick={closeForm}>Cancelar</Button>
		</div>
	</Form>
}

export default CityForm;
