import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  MessageFlags,
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

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function buttonsToRows(buttons: ButtonBuilder[]): ActionRowBuilder<ButtonBuilder>[] {
  return chunk(buttons, 5).map((row) =>
    new ActionRowBuilder<ButtonBuilder>().addComponents(...row)
  );
}

export function buildAreaButtons(mode: FlowMode): InteractionReplyOptions {
  const buttons = AREAS.map((a) =>
    new ButtonBuilder()
      .setCustomId(`region:area:${mode}:${a.id}`)
      .setLabel(a.name)
      .setStyle(ButtonStyle.Secondary)
  );
  return {
    content:
      mode === "favorite"
        ? "お気に入り登録: 地方を選んでください。"
        : "地方を選んでください。",
    components: buttonsToRows(buttons),
    flags: MessageFlags.Ephemeral,
  };
}

function buildPrefRows(mode: FlowMode, areaId: string) {
  const area = findArea(areaId);
  if (!area) return null;
  const buttons = area.prefectures.map((p) =>
    new ButtonBuilder()
      .setCustomId(`region:pref:${mode}:${p.id}`)
      .setLabel(p.name)
      .setStyle(ButtonStyle.Secondary)
  );
  return buttonsToRows(buttons);
}

function buildSubRows(mode: FlowMode, prefId: string) {
  const pref = findPrefecture(prefId);
  if (!pref) return null;
  const buttons = pref.subdivisions.map((s) =>
    new ButtonBuilder()
      .setCustomId(`region:sub:${mode}:${s.id}`)
      .setLabel(s.name)
      .setStyle(ButtonStyle.Secondary)
  );
  return buttonsToRows(buttons);
}

export async function handleRegionButton(interaction: ButtonInteraction) {
  const [, step, mode, value] = interaction.customId.split(":") as [
    "region",
    "area" | "pref" | "sub",
    FlowMode,
    string,
  ];

  if (step === "area") {
    const rows = buildPrefRows(mode, value);
    if (!rows) {
      await interaction.update({ content: "地方が見つかりません。", components: [] });
      return;
    }
    await interaction.update({
      content:
        mode === "favorite"
          ? "お気に入り登録: 都道府県を選んでください。"
          : "都道府県を選んでください。",
      components: rows,
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
    const rows = buildSubRows(mode, value)!;
    await interaction.update({
      content:
        mode === "favorite"
          ? "お気に入り登録: 地域を選んでください。"
          : "地域を選んでください。",
      components: rows,
    });
    return;
  }

  if (step === "sub") {
    await finalize(interaction, mode, value);
  }
}

async function finalize(
  interaction: ButtonInteraction,
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
