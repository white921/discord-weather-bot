import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
} from "discord.js";
import {
  INTL_CONTINENTS,
  findContinent,
  findCountry,
  findCountryGroup,
} from "../data/international.js";
import { finalizeForecast, type FlowMode } from "./regionSelect.js";

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

function buildContinentRows(mode: FlowMode) {
  const buttons = INTL_CONTINENTS.map((c) =>
    new ButtonBuilder()
      .setCustomId(`intl:country:${mode}:${c.id}`)
      .setLabel(c.name)
      .setStyle(ButtonStyle.Secondary)
  );
  return buttonsToRows(buttons);
}

function buildCountryRows(mode: FlowMode, contId: string) {
  const cont = findContinent(contId);
  if (!cont) return null;
  const buttons = cont.countries.map((c) =>
    new ButtonBuilder()
      .setCustomId(`intl:city:${mode}:${c.id}`)
      .setLabel(c.name)
      .setStyle(ButtonStyle.Secondary)
  );
  return buttonsToRows(buttons);
}

function buildCityRows(mode: FlowMode, countryId: string) {
  const found = findCountry(countryId);
  if (!found) return null;
  const buttons = (found.country.cities ?? []).map((c) =>
    new ButtonBuilder()
      .setCustomId(`intl:pick:${mode}:${c.id}`)
      .setLabel(c.name)
      .setStyle(ButtonStyle.Secondary)
  );
  return buttonsToRows(buttons);
}

function buildGroupRows(mode: FlowMode, countryId: string) {
  const found = findCountry(countryId);
  if (!found?.country.groups) return null;
  const buttons = found.country.groups.map((group) =>
    new ButtonBuilder()
      .setCustomId(`intl:group:${mode}:${countryId}__${group.id}`)
      .setLabel(group.name)
      .setStyle(ButtonStyle.Secondary)
  );
  return buttonsToRows(buttons);
}

function buildGroupedCityRows(mode: FlowMode, countryId: string, groupId: string) {
  const found = findCountryGroup(countryId, groupId);
  if (!found) return null;
  const buttons = found.group.cities.map((c) =>
    new ButtonBuilder()
      .setCustomId(`intl:pick:${mode}:${c.id}`)
      .setLabel(c.name)
      .setStyle(ButtonStyle.Secondary)
  );
  return buttonsToRows(buttons);
}

export async function handleIntlButton(interaction: ButtonInteraction) {
  // customId: intl:<step>:<mode>:<value>
  const [, step, mode, value] = interaction.customId.split(":") as [
    "intl",
    "cont" | "country" | "city" | "group" | "pick",
    FlowMode,
    string,
  ];

  if (step === "cont") {
    // entry from area panel → show continents
    await interaction.update({
      content:
        mode === "favorite"
          ? "お気に入り登録: 大陸を選んでください。"
          : "大陸を選んでください。",
      components: buildContinentRows(mode),
    });
    return;
  }

  if (step === "country") {
    const rows = buildCountryRows(mode, value);
    if (!rows) {
      await interaction.update({ content: "大陸が見つかりません。", components: [] });
      return;
    }
    await interaction.update({
      content:
        mode === "favorite"
          ? "お気に入り登録: 国を選んでください。"
          : "国を選んでください。",
      components: rows,
    });
    return;
  }

  if (step === "city") {
    const found = findCountry(value);
    if (!found) {
      await interaction.update({ content: "国が見つかりません。", components: [] });
      return;
    }

    if (found.country.groups?.length) {
      const rows = buildGroupRows(mode, value);
      if (!rows) {
        await interaction.update({ content: "地方区分が見つかりません。", components: [] });
        return;
      }
      await interaction.update({
        content:
          mode === "favorite"
            ? `お気に入り登録: ${found.country.name} の地方を選んでください。`
            : `${found.country.name} の地方を選んでください。`,
        components: rows,
      });
      return;
    }

    const rows = buildCityRows(mode, value);
    if (!rows) {
      await interaction.update({ content: "地域が見つかりません。", components: [] });
      return;
    }
    await interaction.update({
      content:
        mode === "favorite"
          ? `お気に入り登録: ${found.country.name} の地域を選んでください。`
          : `${found.country.name} の地域を選んでください。`,
      components: rows,
    });
    return;
  }

  if (step === "group") {
    const [countryId, groupId] = value.split("__");
    const found = findCountryGroup(countryId, groupId);
    const rows = buildGroupedCityRows(mode, countryId, groupId);
    if (!found || !rows) {
      await interaction.update({ content: "地方区分が見つかりません。", components: [] });
      return;
    }
    await interaction.update({
      content:
        mode === "favorite"
          ? `お気に入り登録: ${found.country.name} > ${found.group.name} の省級行政区を選んでください。`
          : `${found.country.name} > ${found.group.name} の省級行政区を選んでください。`,
      components: rows,
    });
    return;
  }

  if (step === "pick") {
    await finalizeForecast(interaction, mode, value);
  }
}
