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

// Open-Meteo returns naive ISO strings ("2026-05-23T23:00") expressed in the
// requested timezone — without a TZ suffix. Parsing them via `new Date()`
// applies the server's local TZ (often UTC on Railway), which corrupts the
// wall-clock. We therefore parse the components by string slicing.

function fmtDate(iso: string): string {
  const y = Number(iso.slice(0, 4));
  const m = Number(iso.slice(5, 7));
  const d = Number(iso.slice(8, 10));
  // Compute weekday in UTC to keep it deterministic regardless of server TZ.
  const wd = ["日", "月", "火", "水", "木", "金", "土"][
    new Date(Date.UTC(y, m - 1, d)).getUTCDay()
  ];
  return `${m}/${d}(${wd})`;
}

function fmtHour(iso: string): string {
  return iso.slice(11, 13) + ":00";
}

function fmtWind(ms: number): string {
  return ms.toFixed(1);
}

// "Now" expressed in the location's timezone as a naive string
// ("YYYY-MM-DDTHH:MM"), comparable lexicographically against Open-Meteo's
// hourly.time entries (which are in the same TZ, also naive).
function nowInTz(tz: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
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
      `最高 **${data.daily.temperature_2m_max[0]}°C** / 最低 **${data.daily.temperature_2m_min[0]}°C** / 降水確率 **${data.daily.precipitation_probability_max[0] ?? 0}%** / 💨 **${fmtWind(data.daily.wind_speed_10m_max[0])} m/s**`;

    const nowStr = nowInTz(data.timezone);
    const rows: string[] = [];
    // Find first future hourly index, then step every 3 hours for 8 rows (24h window).
    // Compare as strings — both sides are naive wall-clock in the same TZ.
    let start = data.hourly.time.findIndex((iso) => iso >= nowStr);
    if (start < 0) start = 0;
    for (let k = 0; k < 8; k++) {
      const i = start + k * 3;
      if (i >= data.hourly.time.length) break;
      const w = wmo(data.hourly.weather_code[i]);
      rows.push(
        `${fmtHour(data.hourly.time[i])}  ${pad(w.emoji + " " + w.label, 10)}  ${pad(data.hourly.temperature_2m[i] + "°C", 6)}  ☔ ${data.hourly.precipitation_probability[i] ?? 0}%`
      );
    }
    const table = rows.length ? "```\n" + rows.join("\n") + "\n```" : "";

    return [header, "", summary, "", table, `-# 出典: Open-Meteo (${data.timezone})`]
      .filter(Boolean)
      .join("\n");
  }

  if (range === "3day" && data.hourly) {
    const rows: string[] = [];
    for (let d = 0; d < data.daily.time.length; d++) {
      const dayIso = data.daily.time[d];
      const dayStr = dayIso.slice(0, 10);
      const am = aggregateHalfDay(data.hourly, dayStr, 0, 11);
      const pm = aggregateHalfDay(data.hourly, dayStr, 12, 23);
      rows.push(`[ ${fmtDate(dayIso)} ]  💨 ${fmtWind(data.daily.wind_speed_10m_max[d])} m/s`);
      if (am) {
        const w = wmo(am.code);
        rows.push(
          `  午前  ${pad(w.emoji + " " + w.label, 10)}  ${pad(am.maxTemp + "°C", 6)}  ☔ ${am.maxPrecip}%`
        );
      }
      if (pm) {
        const w = wmo(pm.code);
        rows.push(
          `  午後  ${pad(w.emoji + " " + w.label, 10)}  ${pad(pm.maxTemp + "°C", 6)}  ☔ ${pm.maxPrecip}%`
        );
      }
      if (d < data.daily.time.length - 1) rows.push("");
    }
    const table = "```\n" + rows.join("\n") + "\n```";
    return [header, "", table, `-# 出典: Open-Meteo (${data.timezone})`].join("\n");
  }

  const rows: string[] = [];
  for (let i = 0; i < data.daily.time.length; i++) {
    const w = wmo(data.daily.weather_code[i]);
    rows.push(`[ ${fmtDate(data.daily.time[i])} ]`);
    const cond = pad(w.emoji + " " + w.label, 8);
    const temp = pad(`${data.daily.temperature_2m_max[i]}°C / ${data.daily.temperature_2m_min[i]}°C`, 12);
    rows.push(`${cond} ${temp}  ☔ ${data.daily.precipitation_probability_max[i] ?? 0}%  💨 ${fmtWind(data.daily.wind_speed_10m_max[i])} m/s`);
    if (i < data.daily.time.length - 1) rows.push("");
  }
  const table = "```\n" + rows.join("\n") + "\n```";

  return [header, "", table, `-# 出典: Open-Meteo (${data.timezone})`].join("\n");
}

