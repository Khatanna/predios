import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { Beneficiary } from './models/types';
import { Table } from '../../components/Table';
import { useCustomQuery } from '../../hooks/useCustomQuery';

export type BeneficiaryPageProps = {
}

const columns: TableColumn<Beneficiary>[] = [
	{
		name: 'Nro',
		selector: (_row, index) => (index || 0) + 1,
		sortFunction: (a, b) => +a.createdAt - +b.createdAt
	},
	{
		name: 'Nombre del beneficiario',
		selector: (row) => row.name
	}
]

const GET_ALL_BENEFICIARIES_QUERY = `
	query GetAllBeneficiariesQuery {
		beneficiaries: getAllBeneficiaries {
			id
			name
			createdAt
		}
	}	
`

const BeneficiaryPage: React.FC<BeneficiaryPageProps> = ({ }) => {
	const { data, error, isLoading } = useCustomQuery<{ beneficiaries: Beneficiary[] }>(GET_ALL_BENEFICIARIES_QUERY, ['getAllBeneficiaries'])

	if (error) {
		return <div>{error}</div>
	}

	return <Table
		name='beneficiarios'
		columns={columns}
		data={data?.beneficiaries ?? []}
		progressPending={isLoading}
	/>;
};

export default BeneficiaryPage;
