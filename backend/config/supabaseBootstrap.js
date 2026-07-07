const fs = require("fs");
const path = require("path");

const getSchemaSql = () => fs.readFileSync(path.join(__dirname, "..", "lib", "supabaseSchema.sql"), "utf8");

const ensureSupabaseSchema = async (logger = console) => {
  const directUrl = process.env.SUPABASE_DATABASE_URL || process.env.SUPABASE_DIRECT_URL;

  if (!directUrl) {
    logger.warn(
      "SUPABASE_DATABASE_URL/SUPABASE_DIRECT_URL is not set. Skipping automatic SQL schema bootstrap; apply backend/lib/supabaseSchema.sql in the Supabase SQL editor."
    );
    return { applied: false, reason: "missing-direct-url" };
  }

  let pg;
  try {
    pg = require("pg");
  } catch (error) {
    logger.warn("The pg package is unavailable, so the SQL schema could not be applied automatically.");
    return { applied: false, reason: "pg-unavailable" };
  }

  const client = new pg.Client({
    connectionString: directUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    await client.query(getSchemaSql());
    logger.info("Supabase schema bootstrap completed successfully.");
    return { applied: true, reason: "schema-applied" };
  } finally {
    await client.end();
  }
};

module.exports = { ensureSupabaseSchema };
