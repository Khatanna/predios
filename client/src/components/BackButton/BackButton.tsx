import React from 'react';
import { ArrowLeftShort } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router';

const BackButton: React.FC = () => {
	const navigate = useNavigate();
	return <div className="d-flex align-items-center text-primary" onClick={() => navigate(-1)} role="button">
		<ArrowLeftShort
			size={"28"}
			title="Volver"
		/>
		Volver
	</div>
};

export default BackButton;
