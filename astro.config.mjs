import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import preact from "@astrojs/preact";
import svelte from "@astrojs/svelte";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
import remarkGFM from "remark-gfm";
import remarkTOC from "remark-toc";

import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  output: "server",
  security: {
    checkOrigin: true,
  },
  site: "https://fasharp.io",
  markdown: {
    remarkPlugins: [remarkGFM, remarkTOC],
    rehypePlugins: [rehypeAccessibleEmojis],
  },
  integrations: [
    preact(),
    svelte(),
    icon({
      include: {
        "fa6-regular": ["*"],
        "fa6-brands": ["*"],
        "fa6-solid": ["*"],
      },
    }),
    expressiveCode(),
    mdx(),
  ],
  adapter: node({
    mode: "standalone",
  }),
});
