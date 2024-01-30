import React, { useState } from "react";
import { Col, FloatingLabel, Form, Spinner } from "react-bootstrap";
import {
  CapslockFill,
  InfoCircle,
  Person,
  PersonLock,
} from "react-bootstrap-icons";
import { Tooltip } from "../../../../components/Tooltip";
import { normalizeString } from "../../../UserPage/utils/normalizeString";
import { useFetchLogin, useFormLogin } from "../../hooks";
import { FormLoginValues } from "../../models/types";
import { useRememberStore } from "../../state/useRememberStore";
import { ShowPassword } from "../ShowPassword";
import { Button } from "../../../../components/Button";

const normalizeValues = (values: FormLoginValues): FormLoginValues => {
  return {
    ...values,
    username: normalizeString(values.username),
  };
};

const LoginForm: React.FC = () => {
  const { remember, isRemember, setRemember, username } = useRememberStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    getFieldState,
    watch,
  } = useFormLogin({
    username: username ?? "",
  });

  const [login, { loading }] = useFetchLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const password = watch("password");

  if (loading) {
    return <Spinner variant="primary" />;
  }

  return (
    <Col xs={11} sm={8} md={6} lg={4}>
      <h1 className="display-6 mb-3 pb-2 border-bottom border-1 border-success ">
        Iniciar sesión
      </h1>
      <Form
        noValidate
        onSubmit={handleSubmit(async () => {
          if (isRemember) {
            remember(getValues("username"));
          }
          await login({
            variables: normalizeValues(getValues()),
          });
        })}
        onKeyDown={(e) => setCapsLock(e.getModifierState("CapsLock"))}
      >
        <FloatingLabel
          controlId="floatingInputUsername"
          label={
            <div className="d-flex gap-2 align-items-center">
              <Person color="red" fontSize={18} />
              Nombre de usuario
            </div>
          }
          className="mb-3 text-body-tertiary"
        >
          <Form.Control
            {...register("username")}
            type="text"
            isValid={getFieldState("username").isTouched && !errors.username}
            isInvalid={!!errors.username}
            placeholder="username"
            autoComplete="off"
          />
          {errors.username && (
            <Form.Control.Feedback type="invalid">
              {errors.username.message}
            </Form.Control.Feedback>
          )}
        </FloatingLabel>

        <FloatingLabel
          controlId="floatingInputPassword"
          label={
            <div className="d-flex gap-2 align-items-center">
              <PersonLock color="red" fontSize={18} />
              Contraseña{" "}
            </div>
          }
          className="mb-3 text-body-tertiary"
        >
          <Form.Control
            {...register("password")}
            isValid={getFieldState("password").isTouched && !errors.password}
            isInvalid={!!errors.password}
            type={showPassword ? "text" : "password"}
            placeholder="password"
            autoComplete="off"
          />
          {password.length >= 8 && (
            <ShowPassword
              show={showPassword}
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            />
          )}
          {errors.password && (
            <Form.Control.Feedback type="invalid">
              {errors.password.message}
            </Form.Control.Feedback>
          )}
        </FloatingLabel>
        <Form.Group className="d-flex gap-2 align-items-center">
          <Form.Check
            type="switch"
            label="Recordar más tarde"
            id={"remember"}
            checked={isRemember}
            onChange={() => {
              setRemember(!isRemember);
            }}
          />
          <Tooltip label="El sistema guardara su nombre de usuario para sesiones futuras">
            <InfoCircle color="green"></InfoCircle>
          </Tooltip>
        </Form.Group>
        {capsLock && (
          <div className="text-info d-flex gap-2">
            <CapslockFill size={20} />
            <div>
              Tiene las <b>MAYUSCULAS</b> activadas
            </div>
          </div>
        )}
        <Button
          variant="outline-primary"
          bold
          type="submit"
          className="float-end"
        >
          Iniciar sesión
        </Button>
      </Form>
    </Col>
  );
};

export default LoginForm;
