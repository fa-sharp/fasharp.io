import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    status: z.enum(["draft", "published", "archived"], {}).default("draft"),
    tags: z.array(z.string()),
    image: z.optional(
      z.object({
        url: z.string(),
        alt: z.string(),
      })
    ),
  }),
});

export const collections = {
  blog: blogCollection,
};
