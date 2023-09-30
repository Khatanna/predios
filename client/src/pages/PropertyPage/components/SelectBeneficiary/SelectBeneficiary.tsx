import { useMemo, useState } from 'react';
import Select, { Props } from 'react-select';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import { Beneficiary } from '../../../BeneficiaryPage/models/types';

export type SelectBeneficiaryProps = {
}

const GET_BENEFICIARIES_QUERY = `
  query GetBeneficiaries($name: String) {
		beneficiaries: getAllBeneficiaries(name: $name)	{
			id
			name
		}
	}
`

const SelectBeneficiary: React.FC<SelectBeneficiaryProps & Props> = ({ ...props }) => {
	const [name, setName] = useState<string | undefined>();
	const { data } = useCustomQuery<{ beneficiaries: Beneficiary[] }>(GET_BENEFICIARIES_QUERY, ['getBeneficiariesByName', { name }])

	const options = useMemo(() => {
		return data?.beneficiaries.map(({ id, name }) => ({
			label: name,
			value: id
		}))
	}, [data?.beneficiaries])

	return <>
		<Select
			{...props}
			options={options}
			placeholder="Beneficiarios"
			isMulti
			isSearchable
			isClearable={false}
			onInputChange={(newValue) => {
				setName(newValue)
			}}
		/>
	</>;
};

export default SelectBeneficiary;
