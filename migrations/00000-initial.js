/** @param {import('postgres').Sql} sql */
export async function up(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY, 
      post_slug TEXT NOT NULL UNIQUE, 
      likes INTEGER NOT NULL DEFAULT 0
    );
`;
}

/** @param {import('postgres').Sql} sql */
export async function down(sql) {
  await sql`
    DROP TABLE IF EXISTS posts
`;
}
