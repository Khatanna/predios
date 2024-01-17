import { useState } from 'react';
import { Table } from '../../components/Table';
import { TableColumn } from 'react-data-table-component';
import { useCustomQuery } from '../../hooks/useCustomQuery';
import { Record } from './models/types';
import JsonView from '@uiw/react-json-view';
import { lightTheme } from '@uiw/react-json-view/light';
import { Chip } from '../../components/Chip';
import { levels, resources } from '../../utilities/constants';
import { Form } from 'react-bootstrap';

const columns: TableColumn<Record>[] = [
	{
		name: 'Nro',
		selector: (_row, index) => (index || 0) + 1,
		sortFunction: (a, b) => Number(a.createdAt) - Number(b.createdAt),
		width: "80px",
	},
	{
		name: "Descripción",
		selector: (row) => row.description
	},
	{
		name: 'IPV4',
		selector: (row) => row.ip
	},
	{
		name: 'Fecha de registro',
		selector: (row) => {
			const parse = new Date(+row.createdAt)
			const time = parse.toLocaleString()

			return time;
		}
	},
	{
		name: 'Operación',
		selector: (row) => row.operation
	},
	{
		name: 'Acción',
		cell: (row) => <Chip text={levels[row.action as keyof typeof levels]} background={row.action} key={crypto.randomUUID()} outline />
	},
	{
		name: 'Recurso',
		cell: (row) => <Chip text={resources[row.resource as keyof typeof resources]} background={row.resource} key={crypto.randomUUID()} />
	},
	{
		name: 'Usuario',
		selector: (row) => row.user.username,
		sortable: true
	},
]

const GET_ALL_RECORDS_QUERY = `
query GetAllRecords($resource: String){
  records: getAllRecords(resource: $resource) {
    id
    operation
    resource
		description
		ip
		action
		user {
			username
		}
		result
		createdAt
  }
}
`

const SubHeaderFilter: React.FC<{ resource: keyof typeof resources | undefined, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }> = ({ resource, onChange }) => {
	return <>
		<Form>
			<Form.Select onChange={onChange}>
				<option selected={!resource}>Todos</option>
				{Object.entries(resources).map(([k, v]) => (
					<option value={k} selected={resource === k}>{v}</option>
				))}
			</Form.Select>
		</Form>
	</>
}

const RecordPage: React.FC = () => {
	const [resource, setResource] = useState<keyof typeof resources | undefined>();
	const { data, error, isLoading } = useCustomQuery<{ records: Record[] }>(GET_ALL_RECORDS_QUERY, ['getAllRecords', { resource }])

	if (isLoading) {
		return <div>cargando...</div>
	}
	if (error) {
		return <div>
			{JSON.stringify(error)}
		</div>;
	}
	// return <div>
	// 	{JSON.stringify(data?.records)}
	// </div>;
	return <Table
		name={'historial'}
		columns={columns}
		data={data?.records ?? []}
		expandOnRowClicked
		expandableRows
		subHeader
		subHeaderComponent={<SubHeaderFilter resource={resource} onChange={(e) => {
			const resource = e.target.value as keyof typeof resources
			setResource(e.target.value === 'Todos' ? undefined : resource)
		}} />}
		expandableRowsComponent={(props) => {
			return <div className='container'>
				<div className='row'>
					<div className='col-12'>
						<JsonView value={JSON.parse(props.data.result)} collapsed style={lightTheme} />
					</div>
				</div>
			</div>
		}}
	/>
};

export default RecordPage;
