import React from 'react';
import { useModalStore } from '../../state/useModalStore';
import { CustomModal } from '../CustomModal';
import { CityForm } from '../CityForm';
import { useFormContext } from 'react-hook-form';

const MainModal: React.FC = () => {
	const { showCityCreateModal, showCityUpdateModal, setShowCityCreateModal, setShowCityUpdateModal } = useModalStore();
	const { getValues } = useFormContext();
	return <>
		<CustomModal
			show={showCityCreateModal}
			title='Crear departamento'
			centered
			onHide={() => {
				setShowCityCreateModal(false)
			}}
		>
			<CityForm closeForm={() => setShowCityCreateModal(false)} />
		</CustomModal>
		<CustomModal
			show={showCityUpdateModal}
			title='Actualizar departamento'
			centered
			onHide={() => {
				setShowCityUpdateModal(false);
			}}
		>
			<CityForm city={getValues('city')} closeForm={() => setShowCityUpdateModal(false)} />
		</CustomModal>
	</>
};

export default MainModal;
