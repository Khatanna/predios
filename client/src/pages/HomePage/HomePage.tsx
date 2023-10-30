import { useState } from "react";
import { Dropdown, DropdownProps, Stack, StackProps } from "react-bootstrap";
import {
  ThreeDotsVertical,
  Activity,
  Airplane,
  IconProps,
  Icon,
} from "react-bootstrap-icons";
export type HomeProps = {};

type DropdownItemProps = typeof Dropdown.Item.defaultProps;
type DropdownItemComposedProps = {
  item: [string, DropdownItemProps?];
  icon: [Icon, IconProps?];
};

const items: DropdownItemComposedProps[] = [
  {
    item: ["Crear"],
    icon: [
      Activity,
      {
        color: "red",
      },
    ],
  },
  {
    item: ["Editar"],
    icon: [
      Airplane,
      {
        color: "green",
      },
    ],
  },
];

const useItemsDropdown = (items: DropdownItemComposedProps[]) => {
  const [currentItems, setCurrentItems] = useState(items);

  const addHandlers = (handlers: { onClick: () => void }): void => {
    console.log("añadiendo handlers");
    setCurrentItems((items) => {
      return items.map((item) => ({
        ...item,
        item: [item.item[0], { ...item.item[1], onClick: handlers.onClick }],
      }));
    });
  };

  const deleteHandlers = (): void => {
    setCurrentItems((items) => {
      return items.map((item) => ({
        ...item,
        item: [item.item[0], { ...item.item[1], onClick: undefined }],
      }));
    });
  };
  return { items: currentItems, addHandlers, deleteHandlers };
};

const DropdownItem: React.FC<DropdownItemComposedProps & StackProps> = ({
  item: [label, itemProps],
  icon: [Icon, iconProps],
  ...stackProps
}) => {
  return (
    <Dropdown.Item {...itemProps}>
      <Stack {...stackProps}>
        <div>{label}</div>
        <Icon {...iconProps} />
      </Stack>
    </Dropdown.Item>
  );
};

const Drop: React.FC<
  Omit<DropdownProps, "children"> & { items: typeof items }
> = ({ items, ...props }) => {
  return (
    <Dropdown {...props}>
      <Dropdown.Toggle as={ThreeDotsVertical} role="button" variant="link" />
      <Dropdown.Menu>
        {items.map(({ item, icon }) => (
          <DropdownItem
            item={item}
            icon={icon}
            gap={2}
            direction={"horizontal"}
            key={crypto.randomUUID()}
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const HomePage: React.FC<HomeProps> = ({}) => {
  const { addHandlers, deleteHandlers, items: data } = useItemsDropdown(items);
  return (
    <>
      Dropdown
      <Drop items={data} />
      <button
        onClick={() =>
          addHandlers({
            onClick: () => {
              alert("handler");
            },
          })
        }
      >
        Añadir handlers
      </button>
      <button onClick={() => deleteHandlers()}>Quitar handlers</button>
    </>
  );
};

export default HomePage;
