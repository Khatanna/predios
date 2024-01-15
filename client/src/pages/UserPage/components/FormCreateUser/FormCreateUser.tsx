import { gql, useMutation, useQuery } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Form,
  FormSelectProps,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { CheckCircle, ExclamationTriangle } from "react-bootstrap-icons";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";
import { Tooltip } from "../../../../components/Tooltip";
import { customSwalError } from "../../../../utilities/alerts";
import { status } from "../../../../utilities/constants";
// import { SelectNameable } from "../../../HomePage/HomePage";
import { Error } from "../../../LoginPage/styled-components/Error";
import { GET_ALL_USERS_QUERY } from "../../graphQL/types";
import { useFetchCreateUser } from "../../hooks";
import { Role, User, UserInput, UserType } from "../../models/types";
import { useUsersStore } from "../../state/useUsersStore";
import { capitalizeString } from "../../utils/capitalizeString";

export interface FormCreateUserProps {
  user?: User;
}

const schema = yup.object({
  names: yup.string().required("El nombre es un campo obligatorio"),
  username: yup
    .string()
    .required("El nombre de usuario es un campo obligatorio"),
  firstLastName: yup
    .string()
    .required("El apellido paterno del usuario es un campo obligatorio"),
  secondLastName: yup
    .string()
    .required("El apellido paterno del usuario es un campo obligatorio"),
  password: yup
    .string()
    .required("La contraseña es un campo obligatorio")
    .min(8, "La contraseña debe tener almenos 8 caracteres")
    .max(32, "La contraseña no debe tener mas de 32 caracteres"),
  type: yup
    .object({
      name: yup.string().required("el nombre del tipo es un campo requerido"),
    })
    .required("El tipo es un campo requerdio"),
  status: yup.string().required("El usuario debe tener un estado"),
});

const GET_ALL_USER_TYPES_QUERY = gql`
  {
    userTypes: getAllUserTypes {
      id
      name
    }
  }
`;
const UDPATE_USER_MUTATION = gql`
  mutation UpdateUser($username: String, $input: UserInput) {
    user: updateUserByUsername(username: $username, input: $input) {
      names
      firstLastName
      secondLastName
      username
      status
    }
  }
`;

const SelectUserType: React.FC<FormSelectProps> = (props) => {
  const { data, error, loading } = useQuery<{ userTypes: UserType[] }>(
    GET_ALL_USER_TYPES_QUERY,
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner variant="danger" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="warning" className="p-1 py-2 m-0">
        <small>
          <div className="d-flex align-items-center gap-2">
            <ExclamationTriangle size={16} color="red" />
            <div>No tienes permisos para ver los tipos de usuario</div>
          </div>
        </small>
      </Alert>
    );
  }

  return (
    <Form.Select {...props}>
      <option value="undefined" disabled>
        Tipo de usuario
      </option>
      {data?.userTypes.map(({ name }) => (
        <option value={name}>{name}</option>
      ))}
    </Form.Select>
  );
};

const GET_ALL_ROLES = gql`
  query GetAllRoles {
    roles: getAllRoles {
      name
    }
  }
`;

const SelectRol: React.FC<FormSelectProps> = (props) => {
  const { data, loading, error } = useQuery<{ roles: Role[] }>(GET_ALL_ROLES);
  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner variant="danger" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="warning" className="p-1 py-2 m-0">
        <small>
          <div className="d-flex align-items-center gap-2">
            <ExclamationTriangle size={16} color="red" />
            <div>{error.message}</div>
          </div>
        </small>
      </Alert>
    );
  }

  return (
    <Form.Select {...props}>
      <option value="undefined" disabled>
        Rol
      </option>
      {data?.roles.map(({ name }) => (
        <option value={name}>{capitalizeString(name)}</option>
      ))}
    </Form.Select>
  );
};

