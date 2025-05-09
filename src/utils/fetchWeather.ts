const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE = "https://api.openweathermap.org/data/2.5";

export const fetchWeather = async (city: string) => {
  const res = await fetch(`${BASE}/weather?q=${city}&units=metric&appid=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to fetch current weather");
  return await res.json();
};

export const fetchForecast = async (city: string) => {
  const res = await fetch(`${BASE}/forecast?q=${city}&units=metric&appid=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to fetch forecast");
  return await res.json();
};
