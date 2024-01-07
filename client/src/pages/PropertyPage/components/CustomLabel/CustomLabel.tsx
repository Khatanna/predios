import React from "react";
import { Form } from "react-bootstrap";

export type CustomLabelProps = {
  label: string;
  icon: React.ReactNode;
};

const CustomLabel: React.FC<CustomLabelProps> = ({ label, icon }) => {
  return (
    <div className="d-flex gap-1 align-items-center mb-1">
      {icon}
      <Form.Label className="text-dark fw-bolder m-0">{label}:</Form.Label>
    </div>
  );
};

export default CustomLabel;
