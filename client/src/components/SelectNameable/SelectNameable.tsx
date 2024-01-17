import { Dropdown, FormSelectProps, InputGroup } from "react-bootstrap";
import { useAuthStore } from "../../state/useAuthStore";
import { useState } from "react";
import { CustomSelect } from "../CustomSelect";
import { DropdownMenu } from "../DropdownMenu";
import { Resource } from "../../pages/UserPage/components/Permission/Permission";
import { DocumentNode } from "graphql";
import { OperationVariables, useMutation } from "@apollo/client";
import { mutationMessages } from "../../utilities/constants";
import { toast } from "sonner";
import { ModalNameable } from "../ModalNameable";

export type SelectNameableProps = {
  resource: `${Resource}`;
  query: DocumentNode;
  variables?: OperationVariables
  placeholder: string | React.ReactNode;
  mutations: Record<"create" | "update" | "delete", DocumentNode>;
  readOnly?: boolean;
  highlight?: boolean
  error?: React.ReactNode
  onChange: (
    e: {
      target: {
        value: string;
      };
    } & Partial<Omit<React.ChangeEvent<HTMLSelectElement>, "target">>,
  ) => void;
} & Omit<FormSelectProps, "onChange">;

const SelectNameable: React.FC<SelectNameableProps> = ({
  query,
  placeholder,
  resource,
  mutations,
  variables,
  readOnly = false,
  highlight = false,
  error,
  ...props
}) => {
  const { can } = useAuthStore();
  const isSelected = props.value !== "undefined";
  const canCreate = can(`CREATE@${resource}`);
  const canUpdate = can(`UPDATE@${resource}`) && isSelected;
  const canDelete = can(`DELETE@${resource}`) && isSelected;
  const [{ createMode, show }, setModalState] = useState({
    show: false,
    createMode: false,
  });

  const showMenu = canCreate || canUpdate || canDelete;
  const resetValue = () => {
    props.onChange?.({ target: { value: "undefined" } });
  };
  const [deleteMutation] = useMutation<
    { result: { name: string } },
    { name: string }
  >(mutations.delete, {
    refetchQueries: [query],
  });

  if (!showMenu) {
    return (
      <>
        <CustomSelect
          query={query}
          placeholder={placeholder}
          resource={resource}
          readOnly={readOnly}
          variables={variables}
          {...props}
        />
        {error}
      </>
    );
  }

  const handleDelete = () => {
    toast.promise(
      deleteMutation({
        variables: {
          name: props.value as string,
        },
      }),
      {
        loading: `Eliminando rol: ${props.value}`,
        success: mutationMessages.DELETE_ROLE.getSuccessMessage(
          props.value as string,
        ),
        error: mutationMessages.DELETE_ROLE.getErrorMessage(
          props.value as string,
        ),
        finally: resetValue,
      },
    );
  };

  return (
    <InputGroup size={props.size}>
      <CustomSelect
        query={query}
        placeholder={placeholder}
        resource={resource}
        readOnly={readOnly}
        highlight={highlight}
        variables={variables}
        {...props}
      />
      <InputGroup.Text>
        <DropdownMenu>
          {canCreate && (
            <Dropdown.Item
              onClick={() => setModalState({ show: true, createMode: true })}
            >
              ➕ Crear
            </Dropdown.Item>
          )}
          {canUpdate && (
            <Dropdown.Item
              onClick={() => setModalState({ show: true, createMode: false })}
            >
              ✏ Editar
            </Dropdown.Item>
          )}
          {canDelete && (
            <Dropdown.Item onClick={handleDelete}>🗑 Eliminar</Dropdown.Item>
          )}
          {isSelected && (
            <Dropdown.Item onClick={resetValue}>🧹 Limpiar</Dropdown.Item>
          )}
        </DropdownMenu>
        <ModalNameable
          query={query}
          closeModal={() => setModalState({ show: false, createMode: false })}
          createMode={createMode}
          show={show}
          isSelected={isSelected}
          resource={resource}
          value={isSelected ? (props.value as string) : ""}
          mutations={mutations}
        />
      </InputGroup.Text>
      {error}
    </InputGroup>
  );
};
export default SelectNameable;
