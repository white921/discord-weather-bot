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
import { upsertFavoriteSubdivisionId } from "../db/favorites.js";
import { fetchForecast } from "../weather/openMeteo.js";
import { buildForecastText, buildRangeButtons, buildExternalLinks } from "../weather/formatter.js";

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

type SelectionView = {
  content: string;
  components: ActionRowBuilder<ButtonBuilder>[];
};

function withBackButton(
  rows: ActionRowBuilder<ButtonBuilder>[],
  customId: string,
  label: string = "戻る"
): ActionRowBuilder<ButtonBuilder>[] {
  return [
    ...rows,
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(customId)
        .setLabel(label)
        .setStyle(ButtonStyle.Secondary)
    ),
  ];
}

function findAreaIdByPrefecture(prefId: string): string | null {
  for (const area of AREAS) {
    if (area.prefectures.some((pref) => pref.id === prefId)) {
      return area.id;
    }
  }
  return null;
}

function buildAreaSelectionView(mode: FlowMode): SelectionView {
  const buttons = AREAS.map((a) =>
    new ButtonBuilder()
      .setCustomId(`region:area:${mode}:${a.id}`)
      .setLabel(a.name)
      .setStyle(ButtonStyle.Secondary)
  );
  buttons.push(
    new ButtonBuilder()
      .setCustomId(`intl:cont:${mode}:start`)
      .setLabel("🌍 海外")
      .setStyle(ButtonStyle.Primary)
  );
  return {
    content:
      mode === "favorite"
        ? "お気に入り登録: 地方を選んでください。"
        : "地方を選んでください。",
    components: buttonsToRows(buttons),
  };
}

export function buildAreaButtons(mode: FlowMode): InteractionReplyOptions {
  return {
    ...buildAreaSelectionView(mode),
    flags: MessageFlags.Ephemeral,
  };
}

export async function finalizeForecast(
  interaction: ButtonInteraction,
  mode: FlowMode,
  subdivisionId: string
) {
  await finalize(interaction, mode, subdivisionId);
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
    "root" | "area" | "pref" | "sub",
    FlowMode,
    string,
  ];

  if (step === "root") {
    await interaction.update(buildAreaSelectionView(mode));
    return;
  }

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
      components: withBackButton(rows, `region:root:${mode}:start`),
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
    const areaId = findAreaIdByPrefecture(value);
    if (!areaId) {
      await interaction.update({ content: "地方が見つかりません。", components: [] });
      return;
    }
    await interaction.update({
      content:
        mode === "favorite"
          ? "お気に入り登録: 地域を選んでください。"
          : "地域を選んでください。",
      components: withBackButton(rows, `region:area:${mode}:${areaId}`),
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
    await upsertFavoriteSubdivisionId(interaction.user.id, subdivisionId);
    await interaction.update({
      content: `⭐ お気に入りを **${region.name}** に設定しました。`,
      components: [],
    });
    return;
  }

  await interaction.update({ content: "予報を取得中…", components: [] });
  try {
    const data = await fetchForecast(region.lat, region.lon, "today", region.tz);
    await interaction.editReply({
      content: buildForecastText(region, "today", data),
      embeds: [],
      components: [buildRangeButtons(region.id, "today"), buildExternalLinks(region)],
    });
  } catch (e) {
    await interaction.editReply({
      content: `予報の取得に失敗しました: ${(e as Error).message}`,
      components: [],
    });
  }
}
