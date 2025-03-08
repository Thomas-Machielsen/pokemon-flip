import type { Preview } from "@storybook/react";
import { Bitter, Source_Sans_3 } from "next/font/google";
import React from "react";

// Import all CSS files directly
import "../app/styles/content-grid.css";
import "../app/styles/layout.css";
import "../app/styles/normalize.css";
import "../app/styles/spaces.css";
import "../app/styles/typography.css";

const bitter = Bitter({
  subsets: ["latin"],
  variable: "--font-bitter",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
});

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <div className={`${bitter.variable} ${sourceSans.variable}`}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
