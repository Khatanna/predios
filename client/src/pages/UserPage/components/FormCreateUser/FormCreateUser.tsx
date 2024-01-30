import { gql, useMutation } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { CheckCircle, InfoCircle, PersonAdd } from "react-bootstrap-icons";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";
import { Tooltip } from "../../../../components/Tooltip";
import { customSwalError } from "../../../../utilities/alerts";
import { status } from "../../../../utilities/constants";
import { GET_ALL_USERS_QUERY } from "../../graphQL/types";
import { useFetchCreateUser } from "../../hooks";
import { User, UserInput, UserOutput } from "../../models/types";
import { useUsersStore } from "../../state/useUsersStore";
import { SelectNameable } from "../../../../components/SelectNameable";
import {
  roleMutations,
  userTypeMutations,
} from "../../../../graphql/mutations";
import {
  GET_ALL_ROLES,
  GET_ALL_USER_TYPES_QUERY,
} from "../../../../graphql/queries";
import { Button } from "../../../../components/Button";

export interface FormCreateUserProps {
  user?: UserInput;
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
      name: yup
        .string()
        .trim()
        .matches(/^(?!undefined$).*$/gi, "El tipo de usuario es requerido")
        .required("el nombre del tipo es un campo requerido"),
    })
    .required("El tipo es un campo requerdio"),
  status: yup.string().required("El usuario debe tener un estado"),
  role: yup.object({
    name: yup
      .string()
      .trim()
      .matches(/^(?!undefined$).*$/gi, "El rol es requerido")
      .required("El rol de usuario se un campo requerido"),
  }),
});

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

