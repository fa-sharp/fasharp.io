import { useSignal, useSignalEffect } from "@preact/signals";
import { actions } from "astro:actions";
import { Coffee, Flame, Heart, Music3, Rocket } from "lucide-preact";
import type { ReactNode } from "preact/compat";
import { useCallback } from "preact/hooks";
import type { PostReactionData, PostReactionType } from "src/database";

import styles from "./BlogPostReactions.module.css";

export default function BlogPostReactions({ postSlug }: { postSlug: string }) {
  const userReactions = useSignal<Record<PostReactionType, boolean>>({
    flames: false,
    likes: false,
    rockets: false,
    coffee: false,
    notes: false,
  });
  const postReactions = useSignal<PostReactionData | null>(null);

  // fetch post reactions
  useSignalEffect(() => {
    actions.getPostData({ postSlug }).then(({ data }) => {
      postReactions.value = data?.data || {
        flames: 0,
        likes: 0,
        rockets: 0,
        coffee: 0,
        notes: 0,
      };
    });
  });

  // fetch user's reactions from local storage
  useSignalEffect(() => {
    const storedUserReactions: Partial<Record<PostReactionType, boolean>> = JSON.parse(
      localStorage.getItem(`${postSlug}-reactions`) || "{}"
    );
    userReactions.value = {
      likes: storedUserReactions.likes ?? false,
      flames: storedUserReactions.flames ?? false,
      rockets: storedUserReactions.rockets ?? false,
      coffee: storedUserReactions.coffee ?? false,
      notes: storedUserReactions.notes ?? false,
    };
  });

  // sync user's reactions to local storage
  useSignalEffect(() => {
    localStorage.setItem(`${postSlug}-reactions`, JSON.stringify(userReactions.value));
  });

  const onReaction = useCallback(
    (type: PostReactionType) => {
      const isLiked = !userReactions.peek()[type];

      userReactions.value = {
        ...userReactions.peek(),
        [type]: isLiked,
      };
      const currentReactions = postReactions.peek();
      if (currentReactions) {
        postReactions.value = {
          ...currentReactions,
          [type]: currentReactions[type] + (isLiked ? 1 : -1),
        };
      }

      actions.like({ postSlug, like: isLiked, type }).then(({ data, error }) => {
        if (data) postReactions.value = data.data;
        if (error) console.error("Error adding reaction:", error);
      });
    },
    [postSlug]
  );

  return (
    <ul className={styles.reactions} aria-label="reaction buttons">
      <li>
        <Reaction
          onClick={() => onReaction("likes")}
          title={userReactions.value.likes ? "unlike" : "like"}
          ariaLabel={userReactions.value.likes ? "unlike this post" : "like this post"}
          icon={
            <Heart
              aria-hidden
              color="magenta"
              fill={userReactions.value.likes ? "magenta" : "transparent"}
            />
          }
          numReactions={postReactions.value?.likes}
        />
      </li>
      <li>
        <Reaction
          onClick={() => onReaction("flames")}
          title={userReactions.value.flames ? "remove flame" : "add flame"}
          ariaLabel={
            userReactions.value.flames
              ? "remove flame reaction from this post"
              : "add flame reaction to this post"
          }
          icon={
            <Flame
              aria-hidden
              color="darkorange"
              fill={userReactions.value.flames ? "darkorange" : "transparent"}
            />
          }
          numReactions={postReactions.value?.flames}
        />
      </li>
      <li>
        <Reaction
          title={userReactions.value.rockets ? "remove rocket" : "add rocket"}
          ariaLabel={
            userReactions.value.rockets
              ? "remove rocket reaction from this post"
              : "add rocket reaction to this post"
          }
          icon={
            <Rocket
              aria-hidden
              color="red"
              fill={userReactions.value.rockets ? "red" : "transparent"}
            />
          }
          numReactions={postReactions.value?.rockets}
          onClick={() => onReaction("rockets")}
        />
      </li>
      <li>
        <Reaction
          title={userReactions.value.coffee ? "remove coffee" : "add coffee"}
          ariaLabel={
            userReactions.value.coffee
              ? "remove coffee reaction from this post"
              : "add coffee reaction to this post"
          }
          icon={
            <Coffee
              aria-hidden
              fill={userReactions.value.coffee ? "#c65959" : "transparent"}
              color="#c65959"
              size={26}
            />
          }
          numReactions={postReactions.value?.coffee}
          onClick={() => onReaction("coffee")}
        />
      </li>
      <li>
        <Reaction
          title={userReactions.value.notes ? "remove note" : "add note"}
          ariaLabel={
            userReactions.value.notes
              ? "remove note reaction from this post"
              : "add note reaction to this post"
          }
          icon={
            <Music3
              aria-hidden
              color="#1e90ff"
              fill={userReactions.value.notes ? "#1e90ff" : "transparent"}
            />
          }
          numReactions={postReactions.value?.notes}
          onClick={() => onReaction("notes")}
        />
      </li>
    </ul>
  );
}

const Reaction = ({
  icon,
  numReactions,
  ariaLabel,
  title,
  onClick,
}: {
  icon: ReactNode;
  numReactions?: number;
  ariaLabel: string;
  title: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    title={title}
    aria-label={`${ariaLabel} (${numReactions} total reactions)`}
    className={styles.iconButton}
  >
    {icon}
    {numReactions}
  </button>
);
