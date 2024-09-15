import postgres from "postgres";

const sql = postgres({
  user: import.meta.env.PGUSER,
  password: import.meta.env.PGPASSWORD,
  host: import.meta.env.PGHOST,
  transform: postgres.camel,
  debug: import.meta.env.DEV
    ? (_, query, params) => {
        console.log("SQL", { query, params });
      }
    : undefined,
});

interface PostData {
  id: number;
  postSlug: string;
  views: number;
  likes: number;
  flames: number;
  rockets: number;
  coffee: number;
  notes: number;
}

export type PostReactionData = Pick<PostData, "likes" | "flames" | "rockets" | "coffee" | "notes">;
export type PostReactionType = keyof PostReactionData;

export async function getPostData(postSlug: string) {
  const [post] = await sql<[PostData | undefined]>`SELECT * FROM posts WHERE ${sql(
    "postSlug"
  )} = ${postSlug}`;

  return post || null;
}

export async function addView(postSlug: string) {
  const postData = await getPostData(postSlug);
  if (!postData) {
    const [{ views }] = await sql`INSERT INTO posts ${sql([
      { postSlug, views: 1 },
    ])} RETURNING views`;
    return views as number;
  } else {
    const [{ views }] = await sql`
      UPDATE posts
      SET views = views + 1
      WHERE ${sql("postSlug")} = ${postSlug}
      RETURNING views
    `;
    return views as number;
  }
}

export async function addReaction(postSlug: string, type: PostReactionType) {
  const postData = await getPostData(postSlug);

  if (!postData) {
    const [newReactions] = await sql<[PostReactionData]>`
      INSERT INTO posts ${sql([{ postSlug, [type]: 1 }])}
      RETURNING likes, flames, rockets, coffee, notes`;
    return newReactions;
  } else {
    const [newReactions] = await sql<[PostReactionData]>`
      UPDATE posts
      SET ${sql(type)} = ${sql(type)} + 1
      WHERE ${sql("postSlug")} = ${postSlug}
      RETURNING likes, flames, rockets, coffee, notes`;
    return newReactions;
  }
}

export async function removeReaction(postSlug: string, type: PostReactionType) {
  const [post] = await sql<[PostReactionData | undefined]>`
    UPDATE posts
    SET ${sql(type)} = ${sql(type)} - 1
    WHERE ${sql("postSlug")} = ${postSlug}
    RETURNING likes, flames, rockets, coffee, notes`;
  return post || null;
}