const FormCreateUser: React.FC<FormCreateUserProps> = ({ user }) => {
  const { filterText } = useUsersStore();
  const { createUser } = useFetchCreateUser();
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    reset,
    control,
    getFieldState,
    formState: { errors },
  } = useForm<UserInput>({
    defaultValues: user,
    resolver: !user ? yupResolver<UserInput>(schema) : undefined,
  });
  const [updateUser] = useMutation<
    { user: UserOutput },
    {
      username: string;
      input: UserInput;
    }
  >(UDPATE_USER_MUTATION, {
    refetchQueries: [{ query: GET_ALL_USERS_QUERY, variables: { filterText } }],
    optimisticResponse: ({ input }) => {
      for (const key in input) {
        setValue(key as keyof UserInput, input[key as keyof UserInput]);
      }
      return {
        __typename: "Mutation",
        user: {
          __typename: "User",
          ...input,
          connection: "OFFLINE",
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
    if (
      getValues("names").length === 0 ||
      !getValues("names").trim().includes(" ") ||
      !(getValues("names").trim().split(" ").length >= 3)
    ) {
      customSwalError(
        "Para autocompletar el nombre debe estar compuesto por minimo 3 palabras",
        "Error de validacion",
      );
    } else {
      const words = getValues("names").trim().toUpperCase().split(/\s/);
      if (words.length === 2) {
        words.push(" ");
      }
      const [secondLastName, firstLastName, ...names] = words.reverse();

      setValue("names", names.reverse().join(" "), { shouldValidate: true });
      setValue("firstLastName", firstLastName, { shouldValidate: true });
      setValue("secondLastName", secondLastName, { shouldValidate: true });
      setValue("username", `${names[0]}.${firstLastName}`.toLocaleLowerCase(), {
        shouldValidate: true,
      });
      setValue("password", "Inra12345", { shouldValidate: true });
    }
  }, [getValues, setValue]);

  const submit = (data: UserInput) => {
    if (user) {
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
      toast.promise(
        createUser({
          variables: {
            input: data,
          },
        }),
        {
          loading: "Creando usuario",
          success: ({ data }) => {
            return `Se ha creado el usuario: ${data?.user.username}`;
          },
          error(error) {
            return `Error ${error}`;
          },
          finally: reset,
        },
      );
    }
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
                  isValid={
                    getFieldState("names").isTouched &&
                    !getFieldState("names").error?.message
                  }
                  isInvalid={!!getFieldState("names").error?.message}
                  placeholder="Nombres"
                  {...register("names")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSetCredentials();
                    }
                  }}
                  autoComplete="off"
                />
                {!user && (
                  <Tooltip label="Autocompletar">
                    <InputGroup.Text
                      role="button"
                      onClick={handleSetCredentials}
                    >
                      <CheckCircle color="green" fontSize={20} />
                    </InputGroup.Text>
                  </Tooltip>
                )}
              </InputGroup>
              <Form.Control.Feedback type="invalid">
                {errors.names?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Apellido paterno</Form.Label>
              <Form.Control
                isValid={
                  getFieldState("firstLastName").isTouched &&
                  !getFieldState("firstLastName").error?.message
                }
                isInvalid={!!getFieldState("firstLastName").error?.message}
                placeholder="Apellido paterno"
                {...register("firstLastName")}
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">
                {errors.firstLastName?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group>
              <Form.Label>Apellido materno</Form.Label>
              <Form.Control
                isValid={
                  getFieldState("secondLastName").isTouched &&
                  !getFieldState("secondLastName").error?.message
                }
                isInvalid={!!getFieldState("secondLastName").error?.message}
                placeholder="Apellido materno"
                {...register("secondLastName")}
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">
                {errors.secondLastName?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group>
              <Form.Label>Nombre de usuario</Form.Label>
              <Form.Control
                isValid={
                  getFieldState("username").isTouched &&
                  !getFieldState("username").error?.message
                }
                isInvalid={!!getFieldState("username").error?.message}
                placeholder="Nombre de usuario"
                {...register("username")}
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">
                {errors.username?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group>
              <Form.Label className="d-flex align-items-center gap-2">
                <div>Contraseña</div>
                <div>
                  {user && (
                    <Tooltip label="Para actualizar el usuario la contraseña debe ser restablecida">
                      <InfoCircle color="purple" />
                    </Tooltip>
                  )}
                </div>
              </Form.Label>
              <Form.Control
                className={
                  user &&
                  !(
                    getFieldState("password").isTouched &&
                    !getFieldState("password").error?.message
                  )
                    ? "border-2 border-warning"
                    : ""
                }
                isValid={
                  getFieldState("password").isTouched &&
                  !getFieldState("password").error?.message
                }
                isInvalid={!!getFieldState("password").error?.message}
                placeholder="Contraseña"
                {...register(
                  "password",
                  user && {
                    required: {
                      value: true,
                      message: "La contraseña debe ser restablecida",
                    },
                    minLength: {
                      value: 8,
                      message: "La contraseña debe tener almenos 8 caracteres",
                    },
                    maxLength: {
                      value: 32,
                      message:
                        "La contraseña no debe tener mas de 32 caracteres",
                    },
                  },
                )}
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col xs={3}>
            <Form.Group>
              <Form.Label>Tipo</Form.Label>
              <Controller
                name="type.name"
                control={control}
                defaultValue={"undefined"}
                render={({ field }) => (
                  <SelectNameable
                    {...field}
                    isValid={
                      getFieldState("type.name").isTouched &&
                      !getFieldState("type.name").error?.message
                    }
                    isInvalid={!!getFieldState("type.name").error?.message}
                    mutations={userTypeMutations}
                    resource="USERTYPE"
                    query={GET_ALL_USER_TYPES_QUERY}
                    placeholder="Tipo"
                    error={
                      <Form.Control.Feedback type="invalid">
                        {errors.type?.name?.message}
                      </Form.Control.Feedback>
                    }
                  />
                )}
              />
            </Form.Group>
          </Col>
          <Col sm={5}>
            <Form.Group>
              <Form.Label>Estado del usuario</Form.Label>
              <div className="d-flex flex-row justify-content-around border border-1 p-1 rounded-2 align-items-center">
                {Object.entries(status).map(([key, value]) => (
                  <Form.Check
                    {...register("status")}
                    defaultChecked={key === "ENABLE"}
                    value={key}
                    type="radio"
                    label={value}
                    style={{ margin: "2px" }}
                    key={crypto.randomUUID()}
                    id={key}
                  />
                ))}
              </div>
            </Form.Group>
          </Col>
          <Col xs={4}>
            <Form.Group>
              <Form.Label>Rol</Form.Label>
              <Controller
                name="role.name"
                control={control}
                defaultValue={"undefined"}
                render={({ field }) => (
                  <SelectNameable
                    isValid={
                      getFieldState("role.name").isTouched &&
                      !getFieldState("role.name").error?.message
                    }
                    isInvalid={!!getFieldState("role.name").error?.message}
                    {...field}
                    mutations={roleMutations}
                    resource="ROLE"
                    query={GET_ALL_ROLES}
                    placeholder="Rol"
                    error={
                      <Form.Control.Feedback type="invalid">
                        {errors.role?.name?.message}
                      </Form.Control.Feedback>
                    }
                  />
                )}
              />
            </Form.Group>
          </Col>
          <Col xs={12}>
            <Button
              className="w-100 text-center"
              type="submit"
              variant="secondary"
              bold
              leading={<PersonAdd fontSize={20} />}
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
