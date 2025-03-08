import type { Meta, StoryObj } from "@storybook/react";
import vulpixData from "../../mock/vulpix.json";
import { Card } from "./";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Vulpix: Story = {
  args: {
    id: vulpixData.id,
    name: vulpixData.name,
    type: vulpixData.types[0].type.name,
    artwork: vulpixData.sprites.other["official-artwork"].front_shiny,
  },
};
