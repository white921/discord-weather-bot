import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { prisma } from "../db/client.js";
import { findSubdivision } from "../data/regions.js";
import { fetchForecast } from "../weather/openMeteo.js";
import { buildForecastText, buildRangeButtons } from "../weather/formatter.js";

export const data = new SlashCommandBuilder()
  .setName("favorite")
  .setDescription("お気に入り地域の操作")
  .addSubcommand((s) => s.setName("show").setDescription("お気に入り地域の予報を表示"))
  .addSubcommand((s) => s.setName("clear").setDescription("お気に入り解除（通知も停止）"));

export async function execute(interaction: ChatInputCommandInteraction) {
  const sub = interaction.options.getSubcommand();
  const userId = interaction.user.id;

  if (sub === "clear") {
    await prisma.userFavorite.deleteMany({ where: { userId } });
    await prisma.notifySchedule.deleteMany({ where: { userId } });
    await interaction.reply({
      content: "お気に入りを解除しました（DM 通知も停止しました）。",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const fav = await prisma.userFavorite.findUnique({ where: { userId } });
  if (!fav) {
    await interaction.reply({
      content: "お気に入りが未登録です。パネルから登録してください。",
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
  const data2 = await fetchForecast(region.lat, region.lon, "3day");
  await interaction.editReply({
    content: buildForecastText(region, "3day", data2),
    components: [buildRangeButtons(region.id, "3day")],
  });
}
