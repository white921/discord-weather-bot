import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import type { Subdivision } from "../data/regions.js";
import type { ForecastRange, OpenMeteoResponse } from "./openMeteo.js";

const WMO: Record<number, { label: string; emoji: string }> = {
  0: { label: "快晴", emoji: "☀️" },
  1: { label: "晴れ", emoji: "🌤️" },
  2: { label: "薄曇り", emoji: "⛅" },
  3: { label: "曇り", emoji: "☁️" },
  45: { label: "霧", emoji: "🌫️" },
  48: { label: "霧氷", emoji: "🌫️" },
  51: { label: "霧雨(弱)", emoji: "🌦️" },
  53: { label: "霧雨", emoji: "🌦️" },
  55: { label: "霧雨(強)", emoji: "🌧️" },
  61: { label: "雨(弱)", emoji: "🌦️" },
  63: { label: "雨", emoji: "🌧️" },
  65: { label: "雨(強)", emoji: "🌧️" },
  71: { label: "雪(弱)", emoji: "🌨️" },
  73: { label: "雪", emoji: "❄️" },
  75: { label: "雪(強)", emoji: "❄️" },
  80: { label: "にわか雨", emoji: "🌦️" },
  81: { label: "にわか雨(強)", emoji: "🌧️" },
  82: { label: "豪雨", emoji: "⛈️" },
  85: { label: "にわか雪", emoji: "🌨️" },
  86: { label: "にわか雪(強)", emoji: "❄️" },
  95: { label: "雷雨", emoji: "⛈️" },
  96: { label: "雷雨+雹", emoji: "⛈️" },
  99: { label: "激しい雷雨", emoji: "⛈️" },
};

function wmo(code: number) {
  return WMO[code] ?? { label: `code ${code}`, emoji: "❔" };
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  const wd = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
  return `${d.getMonth() + 1}/${d.getDate()}(${wd})`;
}

function fmtHour(iso: string): string {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, "0")}:00`;
}

export function buildForecastEmbed(
  sub: Subdivision,
  range: ForecastRange,
  data: OpenMeteoResponse
): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle(`🌤️ ${sub.name} の天気予報`)
    .setColor(0x4a90e2)
    .setTimestamp(new Date());

  if (range === "today" && data.hourly) {
    const dayInfo = wmo(data.daily.weather_code[0]);
    embed.setDescription(
      `**今日 ${fmtDate(data.daily.time[0])}** — ${dayInfo.emoji} ${dayInfo.label}\n` +
        `最高 ${data.daily.temperature_2m_max[0]}℃ / 最低 ${data.daily.temperature_2m_min[0]}℃ / 降水確率 ${data.daily.precipitation_probability_max[0] ?? 0}%`
    );

    const now = new Date();
    const lines: string[] = [];
    for (let i = 0; i < data.hourly.time.length; i += 3) {
      const t = new Date(data.hourly.time[i]);
      if (t < now) continue;
      const w = wmo(data.hourly.weather_code[i]);
      lines.push(
        `${fmtHour(data.hourly.time[i])} ${w.emoji} ${data.hourly.temperature_2m[i]}℃ / 降水 ${data.hourly.precipitation_probability[i] ?? 0}%`
      );
      if (lines.length >= 8) break;
    }
    if (lines.length) {
      embed.addFields({ name: "3時間ごと", value: lines.join("\n") });
    }
  } else {
    const lines = data.daily.time.map((iso, i) => {
      const w = wmo(data.daily.weather_code[i]);
      return `**${fmtDate(iso)}** ${w.emoji} ${w.label}  ${data.daily.temperature_2m_max[i]}℃/${data.daily.temperature_2m_min[i]}℃  ☔${data.daily.precipitation_probability_max[i] ?? 0}%`;
    });
    embed.setDescription(lines.join("\n"));
  }

  embed.setFooter({ text: "Open-Meteo (Asia/Tokyo)" });
  return embed;
}

export function buildRangeButtons(
  subId: string,
  current: ForecastRange
): ActionRowBuilder<ButtonBuilder> {
  const mk = (id: ForecastRange, label: string) =>
    new ButtonBuilder()
      .setCustomId(`range:${id}:${subId}`)
      .setLabel(label)
      .setStyle(id === current ? ButtonStyle.Primary : ButtonStyle.Secondary)
      .setDisabled(id === current);
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    mk("today", "今日"),
    mk("3day", "3日間"),
    mk("7day", "7日間")
  );
}
