import { Dropdown, FormSelectProps, InputGroup } from "react-bootstrap";
import { useAuthStore } from "../../state/useAuthStore";
import { useState } from "react";
import { CustomSelect } from "../CustomSelect";
import { DropdownMenu } from "../DropdownMenu";
import { Resource } from "../../pages/UserPage/components/Permission/Permission";
import { DocumentNode } from "graphql";
import { useMutation } from "@apollo/client";
import { mutationMessages } from "../../utilities/constants";
import { toast } from "sonner";
import { ModalNameable } from "../ModalNameable";

export type SelectNameableProps = {
  resource: `${Resource}`;
  query: DocumentNode;
  placeholder: string | React.ReactNode;
  mutations: Record<"create" | "update" | "delete", DocumentNode>;
  readOnly?: boolean;
};

const SelectNameable: React.FC<SelectNameableProps & FormSelectProps> = ({
  query,
  placeholder,
  resource,
  mutations,
  readOnly = false,
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

  const [deleteMutation] = useMutation<
    { result: { name: string } },
    { name: string }
  >(mutations.delete, {
    refetchQueries: [query],
  });

  if (!showMenu) {
    return (
      <CustomSelect
        query={query}
        placeholder={placeholder}
        resource={resource}
        readOnly={readOnly}
        {...props}
      />
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
        finally() {
          props.onChange?.({ target: { value: "undefined" } });
        },
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
        </DropdownMenu>
        <ModalNameable
          query={query}
          closeModal={() => setModalState({ show: false, createMode: false })}
          createMode={createMode}
          show={show}
          isSelected={isSelected}
          resource={resource}
          value={props.value as string}
          mutations={mutations}
        />
      </InputGroup.Text>
    </InputGroup>
  );
};
export default SelectNameable;
