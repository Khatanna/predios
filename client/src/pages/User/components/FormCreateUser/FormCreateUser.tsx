import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import {
  ArrowLeftCircle,
  CheckCircle,
  PlusCircle,
  XCircle,
} from "react-bootstrap-icons";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as yup from "yup";
import { Error } from "../../../Login/styled-components/Error";
import type { User, UserType } from "../../models/types";
import {
  useFetchCreateUserType,
  useFetchCreateUser,
  useFetchUpdateUser,
} from "../../hooks";
import { customSwalError } from "../../../../utilities/alerts";
import { useCustomQuery } from "../../../../hooks/useCustomQuery";
import { status } from "../../../../utilities/constants";

export interface FormCreateUserProps {
  user?: Omit<User, "type" | "createdAt" | "permissions">;
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
  typeId: yup.string().required("El tipo es requerido"),
  status: yup.string().required("El usuario debe tener un estado"),
});

const GET_ALL_USER_TYPES_QUERY = `{
  userTypes: getAllUserTypes {
    id
    name
  }
}`;

const TypeOptions = ({ typeId }: { typeId?: string }) => {
  const { data } = useCustomQuery<{ userTypes: UserType[] }>(
    GET_ALL_USER_TYPES_QUERY,
    ["getAllUserTypes"],
  );

  return (
    <>
      {data?.userTypes.map(({ id, name }: UserType) => (
        <option
          value={id}
          key={crypto.randomUUID()}
          selected={!!typeId && typeId === id}
        >
          {name}
        </option>
      ))}
    </>
  );
};

const FormCreateUser: React.FC<FormCreateUserProps> = ({ user }) => {
  const navigate = useNavigate();
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
    formState: { errors },
  } = useForm({
    defaultValues: {
      names: "",
      firstLastName: "",
      secondLastName: "",
      username: "",
      password: user ? "Inra12345" : "",
      status: "ENABLE",
      typeId: "",
      ...user,
    },
    resolver: yupResolver(schema),
  });
  const { updateUser } = useFetchUpdateUser(setValue);

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

  const submit = (data: Omit<User, "type" | "createdAt" | "permissions">) => {
    if (user) {
      updateUser({
        input: {
          username: user.username,
          data,
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
        <ArrowLeftCircle
          size={"24"}
          title="Volver"
          color="green"
          onClick={() => navigate(-1)}
          role="button"
          className="my-2"
        />
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
              <Form.Label>Estado del usuario</Form.Label>
              <div className="d-flex flex-row gap-3 justify-content-between border border-1 p-1 rounded-2">
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
          <Col xs={12} md={4}>
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
                <InputGroup>
                  <InputGroup.Text>
                    <PlusCircle
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowEditUserType(true)}
                    />
                  </InputGroup.Text>
                  <Form.Select {...register("typeId")} autoComplete="off">
                    <option value={""} selected disabled>
                      Tipo
                    </option>
                    <TypeOptions typeId={getValues("typeId")} />
                  </Form.Select>
                </InputGroup>
              )}
              <Error>{errors.typeId?.message}</Error>
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
