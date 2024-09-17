import { useSignalEffect } from "@preact/signals";
import { actions } from "astro:actions";

export default function BlogPostViewCounter({ postSlug }: { postSlug: string }) {
  // add to view count
  useSignalEffect(() => {
    actions.view({ postSlug }).then(({ error }) => {
      if (error) console.error("Error updating view count:", error);
    });
  });

  return <div></div>;
}
