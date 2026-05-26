import { prisma } from "./client.js";
import { decryptSubdivisionId, encryptSubdivisionId } from "./crypto.js";

export async function getFavoriteSubdivisionId(
  userId: string
): Promise<string | null> {
  const fav = await prisma.userFavorite.findUnique({ where: { userId } });
  if (!fav) return null;
  return decryptSubdivisionId(fav.subdivisionId);
}

export async function upsertFavoriteSubdivisionId(
  userId: string,
  subdivisionId: string
): Promise<void> {
  const enc = encryptSubdivisionId(subdivisionId);
  await prisma.userFavorite.upsert({
    where: { userId },
    update: { subdivisionId: enc },
    create: { userId, subdivisionId: enc },
  });
}

export async function deleteFavorite(userId: string): Promise<number> {
  const r = await prisma.userFavorite.deleteMany({ where: { userId } });
  return r.count;
}
