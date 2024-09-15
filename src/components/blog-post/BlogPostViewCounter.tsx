import { useSignalEffect } from "@preact/signals";
import { actions } from "astro:actions";

export default function BlogPostViewCounter({ postSlug }: { postSlug: string }) {
  // add to view count
  useSignalEffect(() => {
    actions.view({ postSlug }).then(({ data, error }) => {
      if (error) {
        console.error("Error updating view count:", error);
      } else {
        import.meta.env.DEV && console.log({ views: data.views });
      }
    });
  });

  return <div></div>;
}
