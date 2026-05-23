export type ForecastRange = "today" | "3day" | "7day";

export type OpenMeteoResponse = {
  latitude: number;
  longitude: number;
  timezone: string;
  current?: {
    time: string;
    temperature_2m: number;
    weather_code: number;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
};

const BASE = "https://api.open-meteo.com/v1/forecast";

export async function fetchForecast(
  lat: number,
  lon: number,
  range: ForecastRange
): Promise<OpenMeteoResponse> {
  const days = range === "today" ? 1 : range === "3day" ? 3 : 7;
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    timezone: "Asia/Tokyo",
    forecast_days: days.toString(),
    current: "temperature_2m,weather_code",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
  });
  if (range === "today" || range === "3day") {
    params.set(
      "hourly",
      "temperature_2m,precipitation_probability,weather_code"
    );
  }

  const url = `${BASE}?${params.toString()}`;
  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), 15000);
    try {
      const res = await fetch(url, { signal: ac.signal });
      if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
      return (await res.json()) as OpenMeteoResponse;
    } catch (e) {
      lastErr = e;
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr;
}
