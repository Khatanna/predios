import React from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';
// import { useForm } from 'react-hook-form';

export type HomeProps = {
}

const Home: React.FC<HomeProps> = ({ }) => {
	return <Form className='row g-3'>
		<FloatingLabel
			controlId='floatingInputUsername'
			label='Nombre del predio'
			className='text-body-tertiary col-4'
		>
			<Form.Control type='text' placeholder='username' autoComplete='off' />
			{/* <Error>{errors.username?.message}</Error> */}
		</FloatingLabel>
		<FloatingLabel
			controlId='floatingInputUsername'
			label='Beneficiario o beneficiarios'
			className='text-body-tertiary col-4'
		>
			<Form.Control type='text' placeholder='username' autoComplete='off' />
		</FloatingLabel>
		<FloatingLabel
			controlId='floatingInputUsername'
			label='Superficie'
			className='text-body-tertiary col-4'
		>
			<Form.Control type='text' placeholder='username' autoComplete='off' />
		</FloatingLabel>
		<FloatingLabel
			controlId='floatingInputUsername'
			label='Superficie de pericia'
			className='text-body-tertiary col-4'
		>
			<Form.Control type='text' placeholder='username' autoComplete='off' />
			{/* <Error>{errors.username?.message}</Error> */}
		</FloatingLabel>
		<FloatingLabel
			controlId='floatingInputUsername'
			label='Observación o observaciones'
			className='text-body-tertiary col-4'
		>
			<Form.Control type='text' placeholder='username' autoComplete='off' />
		</FloatingLabel>
		<FloatingLabel
			controlId='floatingInputUsername'
			label='Observacion tecnica'
			className='text-body-tertiary col-4'
		>
			<Form.Control type='text' placeholder='username' autoComplete='off' />
		</FloatingLabel>
		<FloatingLabel
			controlId='floatingInputUsername'
			label='Parcelas'
			className='text-body-tertiary col-4'
		>
			<Form.Control type='text' placeholder='username' autoComplete='off' />
			{/* <Error>{errors.username?.message}</Error> */}
		</FloatingLabel>
		<FloatingLabel
			controlId='floatingInputUsername'
			label='Cuerpos'
			className='text-body-tertiary col-4'
		>
			<Form.Control type='text' placeholder='username' autoComplete='off' />
		</FloatingLabel>
		<FloatingLabel
			controlId='floatingInputUsername'
			label='Fojas'
			className='text-body-tertiary col-4'
		>
			<Form.Control type='text' placeholder='username' autoComplete='off' />
		</FloatingLabel>
		<FloatingLabel
			controlId='floatingInputUsername'
			label='Codigo'
			className='text-body-tertiary col-4'
		>
			<Form.Control type='text' placeholder='username' autoComplete='off' />
			{/* <Error>{errors.username?.message}</Error> */}
		</FloatingLabel>
		<FloatingLabel
			controlId='floatingInputUsername'
			label='Codigo de busqueda'
			className='text-body-tertiary col-4'
		>
			<Form.Control type='text' placeholder='username' autoComplete='off' />
		</FloatingLabel>
		<FloatingLabel
			controlId='floatingInputUsername'
			label='Referencia'
			className='text-body-tertiary col-4'
		>
			<Form.Control type='text' placeholder='username' autoComplete='off' />
		</FloatingLabel>
		<FloatingLabel
			controlId='floatingInputUsername'
			label='Id de agrupación social'
			className='text-body-tertiary col-4'
		>
			<Form.Control type='text' placeholder='username' autoComplete='off' />
		</FloatingLabel>
		<FloatingLabel
			controlId='floatingInputUsername'
			label='Estado 2'
			className='text-body-tertiary col-4'
		>
			<Form.Control type='text' placeholder='username' autoComplete='off' />
		</FloatingLabel>
		<FloatingLabel
			controlId='floatingInputUsername'
			label='Poligono'
			className='text-body-tertiary col-4'
		>
			<Form.Control type='text' placeholder='username' autoComplete='off' />
		</FloatingLabel>
	</Form>;
};

export default Home;
