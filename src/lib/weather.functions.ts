import { createServerFn } from "@tanstack/react-start";
import type { WeatherResponse } from "./weather-types";
import { fetchFieldWeather } from "./weather.server";

export const getFieldWeather = createServerFn({ method: "GET" })
  .inputValidator((data: { latitude: number; longitude: number }) => {
    const { latitude, longitude } = data ?? {};
    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      Number.isNaN(latitude) ||
      Number.isNaN(longitude) ||
      Math.abs(latitude) > 90 ||
      Math.abs(longitude) > 180
    ) {
      throw new Error("A valid field location is required.");
    }
    return { latitude, longitude };
  })
  .handler(async ({ data }): Promise<WeatherResponse> => fetchFieldWeather(data.latitude, data.longitude));