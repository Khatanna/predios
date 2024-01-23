import { Clipboard, ClipboardCheck } from "react-bootstrap-icons";
import { Tooltip } from "../Tooltip";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export type CustomClipboardProps = {
  text: string;
};

const CustomClipboard: React.FC<CustomClipboardProps> = ({ text }) => {
  const [copy, setCopy] = useState(false);

  useEffect(() => {
    const clock = setTimeout(() => {
      if (copy) {
        setCopy(false);
      }
    }, 3000);

    return () => {
      clearTimeout(clock);
    };
  }, [copy]);

  if (copy) {
    return <ClipboardCheck color="green" />;
  }

  return (
    <Tooltip label="Copiar en el portapapeles">
      <Clipboard
        role="button"
        color="blue"
        onClick={() => {
          setCopy(() => {
            navigator.clipboard.writeText(text).then(() => {
              toast.success("Se ha copiado el texto en el portapales");
            });

            return true;
          });
        }}
      />
    </Tooltip>
  );
};

export default CustomClipboard;
