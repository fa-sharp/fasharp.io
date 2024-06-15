import postgres from "postgres";

const sql = postgres({
  user: import.meta.env.PGUSER || "postgres",
  password: import.meta.env.PGPASSWORD || "postgres",
  host: import.meta.env.PGHOST || "localhost",
  transform: postgres.camel,
  debug: import.meta.env.DEV,
});

interface PostData {
  id: number;
  postSlug: string;
  likes: number;
}

export async function getPostData(postSlug: string) {
  const [post] = await sql<
    [PostData | undefined]
  >`SELECT * FROM posts WHERE ${sql("postSlug")} = ${postSlug}`;

  return post || null;
}

export async function addLike(postSlug: string) {
  const postData = await getPostData(postSlug);

  if (!postData) {
    const [{ likes }] = await sql<[PostData]>`INSERT INTO posts ${sql([
      { postSlug, likes: 1 },
    ])}
    RETURNING likes`;
    return likes;
  } else {
    const [{ likes }] = await sql<[PostData]>`UPDATE posts
    SET likes = likes + 1
    WHERE ${sql("postSlug")} = ${postSlug}
    RETURNING likes`;
    return likes;
  }
}

export async function removeLike(postSlug: string) {
  const [post] = await sql<Array<PostData | undefined>>`UPDATE posts
      SET likes = likes - 1
      WHERE ${sql("postSlug")} = ${postSlug}
      RETURNING likes`;
  return post?.likes || 0;
}
