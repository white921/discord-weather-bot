import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import type { SubdivisionWithPref } from "../data/regions.js";
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

function pad(s: string | number, width: number): string {
  const str = String(s);
  let visualLen = 0;
  for (const ch of str) {
    visualLen += /[　-鿿＀-￯]/.test(ch) ? 2 : 1;
  }
  return str + " ".repeat(Math.max(0, width - visualLen));
}

export function buildForecastText(
  sub: SubdivisionWithPref,
  range: ForecastRange,
  data: OpenMeteoResponse
): string {
  const title =
    sub.prefName === sub.name ? sub.name : `${sub.prefName} ${sub.name}`;
  const header = `## 🌤️ ${title} の天気予報`;

  if (range === "today" && data.hourly) {
    const dayInfo = wmo(data.daily.weather_code[0]);
    const summary =
      `### ${fmtDate(data.daily.time[0])} ${dayInfo.emoji} ${dayInfo.label}\n` +
      `最高 **${data.daily.temperature_2m_max[0]}°C** / 最低 **${data.daily.temperature_2m_min[0]}°C** / 降水確率 **${data.daily.precipitation_probability_max[0] ?? 0}%**`;

    const now = new Date();
    const rows: string[] = [];
    for (let i = 0; i < data.hourly.time.length; i += 3) {
      const t = new Date(data.hourly.time[i]);
      if (t < now) continue;
      const w = wmo(data.hourly.weather_code[i]);
      rows.push(
        `${fmtHour(data.hourly.time[i])}  ${pad(w.emoji + " " + w.label, 14)}  ${pad(data.hourly.temperature_2m[i] + "°C", 6)}  ☔ ${data.hourly.precipitation_probability[i] ?? 0}%`
      );
      if (rows.length >= 8) break;
    }
    const table = rows.length ? "```\n" + rows.join("\n") + "\n```" : "";

    return [header, "", summary, "", table, "-# 出典: Open-Meteo (Asia/Tokyo)"]
      .filter(Boolean)
      .join("\n");
  }

  const rows = data.daily.time.map((iso, i) => {
    const w = wmo(data.daily.weather_code[i]);
    const date = pad(fmtDate(iso), 10);
    const cond = pad(w.emoji + " " + w.label, 14);
    const temp = pad(`${data.daily.temperature_2m_max[i]}°C / ${data.daily.temperature_2m_min[i]}°C`, 12);
    return `${date}  ${cond}  ${temp}  ☔ ${data.daily.precipitation_probability_max[i] ?? 0}%`;
  });
  const table = "```\n" + rows.join("\n") + "\n```";

  return [header, "", table, "-# 出典: Open-Meteo (Asia/Tokyo)"].join("\n");
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
