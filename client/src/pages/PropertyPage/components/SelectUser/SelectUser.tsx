import { useState } from "react";
import Select, { Props } from "react-select";
import { useCustomQuery } from "../../../../hooks/useCustomQuery";
import { User } from "../../../UserPage/models/types";
import { Form } from 'react-bootstrap';

export type SelectUserProps = {
  type: string;
  // defaultValue?: { label: string, value: string }
};
const GET_ALL_USERS_BY_TYPE = `
	query GetAllLegal($type: String, $filterText: String) {
		users: getUsers(type: $type, filterText: $filterText) {
			names
			username
			firstLastName
			secondLastName
		}
	}
`;

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: '1px solid #ced4da', // Establece un borde similar al de react-bootstrap
    borderRadius: '4px', // Añade esquinas redondeadas
    boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(77, 255, 0, 0.25)' : 'none',
    height: '2rem',
    minHeight: '2rem',
    fontSize: '0.9rem',
    display: 'flex',
    alignContent: 'center'
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#007bff' : 'white', // Cambia el color de fondo cuando está enfocado
    color: state.isFocused ? 'white' : 'black', // Cambia el color del texto cuando está enfocado
  }),
};

const SelectUser: React.FC<SelectUserProps & Props<User>> = ({ type, ...props }) => {
  const [filterText, setFilterText] = useState('');
  const { data } = useCustomQuery<{ users: User[] }>(GET_ALL_USERS_BY_TYPE, [
    "getFieldForCreate",
    { type, filterText },
  ]);

  return (
    <Select
      {...props}
      options={data?.users}
      getOptionLabel={(e) => e.names.concat(' ', e.firstLastName, ' ', e.secondLastName)}
      getOptionValue={(e) => e.username}
      isClearable
      isSearchable
      styles={customStyles}
      onInputChange={(newValue) => {
        setFilterText(newValue);
      }}
    />
  );
};

export default SelectUser;
