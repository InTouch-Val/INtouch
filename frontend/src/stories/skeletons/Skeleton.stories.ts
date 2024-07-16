import type { Meta, StoryObj } from "@storybook/react";
import Skeleton from "./Skeleton";

const meta: Meta<typeof Skeleton> = {
  component: Skeleton,
  title: "Skeleton",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

/** A skeleton for when psy's all assignments are loading */
export const PsyAllAssignments: Story = {
  args: {
    type: "assignment",
    user: "psy",
    variant: "ps-all-tasks",
  },
};

/** A skeleton for when psy's own assignments are loading */
export const PsyMyAssignments: Story = {
  args: {
    type: "assignment",
    user: "psy",
    variant: "ps-my-tasks",
  },
};

/** A skeleton for when psy shares an assignment to a client and their own assignments are loading */
export const PsyShareAssignment: Story = {
  args: {
    type: "assignment",
    user: "psy",
    variant: "ps-share-task",
  },
};

/** A skeleton for when psy watches assignment done by a client */
export const PsyClientAssignment: Story = {
  args: {
    type: "assignment",
    user: "psy",
    variant: "ps-client-tasks",
  },
};

/** A skeleton for when psy watches client's diary entry */
export const PsyClientDiary: Story = {
  args: {
    type: "diary",
    user: "psy",
  },
};
