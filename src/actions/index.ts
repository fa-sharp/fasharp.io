import { defineAction, z } from "astro:actions";
import { getEntry } from "astro:content";
import { addLike, getPostData, removeLike } from "src/database";

export const server = {
  like: defineAction({
    input: z.object({
      like: z.boolean(),
      postSlug: z
        .string()
        .refine(
          async (s) => Boolean(await getEntry("blog", s)),
          "Post not found!"
        ),
    }),
    async handler({ like, postSlug }) {
      if (like) {
        return { likes: await addLike(postSlug) };
      } else {
        return { likes: await removeLike(postSlug) };
      }
    },
  }),
  getPostData: defineAction({
    input: z.object({
      postSlug: z
        .string()
        .refine(
          async (s) => Boolean(await getEntry("blog", s)),
          "Post not found!"
        ),
    }),
    async handler({ postSlug }) {
      return { data: await getPostData(postSlug) };
    },
  }),
};
