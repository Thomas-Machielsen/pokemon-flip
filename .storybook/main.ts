import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../app/**/*.stories.@(js|jsx|ts|tsx)", "../app/**/*.mdx"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],
};

export default config;
