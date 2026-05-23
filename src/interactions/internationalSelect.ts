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
  const buttons = found.country.cities.map((c) =>
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
    "cont" | "country" | "city" | "pick",
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
    const rows = buildCityRows(mode, value);
    if (!rows) {
      await interaction.update({ content: "国が見つかりません。", components: [] });
      return;
    }
    const found = findCountry(value)!;
    await interaction.update({
      content:
        mode === "favorite"
          ? `お気に入り登録: ${found.country.name} の都市を選んでください。`
          : `${found.country.name} の都市を選んでください。`,
      components: rows,
    });
    return;
  }

  if (step === "pick") {
    await finalizeForecast(interaction, mode, value);
  }
}
