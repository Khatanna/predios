import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { FieldPath, useFormContext, Controller } from "react-hook-form";
import Select, {
  MultiValue,
  Props,
  SingleValue,
  StylesConfig,
} from "react-select";
import { User } from "../../../UserPage/models/types";
import { buildFullName } from "../../../UserPage/utils/buildFullName";
import { Property } from "../../models/types";
export type SelectUserProps = {
  type?: string;
  name: FieldPath<Property>;
  user: FieldPath<Property>;
};
const GET_ALL_USERS_BY_TYPE = gql`
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
const usersAdapter = (users?: User[]) => {
  if (!users) return [];

  return users;
};
const useFetchUsers = ({ type }: { type?: string }) => {
  const [filterText, setFilterText] = useState("");

  const { data, ...query } = useQuery<{ users: User[] }>(
    GET_ALL_USERS_BY_TYPE,
    {
      variables: {
        type,
        filterText,
      },
    },
  );

  return { ...query, data: usersAdapter(data?.users), setFilterText };
};

const SelectUser: React.FC<SelectUserProps & Props<User>> = ({
  type,
  name,
  user,
  placeholder,
  isDisabled,
}) => {
  const { data, setFilterText, loading } = useFetchUsers({ type });
  const { watch, setValue, control } = useFormContext<Property>();
  // const {
  //   subscribe: { onBlur, onFocus, onChange, disabled, ref },
  // } = useInputSubscription({
  //   name,
  // });
  const options = data;
  return (
    <Controller
      control={control}
      name={name}
      render={({ ...field }) => (
        <Select
          {...field}
          options={options}
          placeholder={placeholder}
          isLoading={loading}
          getOptionValue={(u) => u.username}
          getOptionLabel={(u) => {
            return buildFullName(u)!;
          }}
          isDisabled={isDisabled}
          isClearable
          isSearchable
          styles={customStyles}
          onInputChange={(newValue) => {
            setFilterText(newValue);
          }}
        />
      )}
    />
  );
};

export default SelectUser;
