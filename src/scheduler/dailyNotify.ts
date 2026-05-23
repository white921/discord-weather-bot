import { Client } from "discord.js";
import cron from "node-cron";
import { prisma } from "../db/client.js";
import { findSubdivision } from "../data/regions.js";
import { fetchForecast } from "../weather/openMeteo.js";
import { buildForecastEmbed } from "../weather/formatter.js";

function jstNow(): { hour: number; minute: number } {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(new Date());
  const hour = Number(parts.find((p) => p.type === "hour")!.value);
  const minute = Number(parts.find((p) => p.type === "minute")!.value);
  return { hour, minute };
}

export function startScheduler(client: Client) {
  cron.schedule("* * * * *", async () => {
    const { hour, minute } = jstNow();
    const targets = await prisma.notifySchedule.findMany({
      where: { enabled: true, hour, minute },
    });
    if (targets.length > 0) {
      console.log(
        `[notify] ${hour}:${minute} JST — ${targets.length} target(s): ${targets
          .map((t) => t.userId)
          .join(", ")}`
      );
    }
    for (const t of targets) {
      try {
        const fav = await prisma.userFavorite.findUnique({
          where: { userId: t.userId },
        });
        if (!fav) {
          console.log(`[notify] ${t.userId}: no favorite, disabling`);
          await prisma.notifySchedule.update({
            where: { userId: t.userId },
            data: { enabled: false },
          });
          continue;
        }
        const region = findSubdivision(fav.subdivisionId);
        if (!region) {
          console.log(
            `[notify] ${t.userId}: region not found (subdivisionId=${fav.subdivisionId})`
          );
          continue;
        }
        console.log(`[notify] ${t.userId}: fetching forecast for ${region.name}`);
        const data = await fetchForecast(region.lat, region.lon, "3day");
        const user = await client.users.fetch(t.userId);
        await user.send({ embeds: [buildForecastEmbed(region, "3day", data)] });
        console.log(`[notify] ${t.userId}: sent`);
        await prisma.notifySchedule.update({
          where: { userId: t.userId },
          data: { lastSentAt: new Date() },
        });
      } catch (e) {
        const code = (e as { code?: number }).code;
        const isDmBlocked = code === 50007;
        console.error(
          `[notify] failed for ${t.userId} (disable=${isDmBlocked}):`,
          e
        );
        if (isDmBlocked) {
          await prisma.notifySchedule
            .update({
              where: { userId: t.userId },
              data: { enabled: false },
            })
            .catch(() => {});
        }
      }
    }
  });
  console.log("[scheduler] daily notify cron started");
}
