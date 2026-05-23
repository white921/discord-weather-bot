import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  type InteractionReplyOptions,
} from "discord.js";
import {
  AREAS,
  findArea,
  findPrefecture,
  findSubdivision,
} from "../data/regions.js";
import { prisma } from "../db/client.js";
import { fetchForecast } from "../weather/openMeteo.js";
import { buildForecastEmbed, buildRangeButtons } from "../weather/formatter.js";

export type FlowMode = "view" | "favorite";

export function buildAreaSelect(mode: FlowMode): InteractionReplyOptions {
  const menu = new StringSelectMenuBuilder()
    .setCustomId(`region:area:${mode}`)
    .setPlaceholder("地方を選択")
    .addOptions(AREAS.map((a) => ({ label: a.name, value: a.id })));
  return {
    content: mode === "favorite" ? "お気に入り登録: 地方を選んでください。" : "地方を選んでください。",
    components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu)],
    ephemeral: true,
  };
}

function buildPrefSelect(mode: FlowMode, areaId: string) {
  const area = findArea(areaId);
  if (!area) return null;
  const menu = new StringSelectMenuBuilder()
    .setCustomId(`region:pref:${mode}`)
    .setPlaceholder("都道府県を選択")
    .addOptions(
      area.prefectures.slice(0, 25).map((p) => ({ label: p.name, value: p.id }))
    );
  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
}

function buildSubSelect(mode: FlowMode, prefId: string) {
  const pref = findPrefecture(prefId);
  if (!pref) return null;
  const menu = new StringSelectMenuBuilder()
    .setCustomId(`region:sub:${mode}`)
    .setPlaceholder("地域を選択")
    .addOptions(
      pref.subdivisions.map((s) => ({ label: s.name, value: s.id }))
    );
  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
}

export async function handleRegionSelect(interaction: StringSelectMenuInteraction) {
  const [, step, mode] = interaction.customId.split(":") as [
    "region",
    "area" | "pref" | "sub",
    FlowMode,
  ];
  const value = interaction.values[0];

  if (step === "area") {
    const row = buildPrefSelect(mode, value);
    if (!row) {
      await interaction.update({ content: "地方が見つかりません。", components: [] });
      return;
    }
    await interaction.update({
      content: mode === "favorite" ? "お気に入り登録: 都道府県を選んでください。" : "都道府県を選んでください。",
      components: [row],
    });
    return;
  }

  if (step === "pref") {
    const pref = findPrefecture(value);
    if (!pref) {
      await interaction.update({ content: "都道府県が見つかりません。", components: [] });
      return;
    }
    if (pref.subdivisions.length === 1) {
      await finalize(interaction, mode, pref.subdivisions[0].id);
      return;
    }
    const row = buildSubSelect(mode, value)!;
    await interaction.update({
      content: mode === "favorite" ? "お気に入り登録: 地域を選んでください。" : "地域を選んでください。",
      components: [row],
    });
    return;
  }

  if (step === "sub") {
    await finalize(interaction, mode, value);
  }
}

async function finalize(
  interaction: StringSelectMenuInteraction,
  mode: FlowMode,
  subdivisionId: string
) {
  const region = findSubdivision(subdivisionId);
  if (!region) {
    await interaction.update({ content: "地域が見つかりません。", components: [] });
    return;
  }

  if (mode === "favorite") {
    await prisma.userFavorite.upsert({
      where: { userId: interaction.user.id },
      update: { subdivisionId },
      create: { userId: interaction.user.id, subdivisionId },
    });
    await interaction.update({
      content: `⭐ お気に入りを **${region.name}** に設定しました。`,
      components: [],
    });
    return;
  }

  await interaction.update({ content: "予報を取得中…", components: [] });
  try {
    const data = await fetchForecast(region.lat, region.lon, "3day");
    await interaction.editReply({
      content: "",
      embeds: [buildForecastEmbed(region, "3day", data)],
      components: [buildRangeButtons(region.id, "3day")],
    });
  } catch (e) {
    await interaction.editReply({
      content: `予報の取得に失敗しました: ${(e as Error).message}`,
      components: [],
    });
  }
}
