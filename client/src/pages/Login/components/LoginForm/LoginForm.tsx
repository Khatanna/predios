import { useState } from "react";
import { Button, Col, FloatingLabel, Form, Spinner } from "react-bootstrap";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import { useFetchLogin, useFormLogin } from "../../hooks";
import { Error } from "../../styled-components/Error";

const propsIconEye = {
  color: "black",
  role: "button",
  size: 20,
  className: "position-absolute top-50 end-0 translate-middle",
};

const LoginForm: React.FC = () => {
  const { register, handleSubmit, errors, getValues } = useFormLogin();
  const { isLoading, login } = useFetchLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  if (isLoading) {
    return <Spinner variant="primary" />;
  }

  return (
    <Col xs={11} sm={8} md={6} lg={4}>
      <h1 className="display-6 mb-3 border-bottom border-2">Iniciar sesión</h1>
      <Form
        onSubmit={handleSubmit(() => login(getValues()))}
        onKeyDown={(e) => setCapsLock(e.getModifierState("CapsLock"))}
      >
        <FloatingLabel
          controlId="floatingInputUsername"
          label="Nombre de usuario"
          className="mb-2 text-body-tertiary"
        >
          <Form.Control
            type="text"
            placeholder="username"
            {...register("username")}
            autoComplete="off"
          />
          <Error>{errors.username?.message}</Error>
        </FloatingLabel>
        <div className="input-wrapper position-relative">
          <FloatingLabel
            controlId="floatingInputPassword"
            label="Contraseña"
            className="mb-2 text-body-tertiary"
          >
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="password"
              {...register("password")}
              autoComplete="off"
            />
            {showPassword ? (
              <EyeFill
                {...propsIconEye}
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <EyeSlashFill
                {...propsIconEye}
                onClick={() => setShowPassword(true)}
              />
            )}
          </FloatingLabel>
          <Error className="mb-3">{errors.password?.message}</Error>
        </div>
        {capsLock && (
          <Error $color="#F28705">Tiene las MAYUSCULAS activadas</Error>
        )}
        <Button variant="primary" type="submit" className="float-end">
          Iniciar sesión
        </Button>
      </Form>
    </Col>
  );
};

export default LoginForm;
