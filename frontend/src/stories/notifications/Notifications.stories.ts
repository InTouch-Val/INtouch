import { Meta, StoryObj } from "@storybook/react";
import Notifications from "./Notifications";

const meta: Meta<typeof Notifications> = {
  component: Notifications,
  title: "Notifications",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const SuccessMessage: Story = {
  args: {
    status: "success",
    messageText: "Success message",
  },
};

export const ErrorMessage: Story = {
  args: {
    status: "error",
    messageText: "Error message",
  },
};
