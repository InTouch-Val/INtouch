import type { Meta, StoryObj } from "@storybook/react";
import FloatingAlert from "./FloatingAlert";

const meta: Meta<typeof FloatingAlert> = {
  component: FloatingAlert,
  title: "Floating Alert",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

/** Visible floating alert */
export const FloatingAlertVisible: Story = {
  args: {
    label: "Please fill in at least one question to save your diary entry",
    visible: true,
  },
};

/** Hidden floating alert */
export const FloatingAlertHidden: Story = {
  args: {
    label: "Please fill in at least one question to save your diary entry",
    visible: false,
  },
};
