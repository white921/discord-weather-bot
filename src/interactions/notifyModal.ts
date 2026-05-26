import { MessageFlags, ModalSubmitInteraction } from "discord.js";
import { prisma } from "../db/client.js";
import { getFavoriteSubdivisionId } from "../db/favorites.js";

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

export async function handleNotifyModal(interaction: ModalSubmitInteraction) {
  const raw = interaction.fields.getTextInputValue("time").trim();
  const m = TIME_RE.exec(raw);
  if (!m) {
    await interaction.reply({
      content: "時刻の形式が不正です。`HH:MM` (例: 07:00) で入力してください。",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  const userId = interaction.user.id;

  const favSubId = await getFavoriteSubdivisionId(userId);
  if (!favSubId) {
    await interaction.reply({
      content: "お気に入りが未登録です。先に登録してください。",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  await prisma.notifySchedule.upsert({
    where: { userId },
    update: { hour, minute, enabled: true },
    create: { userId, hour, minute, enabled: true },
  });

  await interaction.reply({
    content: `🔔 毎日 ${m[1]}:${m[2]} (JST) に DM で予報を送ります。`,
    flags: MessageFlags.Ephemeral,
  });
}
