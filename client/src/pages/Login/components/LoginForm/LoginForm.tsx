import { yupResolver } from '@hookform/resolvers/yup';
import eyeFill from 'bootstrap-icons/icons/eye-fill.svg';
import eyeSlashFill from 'bootstrap-icons/icons/eye-slash-fill.svg';
import { useState } from 'react';
import { Button, Col, FloatingLabel, Form, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useAuth } from '../../hooks';
import { FormValues } from '../../models/types';
import { Error } from '../../styled-components/Error';

export type LoginFormProps = {
}

const schema = yup.object({
	username: yup.string()
		.required('El nombre de usuario es un campo obligatorio'),
	password: yup.string()
		.required('La contraseña es un campo obligatorio')
		.min(8, 'La contraseña debe tener almenos 8 caracteres')
		.max(32, 'La contraseña no debe tener mas de 32 caracteres')
})

const LoginForm: React.FC<LoginFormProps> = ({ }) => {
	const { register, handleSubmit, formState: { errors }, getValues, reset } = useForm<FormValues>({
		resolver: yupResolver(schema), defaultValues: { username: '', password: '' }
	});
	const { isLoading, login } = useAuth(getValues(), reset);
	const [showPassword, setShowPassword] = useState(false);
	const [capsLock, setCapsLock] = useState(false);
	if (isLoading) {
		return <Spinner variant='primary' />
	}

	return <Col xs={11} sm={8} md={6} lg={4}>
		<h1 className='display-6 mb-3 border-bottom border-2'>Iniciar sesión</h1>
		<Form onSubmit={handleSubmit(() => login())} onKeyDown={(e) => setCapsLock(e.getModifierState('CapsLock'))}>
			<FloatingLabel
				controlId='floatingInputUsername'
				label='Nombre de usuario'
				className='mb-2 text-body-tertiary'
			>
				<Form.Control type='text' placeholder='username' {...register('username')} autoComplete='off' />
				<Error>{errors.username?.message}</Error>
			</FloatingLabel>
			<div className='input-wrapper position-relative'>
				<FloatingLabel
					controlId='floatingInputPassword'
					label='Contraseña'
					className='mb-2 text-body-tertiary'
				>
					<Form.Control type={showPassword ? 'text' : 'password'} placeholder='password' {...register('password')} autoComplete='off' />
					<img src={showPassword ? eyeSlashFill : eyeFill} alt="eyeFill" role='button' className='position-absolute top-50 end-0 translate-middle-y me-3' onClick={() => setShowPassword((s) => !s)} />
				</FloatingLabel>
				<Error className='mb-3'>{errors.password?.message}</Error>
			</div>
			{capsLock && <Error $color="#F28705">Tiene las MAYUSCULAS activadas</Error>}
			<Button variant="primary" type="submit" className='float-end'>
				Iniciar sesión
			</Button>
		</Form>
	</Col>
};

export default LoginForm;
