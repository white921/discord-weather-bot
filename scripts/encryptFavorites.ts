import { prisma } from "../src/db/client.js";
import { encryptSubdivisionId, isEncrypted } from "../src/db/crypto.js";

async function main() {
  const rows = await prisma.userFavorite.findMany();
  let encrypted = 0;
  let skipped = 0;
  for (const row of rows) {
    if (isEncrypted(row.subdivisionId)) {
      skipped++;
      continue;
    }
    const enc = encryptSubdivisionId(row.subdivisionId);
    await prisma.userFavorite.update({
      where: { userId: row.userId },
      data: { subdivisionId: enc },
    });
    encrypted++;
  }
  console.log(
    `[encryptFavorites] done: encrypted=${encrypted} skipped=${skipped} total=${rows.length}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
