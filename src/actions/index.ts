import { ActionError, defineAction, z } from "astro:actions";
import { getEntry } from "astro:content";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { addLike, getPostData, removeLike } from "src/database";

const rateLimiter = new RateLimiterMemory({
  points: 100,
  duration: 60,
});

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
    async handler({ like, postSlug }, ctx) {
      try {
        await rateLimiter.consume(ctx.clientAddress);
      } catch {
        throw new ActionError({
          message: "Slow down!",
          code: "TOO_MANY_REQUESTS",
        });
      }
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
