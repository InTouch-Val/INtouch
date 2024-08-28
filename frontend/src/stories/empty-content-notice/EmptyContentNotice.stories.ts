import type { Meta, StoryObj } from "@storybook/react";
import EmptyContentNotice from "./EmptyContentNotice";

const meta: Meta<typeof EmptyContentNotice> = {
  component: EmptyContentNotice,
  title: "Empty Content Notice",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

/** Basic Empty Content Notice */
export const BasicButtonMedium: Story = {
  args: {
    label: "The client has not shared any entries yet"
  },
};