import { prisma } from "../src/db/client.js";
import { decryptSubdivisionId, encryptSubdivisionId } from "../src/db/crypto.js";
import {
  LEGACY_SUBDIVISION_ID_MAP,
  findSubdivision,
} from "../src/data/regions.js";

const dryRun = process.argv.includes("--dry-run");

async function main() {
  const rows = await prisma.userFavorite.findMany();
  let migrated = 0;
  let skipped = 0;
  let orphaned = 0;
  const orphans: { userId: string; id: string }[] = [];

  for (const row of rows) {
    let plain: string;
    try {
      plain = decryptSubdivisionId(row.subdivisionId);
    } catch (e) {
      console.error(`[migrate] decrypt failed userId=${row.userId}:`, e);
      continue;
    }

    const remapped = LEGACY_SUBDIVISION_ID_MAP[plain];
    if (!remapped) {
      if (findSubdivision(plain)) {
        skipped++;
      } else {
        orphaned++;
        orphans.push({ userId: row.userId, id: plain });
      }
      continue;
    }

    console.log(`[migrate] ${row.userId}: ${plain} -> ${remapped}`);
    if (!dryRun) {
      const enc = encryptSubdivisionId(remapped);
      await prisma.userFavorite.update({
        where: { userId: row.userId },
        data: { subdivisionId: enc },
      });
    }
    migrated++;
  }

  console.log(
    `[migrate] done${dryRun ? " (dry-run)" : ""}: migrated=${migrated} skipped=${skipped} orphaned=${orphaned} total=${rows.length}`
  );
  if (orphans.length > 0) {
    console.warn("[migrate] orphan favorites (id does not match any subdivision):");
    for (const o of orphans) console.warn(`  userId=${o.userId} id=${o.id}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
