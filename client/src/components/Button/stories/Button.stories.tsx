import type { Meta, StoryObj } from "@storybook/react";
import { X, PersonAdd } from "react-bootstrap-icons";
import { withKnobs, select, boolean } from "@storybook/addon-knobs";
import { Color } from "react-bootstrap/types";
import { Button as MyButton } from "..";
import { ButtonVariant, Rounded } from "../Button";

const colors: Color[] = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "info",
  "dark",
  "light",
  "white",
  "muted",
];

const buttonVariants: ButtonVariant[] = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "info",
  "light",
  "dark",
  "link",
  "outline-primary",
  "outline-secondary",
  "outline-success",
  "outline-danger",
  "outline-warning",
  "outline-info",
  "outline-light",
  "outline-dark",
];

const roundeds: Rounded[] = ["pill", "rounded", "circle", "none"];

const meta = {
  title: "Example/Button",
  component: MyButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [withKnobs],
  argTypes: {
    leading: {
      options: ["none", "personAdd", "x"],
      mapping: {
        none: undefined,
        personAdd: <PersonAdd />,
        x: <X />,
      },
    },
    trailing: {
      options: ["none", "personAdd", "x"],
      mapping: {
        none: undefined,
        personAdd: <PersonAdd />,
        x: <X />,
      },
    },
  },
} satisfies Meta<typeof MyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Button: Story = {
  args: {
    children: "Button",
    variant: select("variant", buttonVariants, "primary"),
    bold: boolean("bold", false),
    rounded: select("rounded", roundeds, "none"),
  },
};
export const SecondaryButton: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
    bold: false,
  },
};

export const DarkButton: Story = {
  args: {
    children: "Dark",
    variant: "dark",
    bold: false,
  },
};
