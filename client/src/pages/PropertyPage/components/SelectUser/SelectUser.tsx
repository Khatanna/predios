import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { FieldPath, useFormContext, Controller } from "react-hook-form";
import Select, { Props, StylesConfig } from "react-select";
import { User } from "../../../UserPage/models/types";
import { buildFullName } from "../../../UserPage/utils/buildFullName";
import { Property } from "../../models/types";
import { useSelectSubscription } from "../../hooks/useSelectSubscription";

type Option = {
  label: string;
  value: string;
};

export type SelectUserProps = {
  type?: string;
  name: FieldPath<Property>;
  isDisabled?: boolean;
  toSubscribe?: boolean;
} & Props;

const GET_ALL_USERS_BY_TYPE = gql`
  query GetAllUsersByType($type: String, $filterText: String) {
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

const optionsAdapter = (users?: User[]): Option[] => {
  if (!users) return [];

  return users.map((user) => ({
    label: buildFullName(user)!,
    value: user.username,
  }));
};
const useFetchUsers = ({ type }: { type?: string }) => {
  const [filterText, setFilterText] = useState("");

  const query = useQuery<{ users: User[] }>(GET_ALL_USERS_BY_TYPE, {
    variables: {
      type,
      filterText,
    },
  });

  return {
    ...query,
    options: optionsAdapter(query.data?.users),
    setFilterText,
  };
};

const SelectUser: React.FC<SelectUserProps> = ({
  type,
  name,
  placeholder,
  isDisabled,
  toSubscribe = true,
}) => {
  const { options, setFilterText, loading } = useFetchUsers({ type });
  const { control, getValues } = useFormContext<Property>();
  const { subscribe } = useSelectSubscription(
    toSubscribe ? getValues("id") : undefined,
  );
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const { onChange, ref, value, ...rest } = subscribe(field);

        return (
          <Select
            {...rest}
            inputRef={ref}
            options={options}
            placeholder={placeholder}
            isLoading={loading}
            value={
              getValues(name) ? options?.find((u) => u.value === value) : null
            }
            onChange={(newValue) => onChange(newValue?.value)}
            isDisabled={isDisabled}
            isClearable
            isSearchable
            styles={customStyles}
            onInputChange={(newValue) => {
              setFilterText(newValue);
            }}
          />
        );
      }}
    />
  );
};

export default SelectUser;
