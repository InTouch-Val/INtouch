import type { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";
import exampleIcon from "../../images/psy-icons/add-assignment-icon.svg";

const meta: Meta<typeof Button> = {
  component: Button,
  title: "Buttons",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

/** Basic button */
export const BasicButtonMedium: Story = {
  args: {
    fontSize: "medium",
    buttonSize: "large",
    label: "Button",
    disabled: false,
  },
};

/** Basic button with small font*/
export const BasicButtonSmall: Story = {
  args: {
    fontSize: "small",
    buttonSize: "large",
    label: "Button",
    disabled: false,
  },
};

/** Secondary button */
export const SecondaryButton: Story = {
  args: {
    fontSize: "medium",
    buttonSize: "small",
    label: "Button",
    disabled: false,
    icon: exampleIcon,
  },
};
