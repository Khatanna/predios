import React from 'react';
import { Outlet } from 'react-router';

export type LocalizationPageProps = {
}

const LocalizationPage: React.FC<LocalizationPageProps> = ({ }) => {
	return <Outlet />;
};

export default LocalizationPage;
