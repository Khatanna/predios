import { useState } from "react";
import Select, { Props, StylesConfig } from "react-select";
import { useCustomQuery } from "../../../../hooks/useCustomQuery";
import { User } from "../../../UserPage/models/types";
import { useAuth } from "../../../../hooks";

export type SelectUserProps = {
  type?: string;
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

const customStyles: StylesConfig<User> = {
  control: (provided, state) => ({
    ...provided,
    border: "1px solid #ced4da",
    borderRadius: "4px",
    boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(77, 255, 0, 0.25)" : "none",
    height: "2rem",
    minHeight: "2rem",
    fontSize: "0.9rem",
    display: "flex",
    alignContent: "center",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#007bff" : "white",
    color: state.isFocused ? "white" : "black",
  }),
};

const SelectUser: React.FC<SelectUserProps & Props<User>> = ({
  type,
  ...props
}) => {
  const [filterText, setFilterText] = useState("");
  const { role } = useAuth();
  const isAdmin = role === "administrador";
  const { data } = useCustomQuery<{ users: User[] }>(GET_ALL_USERS_BY_TYPE, [
    "getFieldForCreate",
    { type, filterText },
  ]);

  return (
    <Select
      isDisabled={!isAdmin}
      {...props}
      options={data?.users}
      getOptionLabel={(e) =>
        e.names.concat(" ", e.firstLastName, " ", e.secondLastName)
      }
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