function aggregateHalfDay(
  hourly: NonNullable<OpenMeteoResponse["hourly"]>,
  dayStr: string,
  fromHour: number,
  toHour: number
): { code: number; maxTemp: number; maxPrecip: number } | null {
  const idx: number[] = [];
  for (let i = 0; i < hourly.time.length; i++) {
    const t = hourly.time[i];
    if (t.slice(0, 10) !== dayStr) continue;
    const h = new Date(t).getHours();
    if (h >= fromHour && h <= toHour) idx.push(i);
  }
  if (idx.length === 0) return null;
  const maxTemp = Math.max(...idx.map((i) => hourly.temperature_2m[i]));
  const maxPrecip = Math.max(
    ...idx.map((i) => hourly.precipitation_probability[i] ?? 0)
  );
  const worstCode = idx
    .map((i) => hourly.weather_code[i])
    .reduce((a, b) => (b > a ? b : a), 0);
  return { code: worstCode, maxTemp, maxPrecip };
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
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    mk("today", "今日"),
    mk("3day", "3日間"),
    mk("7day", "7日間")
  );
  if (current === "today") {
    row.addComponents(buildOutfitButton(subId));
  }
  return row;
}

export function buildOutfitButton(subId: string): ButtonBuilder {
  return new ButtonBuilder()
    .setCustomId(`outfit:${subId}`)
    .setLabel("おすすめの服装")
    .setEmoji("👕")
    .setStyle(ButtonStyle.Secondary);
}

// Decide which daily index to suggest for: 20:00 JST 以降は翌日。
function pickOutfitDayIndex(data: OpenMeteoResponse): number {
  const hour = Number(nowInTz(data.timezone).slice(11, 13));
  if (hour >= 20 && data.daily.time.length >= 2) return 1;
  return 0;
}

function clothingByTemp(tmax: number): string {
  if (tmax >= 30) return "半袖・通気性のよい素材で。";
  if (tmax >= 26) return "半袖一枚で快適。";
  if (tmax >= 22) return "長袖シャツ、または半袖＋薄手の羽織もの。";
  if (tmax >= 18) return "長袖＋薄手のカーディガン/ジャケット。";
  if (tmax >= 14) return "ジャケットや薄手のニット。";
  if (tmax >= 10) return "コートまたは厚手のアウター。";
  if (tmax >= 6) return "冬物コート＋マフラーで防寒。";
  return "ダウン＋手袋・耳あてでしっかり防寒。";
}

const RAIN_CODES = new Set([51, 53, 55, 61, 63, 65, 80, 81, 82]);
const SNOW_CODES = new Set([71, 73, 75, 85, 86]);
const THUNDER_CODES = new Set([95, 96, 99]);

