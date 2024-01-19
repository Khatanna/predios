import { Dropdown, FormSelectProps, InputGroup } from "react-bootstrap";
import { useAuthStore } from "../../state/useAuthStore";
import { CustomSelect } from "../CustomSelect";
import { DropdownMenu } from "../DropdownMenu";
import { Resource } from "../../pages/UserPage/components/Permission/Permission";
import { DocumentNode, printIntrospectionSchema } from "graphql";
import { OperationVariables, useMutation } from "@apollo/client";
import { mutationMessages, resources } from "../../utilities/constants";
import { toast } from "sonner";
import { useModalStore } from "../../state/useModalStore";

interface Event
  extends Partial<Omit<React.ChangeEvent<HTMLSelectElement>, "target">> {
  target: {
    value: string;
  };
}

export type SelectNameableProps = {
  resource: `${Resource}`;
  query: DocumentNode;
  variables?: OperationVariables;
  placeholder: string | React.ReactNode;
  mutations: Record<"create" | "update" | "delete", DocumentNode>;
  readOnly?: boolean;
  highlight?: boolean;
  error?: React.ReactNode;
  onChange: (...e: any[]) => void;
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
  const { setModal, closeModal } = useModalStore();

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
  const [createMutation] = useMutation<
    { result: { name: string } },
    { name: string }
  >(mutations.create, {
    refetchQueries: [query],
  });
  const [updateMutation] = useMutation<
    { result: { name: string } },
    { currentName: string; name: string }
  >(mutations.update, {
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
        success: mutationMessages[`DELETE_${resource}`].getSuccessMessage(
          props.value as string,
        ),
        error: mutationMessages[`DELETE_${resource}`].getErrorMessage(
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
              onClick={() => {
                setModal({
                  show: true,
                  title: `Crear ${resources[resource]}`,
                  resource,
                  createMutation: (name: string) => {
                    toast.promise(
                      createMutation({
                        variables: {
                          name,
                        },
                      }),
                      {
                        loading: `Creando ${resources[resource]}: ${name}`,
                        success:
                          mutationMessages[
                            `CREATE_${resource}`
                          ].getSuccessMessage(name),
                        error:
                          mutationMessages[
                            `CREATE_${resource}`
                          ].getErrorMessage(name),
                        finally: () => (closeModal(), resetValue()),
                      },
                    );
                  },
                  updateMutation: () => {},
                  value: undefined,
                });
              }}
            >
              ➕ Crear
            </Dropdown.Item>
          )}
          {canUpdate && (
            <Dropdown.Item
              onClick={() => {
                setModal({
                  show: true,
                  title: `Actualizar ${resources[resource]}`,
                  resource,
                  createMutation: () => {},
                  updateMutation: (currentName, name) => {
                    toast.promise(
                      updateMutation({
                        variables: {
                          currentName,
                          name,
                        },
                      }),
                      {
                        loading: `Actualizando ${resources[resource]}: ${name}`,
                        success:
                          mutationMessages[
                            `UPDATE_${resource}`
                          ].getSuccessMessage(name),
                        error:
                          mutationMessages[
                            `UPDATE_${resource}`
                          ].getErrorMessage(name),
                        finally: () => (closeModal(), resetValue()),
                      },
                    );
                  },
                  value: props.value as string,
                });
              }}
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
      </InputGroup.Text>
      {error}
    </InputGroup>
  );
};
export default SelectNameable;
