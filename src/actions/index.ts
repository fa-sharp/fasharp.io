import { ActionError, defineAction, z } from "astro:actions";
import { getEntry } from "astro:content";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { addReaction, getPostData, removeReaction } from "src/database";

const rateLimiter = new RateLimiterMemory({
  points: 60,
  duration: 60,
});

export const server = {
  like: defineAction({
    input: z.object({
      like: z.boolean(),
      type: z.enum(["likes", "flames", "rockets", "coffee", "notes"]),
      postSlug: z
        .string()
        .refine(
          async (s) => Boolean(await getEntry("blog", s)),
          "Post not found!"
        ),
    }),
    async handler({ like, type, postSlug }, ctx) {
      try {
        await rateLimiter.consume(ctx.clientAddress);
      } catch {
        throw new ActionError({
          message: "Slow down!",
          code: "TOO_MANY_REQUESTS",
        });
      }
      if (like) {
        return { data: await addReaction(postSlug, type) };
      } else {
        return { data: await removeReaction(postSlug, type) };
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
