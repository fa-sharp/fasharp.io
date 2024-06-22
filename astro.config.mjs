import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import preact from "@astrojs/preact";
import remarkGFM from "remark-gfm";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
import icon from "astro-icon";
import svelte from "@astrojs/svelte";

import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  output: "server",
  experimental: {
    actions: true,
  },
  security: {
    checkOrigin: true,
  },
  site: "https://fasharp.io",
  markdown: {
    remarkPlugins: [remarkGFM],
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
