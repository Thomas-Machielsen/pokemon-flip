import type { Meta, StoryObj } from "@storybook/react";
import vulpixData from "../../mock/vulpix.json";
import { CardGrid } from "./";

const meta: Meta<typeof CardGrid> = {
  title: "Components/CardGrid",
  component: CardGrid,
};

export default meta;
type Story = StoryObj<typeof CardGrid>;

const vulpixCard = {
  id: vulpixData.id,
  name: vulpixData.name,
  type: vulpixData.types[0].type.name,
  artwork: vulpixData.sprites.other["official-artwork"].front_shiny,
};

export const FiveVulpixes: Story = {
  args: {
    cards: Array(5).fill(vulpixCard),
  },
};
