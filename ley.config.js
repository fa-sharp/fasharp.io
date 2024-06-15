//@ts-check
import postgres from "postgres";

/** @type {Parameters<import('postgres')>[1]} */
export default {
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "postgres",
  host: process.env.PGHOST || "localhost",
};
