import {
  Button as BoostrapButton,
  ButtonProps as BoostrapButtonProps,
} from "react-bootstrap";
import classnames from "classnames";
import React from "react";

type Variant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "dark"
  | "light";
export type ButtonVariant =
  | Variant
  | "link"
  | "outline-primary"
  | "outline-secondary"
  | "outline-success"
  | "outline-danger"
  | "outline-warning"
  | "outline-info"
  | "outline-dark"
  | "outline-light";
export type Rounded = "rounded" | "pill" | "circle" | "none";
export type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  trailing?: React.ReactNode;
  leading?: React.ReactNode;
  bold?: boolean;
  rounded?: Rounded;
} & BoostrapButtonProps;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  trailing,
  leading,
  bold = false,
  rounded = "none",
  className,
  ...props
}) => {
  return (
    <BoostrapButton
      {...props}
      variant={variant}
      className={classnames(
        className,
        `rounded-${
          rounded === "none" ? "0" : rounded === "rounded" ? "1" : rounded
        } d-flex align-items-center justify-content-center gap-1 ${
          bold && "fw-bold"
        }`,
      )}
      style={{
        transition: "ease-out 300ms",
      }}
    >
      {/* {Trailing && <Trailing fontSize={24} />} */}
      {trailing}
      <div>{children}</div>
      {leading}
      {/* {Leading && <Leading fontSize={24} />} */}
    </BoostrapButton>
  );
};

export default Button;
