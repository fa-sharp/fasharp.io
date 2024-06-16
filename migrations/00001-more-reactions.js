/** @param {import('postgres').Sql} sql */
export async function up(sql) {
  await sql`
    ALTER TABLE posts
    ADD COLUMN IF NOT EXISTS flames INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS rockets INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS coffee INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS notes INTEGER NOT NULL DEFAULT 0;
  `;
}

/** @param {import('postgres').Sql} sql */
export async function down(sql) {
  await sql`
    ALTER TABLE posts
    DROP COLUMN IF EXISTS flames,
    DROP COLUMN IF EXISTS rockets,
    DROP COLUMN IF EXISTS coffee,
    DROP COLUMN IF EXISTS notes;
  `;
}
