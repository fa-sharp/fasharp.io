/** @param {import('postgres').Sql} sql */
export async function up(sql) {
  await sql`
    ALTER TABLE posts
    ADD COLUMN IF NOT EXISTS views INTEGER NOT NULL DEFAULT 0;
  `;
}

/** @param {import('postgres').Sql} sql */
export async function down(sql) {
  await sql`
    ALTER TABLE posts
    DROP COLUMN IF EXISTS views;
  `;
}
