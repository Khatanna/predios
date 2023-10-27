import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { Alert, Button, Col, Form, InputGroup, Row, Spinner, FormSelectProps } from "react-bootstrap";
import {
  CheckCircle,
  ExclamationTriangle,
  PlusCircle,
  XCircle,
} from "react-bootstrap-icons";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import * as yup from "yup";
import { Error } from "../../../LoginPage/styled-components/Error";
import type { User, UserType } from "../../models/types";
import {
  useFetchCreateUserType,
  useFetchCreateUser,
} from "../../hooks";
import { customSwalError, customSwalSuccess } from "../../../../utilities/alerts";
import { useCustomQuery } from "../../../../hooks/useCustomQuery";
import { mutationMessages, status } from "../../../../utilities/constants";
import { useCustomMutation } from "../../../../hooks";

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
  type: yup.object({
    name: yup.string().required('el nombre del tipo es un campo requerido')
  }).required('El tipo es un campo requerdio'),
  status: yup.string().required("El usuario debe tener un estado"),
});

const GET_ALL_USER_TYPES_QUERY = `{
  userTypes: getAllUserTypes {
    id
    name
  }
}`;
const UDPATE_USER_MUTATION = `
  mutation UpdateUser($input: UpdateUserByUsernameInput) {
    result: updateUserByUsername(input: $input) {
      updated,
      user {
        names
        firstLastName
        secondLastName
        username
        status
        typeId
      }
    }
  }
`;

const SelectUserType: React.FC<FormSelectProps> = (props) => {
  const { data, error, isLoading } = useCustomQuery<{ userTypes: UserType[] }>(
    GET_ALL_USER_TYPES_QUERY,
    ["getAllUserTypes"],
  );

  if (isLoading) {
    return <div className="d-flex justify-content-center">
      <Spinner variant='danger' />
    </div>
  }

  if (error) {
    return <Alert variant='warning' className="p-1 py-2 m-0">
      <small>
        <div className='d-flex align-items-center gap-2'>
          <ExclamationTriangle size={16} color='red' />
          <div>
            No tienes permisos para ver los tipos de usuario
          </div>
        </div>
      </small>
    </Alert>
  }

  return (
    <InputGroup>
      <InputGroup.Text>
        <PlusCircle
          style={{ cursor: "pointer" }}
        />
      </InputGroup.Text>
      <Form.Select {...props}>
        <option value={"undefined"} selected disabled>
          Tipo
        </option>
        {data?.userTypes.map(({ id, name }: UserType) => (
          <option
            value={id}
            key={crypto.randomUUID()}
          >
            {name}
          </option>
        ))}
      </Form.Select>
    </InputGroup>
  );
};

const FormCreateUser: React.FC<FormCreateUserProps> = ({ user }) => {
  const [showEditUserType, setShowEditUserType] = useState(false);
  const [userType, setUserType] = useState("");
  const { createUserType } = useFetchCreateUserType();
  const { createUser } = useFetchCreateUser();

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: user,
    resolver: yupResolver<Omit<User, 'id' | 'connection' | 'createdAt'>>(yup.object({
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
      type: yup.object({
        id: yup.string().required(),
        name: yup.string().required('el nombre del tipo es un campo requerido')
      }).required('El tipo es un campo requerdio'),
      status: yup.string().required("El usuario debe tener un estado"),
    })),
  });
  const [updateUser] = useCustomMutation<
    { user: User },
    { input: { username: string, data: Omit<User, 'id' | 'connection' | 'createdAt'> } }
  >(UDPATE_USER_MUTATION, {
    onSuccess({ user: { username } }) {
      customSwalSuccess(
        mutationMessages.UPDATE_USER.title,
        mutationMessages.UPDATE_USER.getSuccessMessage(username)
      );
    },
    onError(error) {
      customSwalError(
        error,
        "Ocurrio un error al intentar actualizar el usuario",
      );
    },
  });

  const handleSetCredentials = () => {
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
  };

  const submit = (data: Omit<User, 'id' | 'connection' | 'createdAt'>) => {
    if (user) {
      updateUser({
        input: {
          username: user.username,
          data
        },
      });
    } else {
      createUser({
        input: data,
      });
    }
    reset();
  };

  return (
    <Row>
      <Col xs={12} md={5}>
        <Form
          className="row g-3 position-absolute top-50 start-50 translate-middle"
          onSubmit={handleSubmit(submit)}
        >
          <Col xs={7}>
            <Form.Group>
              <Form.Label>Nombres</Form.Label>
              <div className="input-wrapper position-relative">
                <Form.Control
                  placeholder="Nombres"
                  {...register("names")}
                  onKeyDown={(e) => e.key === "Enter" && handleSetCredentials()}
                  autoComplete="off"
                />
                {!user && (
                  <CheckCircle
                    role="button"
                    className="position-absolute top-50 end-0 translate-middle img-fluid"
                    onClick={handleSetCredentials}
                  />
                )}
              </div>
              <Error>{errors.names?.message}</Error>
            </Form.Group>
          </Col>
          <Col xs={5}>
            <Form.Group>
              <Form.Label>Tipo</Form.Label>
              {showEditUserType ? (
                <div className="input-wrapper position-relative">
                  <InputGroup>
                    <InputGroup.Text>
                      <XCircle
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowEditUserType(false)}
                      />{" "}
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Tipo"
                      autoComplete="off"
                      value={userType}
                      onChange={(e) => setUserType(e.target.value)}
                      className="bg-success-subtle"
                    />
                    <CheckCircle
                      role="button"
                      className="position-absolute top-50 end-0 translate-middle img-fluid"
                      onClick={() => {
                        if (userType.length !== 0) {
                          createUserType({
                            input: {
                              name: userType[0]
                                .toUpperCase()
                                .concat(userType.slice(1)),
                            },
                          });
                          setUserType("");
                        } else {
                          const Toast = Swal.mixin({
                            toast: true,
                            position: "top",
                            showConfirmButton: false,
                            timer: 3500,
                            timerProgressBar: true,
                            didOpen: (toast: HTMLElement) => {
                              toast.addEventListener(
                                "mouseenter",
                                Swal.stopTimer,
                              );
                              toast.addEventListener(
                                "mouseleave",
                                Swal.resumeTimer,
                              );
                            },
                          });

                          Toast.fire({
                            icon: "warning",
                            title: "No se puede crear un tipo sin nombre",
                          });
                        }
                      }}
                    />
                  </InputGroup>
                </div>
              ) : (
                <Controller
                  name="type.name"
                  control={control}
                  render={({ field }) => (
                    <SelectUserType
                      {...field}
                    />
                  )}
                />
              )}
              <Error>{errors.type?.name?.message}</Error>
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
          <Col xs={12} md={6}>
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
          <Col xs={12} md={4}>
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
          <Col xs={12} md={4}>
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
          <Col>
            <Form.Group>
              <Form.Label>Estado del usuario</Form.Label>
              <div className="d-flex flex-row justify-content-around border border-1 p-1 rounded-2">
                {Object.entries(status).map(([key, value]) => (
                  <Form.Check
                    {...register("status")}
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

          <Col xs={12}>
            <Button
              className="float-end w-100 text-white"
              type="submit"
              variant="success"
              disabled={showEditUserType}
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
