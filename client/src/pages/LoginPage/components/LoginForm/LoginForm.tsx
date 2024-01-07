import React, { useState } from "react";
import { Button, Col, FloatingLabel, Form, Spinner } from "react-bootstrap";
import { CapslockFill } from "react-bootstrap-icons";
import { normalizeString } from "../../../UserPage/utils/normalizeString";
import { useFetchLogin, useFormLogin } from "../../hooks";
import { FormLoginValues } from "../../models/types";
import { ShowPassword } from "../ShowPassword";

const normalizeValues = (values: FormLoginValues): FormLoginValues => {
  return {
    ...values,
    username: normalizeString(values.username),
  };
};

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    getFieldState,
    watch,
  } = useFormLogin();
  const { isLoading, login } = useFetchLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const password = watch("password");

  if (isLoading) {
    return <Spinner variant="primary" />;
  }

  return (
    <Col xs={11} sm={8} md={6} lg={4}>
      <h1 className="display-6 mb-3 pb-2 border-bottom border-3 border-success ">
        Iniciar sesión
      </h1>
      <Form
        noValidate
        onSubmit={handleSubmit(() =>
          login({ variables: normalizeValues(getValues()) }),
        )}
        onKeyDown={(e) => setCapsLock(e.getModifierState("CapsLock"))}
      >
        <FloatingLabel
          controlId="floatingInputUsername"
          label="Nombre de usuario"
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
          label="Contraseña"
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
        {capsLock && (
          <div className="text-info d-flex gap-2">
            <CapslockFill size={20} />
            <div>
              Tiene las <b>MAYUSCULAS</b> activadas
            </div>
          </div>
        )}
        <Button variant="primary" type="submit" className="float-end">
          Iniciar sesión
        </Button>
      </Form>
    </Col>
  );
};

export default LoginForm;
