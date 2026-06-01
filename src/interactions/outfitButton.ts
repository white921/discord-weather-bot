import { ButtonInteraction, MessageFlags } from "discord.js";
import { findSubdivision } from "../data/regions.js";
import { fetchForecast } from "../weather/openMeteo.js";
import { buildOutfitSuggestion } from "../weather/formatter.js";

export async function handleOutfitButton(interaction: ButtonInteraction) {
  const subId = interaction.customId.slice("outfit:".length);
  const region = findSubdivision(subId);
  if (!region) {
    await interaction.reply({
      content: "地域が見つかりませんでした。",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  try {
    const data = await fetchForecast(region.lat, region.lon, "today", region.tz);
    await interaction.editReply({
      content: buildOutfitSuggestion(region, data),
    });
  } catch (e) {
    await interaction.editReply({
      content: `服装提案の取得に失敗しました: ${(e as Error).message}`,
    });
  }
}
