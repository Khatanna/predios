import React from 'react';
import { BoxArrowLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const BackButton: React.FC = () => {
	const navigate = useNavigate();
	const handleGoBack = () => {

		if (navigate.length > 1) {
			navigate(-1);
		} else {
			toast.info("No hay más elementos en el historial para retroceder");
		}
	};

	return <div className="fw-bold d-flex align-items-center text-danger my-1 p-1 justify-content-center gap-2 border rounded-pill border-danger shadow" onClick={handleGoBack} role="button">
		<BoxArrowLeft
			size={"20"}
			title="Regresar"
		/>
		<div>
			Regresar
		</div>
	</div>
};

export default BackButton;
