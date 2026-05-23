import {
  ActionRowBuilder,
  ButtonInteraction,
  MessageFlags,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { prisma } from "../db/client.js";
import { findSubdivision } from "../data/regions.js";
import { fetchForecast } from "../weather/openMeteo.js";
import { buildForecastText, buildRangeButtons } from "../weather/formatter.js";
import { buildAreaButtons } from "./regionSelect.js";

export async function handlePanelButton(interaction: ButtonInteraction) {
  const action = interaction.customId.split(":")[1];
  const userId = interaction.user.id;

  if (action === "view") {
    await interaction.reply(buildAreaButtons("view"));
    return;
  }

  if (action === "fav-set") {
    await interaction.reply(buildAreaButtons("favorite"));
    return;
  }

  if (action === "fav-clear") {
    const favDeleted = await prisma.userFavorite.deleteMany({ where: { userId } });
    const notifyDeleted = await prisma.notifySchedule.deleteMany({ where: { userId } });
    await interaction.reply({
      content:
        favDeleted.count > 0
          ? notifyDeleted.count > 0
            ? "🗑️ お気に入りを削除しました（DM 通知も停止しました）。"
            : "🗑️ お気に入りを削除しました。"
          : "お気に入りは登録されていませんでした。",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  if (action === "fav-show") {
    const fav = await prisma.userFavorite.findUnique({ where: { userId } });
    if (!fav) {
      await interaction.reply({
        content: "⭐ お気に入りが未登録です。「📝 お気に入りを登録/変更」から設定してください。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const region = findSubdivision(fav.subdivisionId);
    if (!region) {
      await interaction.reply({
        content: "登録地域が見つかりません。再登録してください。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    try {
      const data = await fetchForecast(region.lat, region.lon, "today", region.tz);
      await interaction.editReply({
        content: buildForecastText(region, "today", data),
        embeds: [],
        components: [buildRangeButtons(region.id, "today")],
      });
    } catch (e) {
      await interaction.editReply({
        content: `予報の取得に失敗しました: ${(e as Error).message}`,
      });
    }
    return;
  }

  if (action === "notify-on") {
    const fav = await prisma.userFavorite.findUnique({ where: { userId } });
    if (!fav) {
      await interaction.reply({
        content: "🔔 DM 通知はお気に入り地域に対して送信します。先に「📝 お気に入りを登録/変更」してください。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const existing = await prisma.notifySchedule.findUnique({ where: { userId } });
    const defaultTime = existing
      ? `${existing.hour.toString().padStart(2, "0")}:${existing.minute.toString().padStart(2, "0")}`
      : "07:00";

    const modal = new ModalBuilder()
      .setCustomId("notify:time")
      .setTitle("DM 通知時刻 (JST)");
    const input = new TextInputBuilder()
      .setCustomId("time")
      .setLabel("HH:MM 形式 (例 07:00)")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMinLength(4)
      .setMaxLength(5)
      .setValue(defaultTime);
    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(input)
    );
    await interaction.showModal(modal);
    return;
  }

  if (action === "notify-off") {
    const deleted = await prisma.notifySchedule.deleteMany({ where: { userId } });
    await interaction.reply({
      content:
        deleted.count > 0
          ? "🔕 DM 通知を停止しました。"
          : "通知設定はありませんでした。",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
}
