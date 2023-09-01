import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
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
import { useAxios } from "../../../../hooks";
import { Error } from "../../../Login/styled-components/Error";
import type { User, UserType } from "../../models/types";
import { useFetchCreateUserType, useFetchCreateUser, useFetchUpdateUser } from "../../hooks";
import { Role } from "../../../../types.d";

export interface FormCreateUserProps {
  user?: Omit<User, 'createdAt'>;
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
  typeId: yup.string().required("El tipo es requerido").required(),
  status: yup.string().required("El usuario debe tener un estado").required()
});

const TypeOptions = ({ typeId }: { typeId?: string }) => {
  const axios = useAxios();
  const { data } = useQuery(["getAllTypes"], async () => {
    return axios.post("/", {
      query: `{
				userTypes: getAllUserTypes {
          id
					name
				}
			}`,
    });
  });

  return (
    <>
      {data?.data.data.userTypes.map(({ id, name }: UserType) => (
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
  const usernameLocal = user ? user.username : '';
  const { createUserType } = useFetchCreateUserType();
  const { updateUser } = useFetchUpdateUser();
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
      password: user ? 'Inra12345' : '',
      status: "ENABLE",
      role: Role.USER,
      typeId: '',
      ...user,
    },
    resolver: yupResolver(schema),
  });

  const handleSetCredentials = () => {
    const [secondLastName, firstLastName, ...names] = getValues("names")
      .trim()
      .toLocaleLowerCase()
      .split(/\s/)
      .map((w) => w[0].toUpperCase().concat(w.slice(1)))
      .reverse();
    setValue("names", names.reverse().join(" "));
    setValue("firstLastName", firstLastName, { shouldValidate: true });
    setValue("secondLastName", secondLastName, { shouldValidate: true });
    setValue(
      "username",
      names[0].concat(".", firstLastName).toLocaleLowerCase(),
      { shouldValidate: true },
    );
    setValue("password", "Inra12345", { shouldValidate: true });
  };

  const submit = (data: User) => {
    if (user) {
      updateUser({
        input: {
          username: usernameLocal, data
        }
      });
    } else {
      createUser({
        input: data
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
          <Col xs={user ? 9 : 12}>
            <Form.Group>
              <Form.Label>Nombres</Form.Label>
              <div className="input-wrapper position-relative">
                <Form.Control
                  placeholder="Nombres"
                  {...register("names")}
                  onKeyDown={(e) => e.key === "Enter" && handleSetCredentials()}
                  autoComplete="off"
                />
                <CheckCircle
                  role="button"
                  className="position-absolute top-50 end-0 translate-middle img-fluid"
                  onClick={handleSetCredentials}
                />
              </div>
              <Error>{errors.names?.message}</Error>
            </Form.Group>
          </Col>
          {user && (
            <Col xs={3}>
              <Form.Group>
                <Form.Label>Estado</Form.Label>
                <Form.Select placeholder="Nombres" {...register("status")}>
                  {["ENABLE", "DISABLE"].map((s) => (
                    <option value={s} selected={user.status === s} key={crypto.randomUUID()}>
                      {s === "ENABLE" ? "Habilitado" : "Deshabilitado"}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          )}
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
                            }
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
                    <TypeOptions typeId={user?.typeId} />
                  </Form.Select>
                </InputGroup>
              )}
              <Error>{errors.typeId?.message}</Error>
            </Form.Group>
          </Col>
          <Col xs={12}>
            <Button
              className="float-end w-100"
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
