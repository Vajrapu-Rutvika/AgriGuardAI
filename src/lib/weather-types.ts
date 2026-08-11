export type WeatherHour = {
  time: string;
  temperature: number;
  humidity: number;
  rainChance: number;
  rainfall: number;
  windSpeed: number;
  condition: string;
  emoji: string;
};

export type WeatherWindow = {
  label: string;
  hours: number;
  maxTemp: number;
  minTemp: number;
  avgHumidity: number;
  maxRainChance: number;
  totalRainfall: number;
  maxWind: number;
};

export type FarmAdvisory = {
  emoji: string;
  title: string;
  detail: string;
  tone: "safe" | "warn" | "danger" | "info";
};

export type WeatherPayload = {
  fetchedAt: string;
  current: {
    temperature: number;
    humidity: number;
    rainChance: number;
    rainfall: number;
    windSpeed: number;
    condition: string;
    emoji: string;
  };
  windows: WeatherWindow[];
  hourly: WeatherHour[];
  advisories: FarmAdvisory[];
};

export type WeatherResponse = { ok: true; data: WeatherPayload } | { ok: false; error: string };