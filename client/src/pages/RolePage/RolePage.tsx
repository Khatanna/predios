import { useEffect } from 'react'
import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { Accordion, Button, Col, Dropdown, Form, Modal } from "react-bootstrap";
import { FileEarmarkPlus } from "react-bootstrap-icons";
import { useParams } from "react-router";
import { Chip } from "../../components/Chip";
import { Tooltip } from "../../components/Tooltip";
import { levels, resources } from "../../utilities/constants";
import { PermissionTable } from "../PermissionPage/PermissionPage";
import { Role } from "../UserPage/models/types";
import { useForm } from "react-hook-form";
import { Level, Resource } from "../UserPage/components/Permission/Permission";
import { toast } from "sonner";
import { Permission } from "../PermissionPage/models/types";
import { DropdownMenu } from "../../components/DropdownMenu";
import { Link } from "react-router-dom";
import { useRoleStore } from './state/useRoleStore';
export type RolePageProps = {
  // types...
};
interface FormValues {
  permissions: Record<Resource, { resource: Resource; levels: Level[] }>;
}

const GET_ROLE_QUERY = gql`
  query GetRole($name: String) {
    role: getRole(name: $name) {
      name
      permissions {
        status
        permission {
          name
          description
          level
          resource
          status
        }
      }
    }
  }
`;

const CREATE_PERMISSION_FOR_ROLE_MUTATION = gql`
  mutation CreatePermissionForRole(
    $role: String
    $permissions: [PermissionsInput]
  ) {
    role: createPermissionForRole(role: $role, permissions: $permissions) {
      name
    }
  }
`;

const DELETE_PERMISSION_FOR_ROLE_MUTATION = gql`
  mutation DeletePermissionForRole($role: String, $permission: PermissionForRoleInput) {
    role: deletePermissionForRole(role: $role, permission: $permission) {
      permissions {
        permission {
          level
        }
      }
    }
  }
`

const LocalResources = Object.entries(resources);
const LocalLevels = Object.entries(levels);

const OptionMenu: React.FC<{ permission: Permission }> = ({ permission }) => {
  const [deletePermission] = useMutation<{ role: Role }, { role: string, permission: { level: Level, resource: Resource } }>(DELETE_PERMISSION_FOR_ROLE_MUTATION, { refetchQueries: [GET_ROLE_QUERY] });
  const { role } = useRoleStore();
  const handleClickDelete = () => {
    toast.promise(deletePermission({
      variables: {
        role: role!,
        permission: {
          level: permission.level,
          resource: permission.resource
        }
      }
    }))
  }

  return (
    <DropdownMenu align={"end"}>
      <Dropdown.Item
        as={Link}
        to={`/admin/permissions/edit`}
        state={permission}
      >
        ✏ Editar
      </Dropdown.Item>
      <Dropdown.Item onClick={handleClickDelete}>🗑 Eliminar</Dropdown.Item>
      {/* <Dropdown.Item onClick={handleStatus}>
		{permission.status === "ENABLE" ? "⛔ Deshabilitar" : "✔ Habilitar"}
	</Dropdown.Item> */}
    </DropdownMenu>
  );
};

const RolePage: React.FC<RolePageProps> = () => {
  const [show, setShow] = useState(false);
  const { role } = useParams();
  const { setRole } = useRoleStore();
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      permissions: Object.keys(resources).reduce(
        (
          acc: Record<Resource, { resource: Resource; levels: Level[] }>,
          resource,
        ) => {
          acc[resource as Resource] = {
            resource: resource as Resource,
            levels: [],
          };

          return acc;
        },
        {} as Record<Resource, { resource: Resource; levels: Level[] }>,
      ),
    },
  });
  const { data, loading, refetch } = useQuery<{ role: Role }>(GET_ROLE_QUERY, {
    variables: { name: role },
  });
  const handleClose = () => {
    setShow(false);
  };

  const [createPermissionForRole] = useMutation<
    { role: Role },
    { role: string; permissions: { resource: Resource; levels: Level[] }[] }
  >(CREATE_PERMISSION_FOR_ROLE_MUTATION, {
    refetchQueries: [{ query: GET_ROLE_QUERY }],
    onCompleted() {
      handleClose();
      refetch();
      reset();
      toast.success("Se han creado los permisos correctamente");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const submit = (data: FormValues) => {
    createPermissionForRole({
      variables: {
        role: role!,
        permissions: Object.values(data.permissions),
      },
    });
  };

  useEffect(() => {
    setRole({ role });

    return () => {
      setRole({ role: undefined })
    }
  }, [setRole, role])

  return (
    <div>
      <PermissionTable
        Dropdown={OptionMenu}
        name={`permisos para el perfil de ${role}`}
        isLoading={loading}
        permissions={
          data?.role.permissions.map((e) => ({
            ...e.permission,
            status: e.status,
          })) ?? []
        }
        actions={
          <div className="d-flex gap-2">
            <Tooltip placement="left" label="Agregar un permiso">
              <div className="text-primary" role="button">
                <FileEarmarkPlus size={30} onClick={() => setShow(true)} />
              </div>
            </Tooltip>
          </div>
        }
      />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Crear permisos para: <strong>{role}</strong>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            className="row g-3 justify-content-center"
            onSubmit={handleSubmit(submit)}
          >
            <Col xs="10">
              <Form.Group>
                <Accordion>
                  {LocalResources.filter(([localResource]) => {
                    const levels =
                      data?.role.permissions.reduce(
                        (
                          acc: string[],
                          { permission: { resource, level } },
                        ) => {
                          if (localResource === resource) {
                            acc.push(level);
                          }

                          return acc;
                        },
                        [],
                      ) ?? [];

                    return levels.length !== 4;
                  }).map(([resource, name]) => {
                    return (
                      <Accordion.Item
                        eventKey={resource}
                        key={crypto.randomUUID()}
                      >
                        <Accordion.Header className="d-flex align-items-center">
                          <div className="d-flex gap-2 align-items-center">
                            Permisos de:{" "}
                            <Chip text={name} background={resource} />
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          {LocalLevels.filter(([level]) => {
                            return !data?.role.permissions.some(
                              ({ permission }) =>
                                permission.level === level &&
                                permission.resource === resource,
                            );
                          }).map(([level, name]) => (
                            <Form.Check
                              type={"checkbox"}
                              label={name}
                              value={level}
                              id={crypto.randomUUID()}
                              {...register(
                                `permissions.${resource as Resource}.levels`,
                              )}
                            />
                          ))}
                        </Accordion.Body>
                      </Accordion.Item>
                    );
                  })}
                </Accordion>
              </Form.Group>
            </Col>
            <Col xs="10">
              <Button
                variant="success"
                className="text-white shadow float-end"
                type="submit"
              >
                Crear permisos para este perfil
              </Button>
            </Col>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RolePage;
