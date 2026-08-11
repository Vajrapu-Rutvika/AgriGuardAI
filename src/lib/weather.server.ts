import type { FarmAdvisory, WeatherHour, WeatherPayload, WeatherResponse, WeatherWindow } from "./weather-types";

const CODES: Record<number, { condition: string; emoji: string }> = {
  0: { condition: "Clear sky", emoji: "☀️" },
  1: { condition: "Mostly clear", emoji: "🌤️" },
  2: { condition: "Partly cloudy", emoji: "⛅" },
  3: { condition: "Cloudy", emoji: "☁️" },
  45: { condition: "Foggy", emoji: "🌫️" },
  48: { condition: "Foggy", emoji: "🌫️" },
  51: { condition: "Light drizzle", emoji: "🌦️" },
  53: { condition: "Drizzle", emoji: "🌦️" },
  55: { condition: "Heavy drizzle", emoji: "🌦️" },
  61: { condition: "Light rain", emoji: "🌧️" },
  63: { condition: "Rain", emoji: "🌧️" },
  65: { condition: "Heavy rain", emoji: "🌧️" },
  71: { condition: "Snow", emoji: "🌨️" },
  80: { condition: "Rain showers", emoji: "🌦️" },
  81: { condition: "Rain showers", emoji: "🌧️" },
  82: { condition: "Heavy showers", emoji: "⛈️" },
  95: { condition: "Thunderstorm", emoji: "⛈️" },
  96: { condition: "Thunderstorm with hail", emoji: "⛈️" },
  99: { condition: "Thunderstorm with hail", emoji: "⛈️" },
};

function describe(code: number) {
  return CODES[code] ?? { condition: "Changing weather", emoji: "🌥️" };
}

const round = (n: number, digits = 0) => {
  const f = 10 ** digits;
  return Math.round((Number.isFinite(n) ? n : 0) * f) / f;
};

type OpenMeteo = {
  current?: Record<string, number>;
  hourly?: Record<string, Array<number | string>>;
};

export async function fetchFieldWeather(latitude: number, longitude: number): Promise<WeatherResponse> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    "&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m" +
    "&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m" +
    "&forecast_days=4&timezone=auto";

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    return { ok: false, error: "We could not reach the weather service. Please try again." };
  }
  if (!response.ok) {
    console.error("Weather API failed", response.status);
    return { ok: false, error: "Weather is not available for your field right now. Please try again later." };
  }

  let payload: OpenMeteo;
  try {
    payload = (await response.json()) as OpenMeteo;
  } catch {
    return { ok: false, error: "The weather answer could not be read. Please try again." };
  }

  const h = payload.hourly;
  const times = (h?.["time"] ?? []) as string[];
  if (!payload.current || times.length === 0) {
    return { ok: false, error: "The weather service sent an incomplete answer. Please try again." };
  }

  const num = (key: string, i: number) => {
    const arr = h?.[key] as number[] | undefined;
    const v = arr?.[i];
    return typeof v === "number" && Number.isFinite(v) ? v : 0;
  };

  const nowIndex = Math.max(
    0,
    times.findIndex((t) => new Date(t).getTime() >= Date.now() - 60 * 60 * 1000),
  );

  const hourly: WeatherHour[] = times.slice(nowIndex, nowIndex + 72).map((time, offset) => {
    const i = nowIndex + offset;
    const meta = describe(num("weather_code", i));
    return {
      time,
      temperature: round(num("temperature_2m", i)),
      humidity: round(num("relative_humidity_2m", i)),
      rainChance: round(num("precipitation_probability", i)),
      rainfall: round(num("precipitation", i), 1),
      windSpeed: round(num("wind_speed_10m", i)),
      condition: meta.condition,
      emoji: meta.emoji,
    };
  });

  const makeWindow = (label: string, hours: number): WeatherWindow => {
    const slice = hourly.slice(0, hours);
    const safe = slice.length ? slice : hourly.slice(0, 1);
    return {
      label,
      hours,
      maxTemp: round(Math.max(...safe.map((x) => x.temperature))),
      minTemp: round(Math.min(...safe.map((x) => x.temperature))),
      avgHumidity: round(safe.reduce((s, x) => s + x.humidity, 0) / safe.length),
      maxRainChance: round(Math.max(...safe.map((x) => x.rainChance))),
      totalRainfall: round(safe.reduce((s, x) => s + x.rainfall, 0), 1),
      maxWind: round(Math.max(...safe.map((x) => x.windSpeed))),
    };
  };

  const windows = [makeWindow("Next 24 hours", 24), makeWindow("Next 48 hours", 48), makeWindow("Next 72 hours", 72)];
  const currentMeta = describe(payload.current["weather_code"] ?? 0);
  const first = hourly[0];

  const current = {
    temperature: round(payload.current["temperature_2m"] ?? 0),
    humidity: round(payload.current["relative_humidity_2m"] ?? 0),
    rainChance: first?.rainChance ?? 0,
    rainfall: round(payload.current["precipitation"] ?? 0, 1),
    windSpeed: round(payload.current["wind_speed_10m"] ?? 0),
    condition: currentMeta.condition,
    emoji: currentMeta.emoji,
  };

  return {
    ok: true,
    data: {
      fetchedAt: new Date().toISOString(),
      current,
      windows,
      hourly,
      advisories: buildAdvisories(current, windows[0]!, hourly),
    },
  };
}

function buildAdvisories(
  current: WeatherPayload["current"],
  day: WeatherWindow,
  hourly: WeatherHour[],
): FarmAdvisory[] {
  const out: FarmAdvisory[] = [];
  const rainSoon = hourly.slice(0, 12).find((x) => x.rainChance >= 60 || x.rainfall >= 1);

  if (rainSoon) {
    out.push({
      emoji: "🌧️",
      title: "Rain expected soon",
      detail:
        "Rain may affect the suitability of some field actions. Spraying may wash off, and irrigation can usually wait.",
      tone: "warn",
    });
  } else if (day.maxRainChance < 30) {
    out.push({
      emoji: "☀️",
      title: "Mostly dry day ahead",
      detail: "A dry stretch is good for spraying, weeding and drying harvested produce.",
      tone: "safe",
    });
  }

  if (day.totalRainfall >= 20) {
    out.push({
      emoji: "💧",
      title: "Heavy rainfall likely",
      detail: `About ${day.totalRainfall} mm of rain is expected. Check drainage so water does not stand in the field.`,
      tone: "danger",
    });
  }

  if (current.windSpeed >= 20 || day.maxWind >= 25) {
    out.push({
      emoji: "💨",
      title: "Windy conditions",
      detail: "Strong wind can carry spray away from the crop. Spray early morning or late evening if you must.",
      tone: "warn",
    });
  }

  if (day.maxTemp >= 38) {
    out.push({
      emoji: "🔥",
      title: "Strong heat expected",
      detail: `Temperature may reach ${day.maxTemp}°C. Water in the early morning or evening to reduce crop stress.`,
      tone: "danger",
    });
  }

  if (day.avgHumidity >= 80) {
    out.push({
      emoji: "🍃",
      title: "Humid air",
      detail: "High humidity for long hours can help fungal problems spread. Watch leaves closely.",
      tone: "warn",
    });
  }

  if (out.length === 0) {
    out.push({
      emoji: "🌾",
      title: "Calm weather for your field",
      detail: "No unusual weather is expected. Normal field work should be fine.",
      tone: "safe",
    });
  }

  return out;
}