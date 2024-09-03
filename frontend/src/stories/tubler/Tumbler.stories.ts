import type { Meta, StoryObj } from "@storybook/react";
import Tumbler from "./Tumbler";

const meta: Meta<typeof Tumbler> = {
  component: Tumbler,
  title: "Tumbler",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const TumblerActive: Story = {
  args: {
    active: true,
    label: "Tumbler active",
    handleClick: () => null,
  },
};

export const TumblerNoActive: Story = {
  args: {
    active: false,
    label: "Tumbler no active",
    handleClick: () => null,
  },
};
