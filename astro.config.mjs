import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";
import embeds from "astro-embed/integration";

import remarkGFM from 'remark-gfm'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkGFM],
    rehypePlugins: [rehypeAccessibleEmojis]
  },
  integrations: [
    preact(),
    embeds(),
    icon({
      include: {
        "fa6-regular": ["*"],
        "fa6-brands": ["*"],
      },
    }),
    mdx(),
  ],
});
