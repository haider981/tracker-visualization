const { PrismaClient } = require("@prisma/client");

const globalForPrisma = globalThis;

/** @param {string} urlString */
function poolingDatabaseUrl(urlString) {
  if (!urlString || typeof urlString !== "string") return urlString;
  if (urlString.startsWith("prisma+")) return urlString;

  let parsed;
  try {
    parsed = new URL(urlString);
  } catch {
    return urlString;
  }

  // Optional override. If not set, keep DATABASE_URL value.
  const explicit = process.env.DATABASE_CONNECTION_LIMIT?.trim();
  if (explicit && /^\d+$/.test(explicit) && explicit !== "0") {
    parsed.searchParams.set("connection_limit", explicit);
  }

  // Optional override. If not set, keep DATABASE_URL value.
  const poolTimeout = process.env.DATABASE_POOL_TIMEOUT?.trim();
  if (poolTimeout && /^\d+$/.test(poolTimeout)) {
    parsed.searchParams.set("pool_timeout", poolTimeout);
  }

  return parsed.toString();
}

const databaseUrl =
  poolingDatabaseUrl(process.env.DATABASE_URL) ?? process.env.DATABASE_URL;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error", "warn"],
    datasources: {
      db: { url: databaseUrl },
    },
  });

globalForPrisma.prisma = prisma;

module.exports = prisma;
