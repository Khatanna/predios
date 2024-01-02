import React from "react";
import { Form, FormControlProps } from "react-bootstrap";
import { FieldPath, RegisterOptions } from "react-hook-form";
import { Property, TUseInputSubscription } from "../../models/types";
import { PillUser } from "../../../../components/PillUser";
import { useCan } from "../../../../hooks/useCan";
import { useInputSubscription } from "../../hooks/useInputSubscription";

export type CustomInputProps = Omit<
  FormControlProps,
  keyof TUseInputSubscription
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
  const { can: canEdit, refetch } = useCan();
  const { isSelected, subscribe, username, propertyExists } =
    useInputSubscription({
      name: name,
      events: {
        onFocus() {
          const level = propertyExists ? "UPDATE" : "CREATE";

          refetch({
            variables: {
              resource: "PROPERTY",
              level,
            },
          });
        },
      },
      options,
    });
  const focusCondition = isSelected && canEdit;
  if (noWrap) {
    return (
      <Form.Control
        {...subscribe}
        autoComplete="off"
        disabled={focusCondition}
        className={focusCondition ? "border border-success" : ""}
        readOnly={!canEdit}
        {...props}
      />
    );
  }

  return (
    <div className="position-relative">
      {focusCondition && <PillUser username={username} />}
      <Form.Control
        {...subscribe}
        autoComplete="off"
        disabled={focusCondition}
        readOnly={!canEdit}
        {...props}
      />
    </div>
  );
};
export default CustomInput;
