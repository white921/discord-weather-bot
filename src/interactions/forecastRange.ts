import { ButtonInteraction } from "discord.js";
import { findSubdivision } from "../data/regions.js";
import { fetchForecast, type ForecastRange } from "../weather/openMeteo.js";
import { buildForecastText, buildRangeButtons } from "../weather/formatter.js";

export async function handleRangeButton(interaction: ButtonInteraction) {
  const [, range, subId] = interaction.customId.split(":") as [
    "range",
    ForecastRange,
    string,
  ];
  const region = findSubdivision(subId);
  if (!region) {
    await interaction.update({ content: "地域が見つかりません。", components: [] });
    return;
  }
  await interaction.deferUpdate();
  try {
    const data = await fetchForecast(region.lat, region.lon, range);
    await interaction.editReply({
      content: buildForecastText(region, range, data),
      embeds: [],
      components: [buildRangeButtons(region.id, range)],
    });
  } catch (e) {
    await interaction.editReply({
      content: `予報の取得に失敗しました: ${(e as Error).message}`,
      embeds: [],
      components: [],
    });
  }
}
