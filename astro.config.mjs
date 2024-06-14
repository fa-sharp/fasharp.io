import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";

import remarkGFM from 'remark-gfm'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://fasharp-io.fly.dev",
  image: {
    remotePatterns: [{ protocol: "https" }],
    domains: ["docs.astro.build", "pll.harvard.edu", "images.unsplash.com", "cdn.sanity.io"]
  },
  markdown: {
    remarkPlugins: [remarkGFM],
    rehypePlugins: [rehypeAccessibleEmojis]
  },
  integrations: [
    preact(),
    icon({
      include: {
        "fa6-regular": ["*"],
        "fa6-brands": ["*"],
        "fa6-solid": ["*"]
      },
    }),
    mdx(),
  ],
});
