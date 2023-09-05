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

const projectsCollection = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    description: z.string(),
    link: z.string().url(),
    category: z.enum(["apps", "learning", "websites"]),
    tools: z.array(z.string()),
  }),
});

export const collections = {
  blog: blogCollection,
  projects: projectsCollection,
};
