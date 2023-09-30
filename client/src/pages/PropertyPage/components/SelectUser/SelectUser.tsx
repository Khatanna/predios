import { useMemo, useState } from 'react';
import Select, { Props } from 'react-select';
import { useCustomQuery } from '../../../../hooks/useCustomQuery';
import { User } from '../../../UserPage/models/types';
export type SelectUserProps = {
	type: string
}
const GET_ALL_USERS_BY_TYPE = `
	query GetAllLegal($type: String, $filterText: String) {
		users: getUsers(type: $type, filterText: $filterText) {
			names
			username
			firstLastName
			secondLastName
		}
	}
`

const SelectUser: React.FC<SelectUserProps & Props> = ({ type, ...props }) => {
	const [filterText, setFilterText] = useState<string | undefined>(undefined)
	const { data } = useCustomQuery<{ users: User[] }>(GET_ALL_USERS_BY_TYPE, ['getFieldForCreate', { type, filterText }])

	const options = useMemo(() => {
		return data?.users.map(({ username, names, firstLastName, secondLastName }) => ({
			label: names.concat(" ", firstLastName, " ", secondLastName),
			value: username,
		}))
	}, [data?.users])

	return <Select
		{...props}
		options={options}
		isClearable
		isSearchable
		onInputChange={(newValue) => {
			setFilterText(newValue)
		}}
	/>
};

export default SelectUser;