const FormCreateUser: React.FC<FormCreateUserProps> = ({ user }) => {
  // const { createUserType } = useFetchCreateUserType();
  const [userUpdated, setUserUpdated] = useState(user);
  const { filterText } = useUsersStore();
  const { createUser } = useFetchCreateUser();
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<UserInput>({
    values: { ...userUpdated, password: user ? "Inra12345" : "" },
    resolver: yupResolver<UserInput>(schema),
  });
  const names = watch("names");
  const [updateUser] = useMutation<
    { user: User },
    {
      username: string;
      input: UserInput;
    }
  >(UDPATE_USER_MUTATION, {
    refetchQueries: [{ query: GET_ALL_USERS_QUERY }],
    optimisticResponse: ({ input }) => {
      setUserUpdated(input);
      return {
        __typename: "Mutation",
        user: {
          __typename: "User",
          ...input,
        },
      };
    },
    update: (cache, { data }) => {
      if (!data || !data.user) return;

      const query = cache.readQuery<{ users: User[] }, { filterText: string }>({
        query: GET_ALL_USERS_QUERY,
        variables: {
          filterText,
        },
      });

      if (!query) return;

      const updatedUsers = query.users.map((user) => {
        if (user.username === data?.user.username) {
          return data.user;
        }

        return user;
      });

      cache.writeQuery<{ users: User[] }>({
        query: GET_ALL_USERS_QUERY,
        data: {
          users: updatedUsers!,
        },
        variables: {
          filterText,
        },
      });
    },
  });

  const handleSetCredentials = useCallback(() => {
    if (getValues("names").length === 0) {
      customSwalError(
        "Debe llenar correctamente los campos",
        "Error de validacion",
      );
    } else {
      const words = getValues("names").trim().toUpperCase().split(/\s/);
      if (words.length === 2) {
        words.push(" ");
      }
      const [secondLastName, firstLastName, ...names] = words.reverse();

      setValue("names", names.reverse().join(" "));
      setValue("firstLastName", firstLastName, { shouldValidate: true });
      setValue("secondLastName", secondLastName, { shouldValidate: true });
      setValue(
        "username",
        names[0].concat(".", firstLastName).toLocaleLowerCase(),
        { shouldValidate: true },
      );
      setValue("password", "Inra12345", { shouldValidate: true });
    }
  }, [getValues, setValue]);

  const submit = (data: UserInput) => {
    if (user) {
      delete data.connection;
      delete data.createdAt;
      toast.promise(
        updateUser({
          variables: {
            username: user.username,
            input: data,
          },
        }),
        {
          loading: "Actualizando usuario",
          success: ({ data }) => {
            return `Se actualizo el usuario: ${data?.user.username}`;
          },
          error(error) {
            return `Error ${error}`;
          },
        },
      );
    } else {
      createUser({
        variables: {
          input: data,
        },
      });
    }
    reset();
  };

  return (
    <Row>
      <Col xs={12} sm={11} md={10} lg={9} xl={8}>
        <Form
          className="row g-3 position-absolute top-50 start-50 translate-middle"
          onSubmit={handleSubmit(submit)}
        >
          <Col xs={12}>
            <Form.Group>
              <Form.Label>Nombres</Form.Label>
              <InputGroup>
                <Form.Control
                  placeholder="Nombres"
                  {...register("names")}
                  onKeyDown={(e) => e.key === "Enter" && handleSetCredentials()}
                  autoComplete="off"
                />
                {!user && names?.length > 0 && (
                  <Tooltip label="Autocompletar">
                    <InputGroup.Text
                      role="button"
                      onClick={handleSetCredentials}
                    >
                      <CheckCircle color="green" />
                    </InputGroup.Text>
                  </Tooltip>
                )}
              </InputGroup>
              <Error>{errors.names?.message}</Error>
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Apellido paterno</Form.Label>
              <Form.Control
                placeholder="Apellido paterno"
                {...register("firstLastName")}
                autoComplete="off"
              />
              <Error>{errors.firstLastName?.message}</Error>
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group>
              <Form.Label>Apellido materno</Form.Label>
              <Form.Control
                placeholder="Apellido materno"
                {...register("secondLastName")}
                autoComplete="off"
              />
              <Error>{errors.secondLastName?.message}</Error>
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group>
              <Form.Label>Nombre de usuario</Form.Label>
              <Form.Control
                placeholder="Nombre de usuario"
                {...register("username")}
                autoComplete="off"
              />
              <Error>{errors.username?.message}</Error>
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group>
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                placeholder="Contraseña"
                {...register("password")}
                autoComplete="off"
              />
              <Error>{errors.password?.message}</Error>
            </Form.Group>
          </Col>
          <Col xs={4}>
            <Form.Group>
              <Form.Label>Tipo</Form.Label>
              <Controller
                name="type.name"
                control={control}
                defaultValue={"undefined"}
                render={({ field }) => <SelectUserType {...field} />}
              />
              <Error>{errors.type?.name?.message}</Error>
            </Form.Group>
          </Col>
          <Col sm={5}>
            <Form.Group>
              <Form.Label>Estado del usuario</Form.Label>
              <div className="d-flex flex-row justify-content-around border border-1 p-1 rounded-2">
                {Object.entries(status).map(([key, value]) => (
                  <Form.Check
                    {...register("status")}
                    defaultChecked={key === "ENABLE"}
                    value={key}
                    type="radio"
                    label={value}
                    key={crypto.randomUUID()}
                    id={key}
                  />
                ))}
              </div>
            </Form.Group>
          </Col>
          <Col xs={3}>
            <Form.Group>
              <Form.Label>Rol</Form.Label>
              <Controller
                name="role.name"
                control={control}
                defaultValue={"undefined"}
                render={({ field }) => <SelectRol {...field} />}
              />
              <Error>{errors.type?.name?.message}</Error>
            </Form.Group>
          </Col>
          <Col xs={12}>
            <Button
              className="float-end w-100 text-white"
              type="submit"
              variant="success"
            >
              {user ? "Actualizar" : "Crear"} usuario
            </Button>
          </Col>
        </Form>
      </Col>
    </Row>
  );
};

export default FormCreateUser;
