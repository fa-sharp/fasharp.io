import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.date(),
      status: z.enum(["draft", "published", "archived"], {}).default("draft"),
      tags: z.array(z.string()),
      image: z.optional(
        z.object({
          url: image(),
          alt: z.string(),
          height: z.number().optional(),
          width: z.number().optional(),
        })
      ),
    }),
});

const projectsCollection = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      link: z.string().url(),
      image: z.optional(image()),
      category: z.enum(["apps", "learning", "websites", "libraries"]),
      tools: z.array(z.string()),
    }),
});

export const collections = {
  blog: blogCollection,
  projects: projectsCollection,
};
