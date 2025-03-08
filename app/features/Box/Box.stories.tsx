import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "./";

const meta: Meta<typeof Box> = {
  title: "Components/Box",
  component: Box,
};

export default meta;
type Story = StoryObj<typeof Box>;

export const Content: Story = {
  render: () => (
    <div className="content-grid">
      <Box className="content" />
    </div>
  ),
};

export const Breakout: Story = {
  render: () => (
    <div className="content-grid">
      <Box className="breakout" />
    </div>
  ),
};

export const Fullwidth: Story = {
  render: () => (
    <div className="content-grid">
      <Box className="fullwidth" />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="content-grid">
      <Box className="content" />
      <Box className="breakout" />
      <Box className="fullwidth" />
    </div>
  ),
};
