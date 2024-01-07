import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";

export type ShowPasswordProps = {
  show: boolean;
  onClick: () => void;
};

const iconEyeProps = {
  color: "black",
  role: "button",
  size: 20,
  className: "position-absolute top-50 end-0 translate-middle bg-white",
};

const ShowPassword: React.FC<ShowPasswordProps> = ({ show, onClick }) => {
  if (show) {
    return <EyeFill {...iconEyeProps} onClick={onClick} />;
  }

  return <EyeSlashFill {...iconEyeProps} onClick={onClick} />;
};

export default ShowPassword;
