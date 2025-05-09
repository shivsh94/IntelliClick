import { fetchWeather, fetchForecast } from "@/utils/fetchWeather";

interface WeatherPageProps {
  params: { city: string };
}

export default async function WeatherPage({ params }: WeatherPageProps) {
  const cityName = decodeURIComponent(params.city);
  const weather = await fetchWeather(cityName);
  const forecast = await fetchForecast(cityName);

  return (
    <main className="min-h-screen bg-blue-50 text-gray-800 p-6">
      <h1 className="text-3xl font-bold mb-4">Weather in {weather.name}</h1>

      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <h2 className="text-xl font-semibold">Current Weather</h2>
        <p>🌡 Temp: {weather.main.temp}°C</p>
        <p>📈 High: {weather.main.temp_max}°C</p>
        <p>📉 Low: {weather.main.temp_min}°C</p>
        <p>💧 Humidity: {weather.main.humidity}%</p>
        <p>💨 Wind Speed: {weather.wind.speed} m/s</p>
        <p>📖 Description: {weather.weather[0].description}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-2">5-Day Forecast</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {forecast.list.slice(0, 8).map((item: any, i: number) => (
            <div key={i} className="border p-2 rounded shadow">
              <p className="font-semibold">{item.dt_txt.split(" ")[0]}</p>
              <p>🌡 {item.main.temp}°C</p>
              <p>{item.weather[0].main}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
