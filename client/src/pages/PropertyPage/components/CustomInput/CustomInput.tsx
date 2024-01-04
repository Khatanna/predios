import React from "react";
import { Form, FormControlProps } from "react-bootstrap";
import { FieldPath, RegisterOptions, useFormContext } from "react-hook-form";
import { PillUser } from "../../../../components/PillUser";
import { useInputSubscription } from "../../hooks/useInputSubscription";
import { Property } from "../../models/types";
import { Error } from "../../../LoginPage/styled-components/Error";

export type CustomInputProps = Omit<
  FormControlProps,
  "onBlur" | "onFocus" | "onChange"
> & {
  rows?: number;
  name: FieldPath<Property>;
  noWrap?: boolean;
  options?: RegisterOptions<Property>;
};

const CustomInput: React.FC<CustomInputProps> = ({
  name,
  options,
  noWrap = false,
  ...props
}) => {
  const { subscribe, username, isFocus } =
    useInputSubscription({
      name: name,
      options,
    });
  if (noWrap) {
    return (
      <Form.Control
        {...subscribe}
        autoComplete="off"
        className={isFocus ? "border border-success" : ""}
        {...props}
      />
    );
  }

  return (
    <div className="position-relative">
      {isFocus && <PillUser username={username} />}
      <Form.Control
        {...subscribe}
        autoComplete="off"
        {...props}
      />
      {/* <Error>{getFieldState(name).error?.message}</Error> */}
    </div>
  );
};
export default CustomInput;
