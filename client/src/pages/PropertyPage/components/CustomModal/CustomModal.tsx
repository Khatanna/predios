import React from 'react';
import { Modal, ModalProps } from 'react-bootstrap';

const CustomModal: React.FC<ModalProps &
{
	title: string;
	children: React.ReactNode;

}> = ({ title, children, ...props }) => {

	return <Modal {...props}>
		<Modal.Header closeButton>
			<Modal.Title>{title}</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			{children}
		</Modal.Body>
	</Modal>
}

export default CustomModal;