export function buildOutfitSuggestion(
  sub: SubdivisionWithPref,
  data: OpenMeteoResponse
): string {
  const i = pickOutfitDayIndex(data);
  const dateLabel = fmtDate(data.daily.time[i]);
  const tmax = data.daily.temperature_2m_max[i];
  const tmin = data.daily.temperature_2m_min[i];
  const code = data.daily.weather_code[i];
  const pop = data.daily.precipitation_probability_max[i] ?? 0;
  const wind = data.daily.wind_speed_10m_max[i] ?? 0;
  const humidity = data.daily.relative_humidity_2m_max?.[i] ?? 0;
  const uv = data.daily.uv_index_max?.[i] ?? 0;

  const title =
    sub.prefName === sub.name ? sub.name : `${sub.prefName} ${sub.name}`;
  const w = wmo(code);

  const tips: string[] = [];
  tips.push(`・${clothingByTemp(tmax)}`);

  if (tmax - tmin >= 8) {
    tips.push("・朝晩との寒暖差が大きいので、脱ぎ着しやすい重ね着を。");
  }
  if (SNOW_CODES.has(code)) {
    tips.push("・雪予報。滑りにくい靴・防水アウターで。路面凍結に注意。");
  } else if (THUNDER_CODES.has(code)) {
    tips.push("・雷雨の恐れ。屋外活動は控えめに、雨具を備えて。");
  } else if (RAIN_CODES.has(code) || pop >= 50) {
    tips.push(`・降水確率 ${pop}%。傘または撥水アウターを。`);
  }
  if (tmin <= 0 && !SNOW_CODES.has(code)) {
    tips.push("・朝の冷え込み厳しめ。路面凍結の可能性に注意。");
  }
  if (wind >= 10) {
    tips.push(`・強風 (最大 ${fmtWind(wind)} m/s)。傘破損や自転車に注意。`);
  } else if (wind >= 7) {
    tips.push(`・風が強め (最大 ${fmtWind(wind)} m/s)。帽子の飛ばされに注意。`);
  }
  if (tmax >= 30 || (tmax >= 28 && humidity >= 70)) {
    tips.push("・熱中症注意。こまめな水分補給と日陰の利用を。");
  }
  if (uv >= 8) {
    tips.push("・紫外線が非常に強い。日焼け止め・帽子・サングラスを。");
  } else if (uv >= 6 && tmax >= 25) {
    tips.push("・紫外線強め。日焼け対策を。");
  }

  const header = `## 👕 ${dateLabel} のおすすめ服装 — ${title}`;
  const summary = `${w.emoji} ${w.label}  /  最高 **${tmax}°C** / 最低 **${tmin}°C**  /  ☔ ${pop}%  /  💨 ${fmtWind(wind)} m/s`;
  const footer =
    "-# ※ 体感には個人差があります。寒がりな方は1段階厚めを目安に。";

  return [header, "", summary, "", tips.join("\n"), "", footer].join("\n");
}

// JIS 2-digit prefecture codes used by Yahoo 天気 URLs.
const YAHOO_JIS: Record<string, string> = {
  hokkaido: "01", aomori: "02", iwate: "03", miyagi: "04", akita: "05",
  yamagata: "06", fukushima: "07", ibaraki: "08", tochigi: "09", gunma: "10",
  saitama: "11", chiba: "12", tokyo: "13", kanagawa: "14", niigata: "15",
  toyama: "16", ishikawa: "17", fukui: "18", yamanashi: "19", nagano: "20",
  gifu: "21", shizuoka: "22", aichi: "23", mie: "24", shiga: "25",
  kyoto: "26", osaka: "27", hyogo: "28", nara: "29", wakayama: "30",
  tottori: "31", shimane: "32", okayama: "33", hiroshima: "34", yamaguchi: "35",
  tokushima: "36", kagawa: "37", ehime: "38", kochi: "39", fukuoka: "40",
  saga: "41", nagasaki: "42", kumamoto: "43", oita: "44", miyazaki: "45",
  kagoshima: "46", okinawa: "47",
};

// External weather-service link buttons. Domestic regions get Yahoo +
// Weathernews (lat/lon onebox). International regions get Weathernews +
// Weather.com (lat/lon) + Google search fallback.
export function buildExternalLinks(
  sub: SubdivisionWithPref
): ActionRowBuilder<ButtonBuilder> {
  const isIntl = sub.id.startsWith("intl-");
  const wn = `https://weathernews.jp/onebox/${sub.lat}/${sub.lon}/`;

  const row = new ActionRowBuilder<ButtonBuilder>();
  if (isIntl) {
    const query = encodeURIComponent(`${sub.prefName} ${sub.name}`);
    row.addComponents(
      new ButtonBuilder()
        .setLabel("Weathernews")
        .setStyle(ButtonStyle.Link)
        .setURL(wn),
      new ButtonBuilder()
        .setLabel("Weather.com")
        .setStyle(ButtonStyle.Link)
        .setURL(`https://weather.com/weather/today/l/${sub.lat},${sub.lon}`),
      new ButtonBuilder()
        .setLabel("Google")
        .setStyle(ButtonStyle.Link)
        .setURL(`https://www.google.com/search?q=${query}+weather`)
    );
  } else {
    const jis = YAHOO_JIS[sub.prefId] ?? "13";
    const yahooUrl = `https://weather.yahoo.co.jp/weather/jp/${jis}/`;
    row.addComponents(
      new ButtonBuilder()
        .setLabel("Yahoo天気")
        .setStyle(ButtonStyle.Link)
        .setURL(yahooUrl),
      new ButtonBuilder()
        .setLabel("Weathernews")
        .setStyle(ButtonStyle.Link)
        .setURL(wn)
    );
  }
  return row;
}
