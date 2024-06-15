import { useSignalEffect, useSignal, useComputed } from "@preact/signals";
import { Heart } from "lucide-preact";
import { useCallback } from "preact/hooks";
import { actions } from "astro:actions";

export default function BlogPostLike({ postSlug }: { postSlug: string }) {
  const hasLike = useSignal(false);
  const likes = useSignal<number | null>(null);

  useSignalEffect(() => {
    hasLike.value = JSON.parse(localStorage.getItem(postSlug) || "false");
    actions.getPostData({ postSlug }).then(({ data }) => {
      likes.value = data ? data.likes : 0;
    });
  });

  const fill = useComputed(() => (hasLike.value ? "red" : "transparent"));

  const onClick = useCallback(async () => {
    const isLike = !hasLike.peek();
    hasLike.value = isLike;
    likes.value = isLike ? (likes.peek() || 0) + 1 : (likes.peek() || 0) - 1;

    localStorage.setItem(postSlug, JSON.stringify(isLike));
    actions
      .like({ postSlug, like: isLike })
      .then((data) => (likes.value = data.likes));
  }, []);

  return (
    <button
      onClick={onClick}
      title={hasLike.value ? "unlike" : "like"}
      aria-label={hasLike.value ? "unlike this post" : "like this post"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        cursor: "pointer",
        background: "none",
        border: "none",
        padding: 0,
        color: "inherit",
      }}
    >
      <Heart color="red" fill={fill.value} />
      {likes}
    </button>
  );
}
