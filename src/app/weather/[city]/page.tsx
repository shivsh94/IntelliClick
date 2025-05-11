import { fetchWeather, fetchForecast } from "@/utils/fetchWeather";
import Image from "next/image";
import { headers } from "next/headers";

interface WeatherResponse {
  name: string;
  main: {
    temp: number;
    feels_like?: number;
    temp_max: number;
    temp_min: number;
    humidity: number;
    pressure?: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg?: number;
  };
  sys?: {
    country?: string;
    sunrise?: number;
    sunset?: number;
  };
}

interface ForecastItem {
  dt_txt: string;
  main: {
    temp: number;
    humidity: number;
    feels_like?: number;
    pressure?: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
}

interface ForecastResponse {
  list: ForecastItem[];
}

interface GroupedForecast {
  date: string;
  items: ForecastItem[];
}

interface WeatherAssets {
  bg: string;
  text: string;
  card: string;
  animation: string;
  icon: string;
  dayNight?: "day" | "night";
}

const getWeatherAssets = (iconCode: string): WeatherAssets => {
  const assetsMap: Record<string, WeatherAssets> = {
    "01d": {
      bg: "from-sky-100 to-blue-300",
      text: "text-blue-900",
      card: "bg-white/90",
      animation: "/animations/sunny.gif",
      icon: "☀️",
      dayNight: "day",
    },
    "01n": {
      bg: "from-indigo-900 to-gray-800",
      text: "text-indigo-100",
      card: "bg-indigo-900/90",
      animation: "/animations/night.gif",
      icon: "🌙",
      dayNight: "night",
    },
    "02d": {
      bg: "from-blue-100 to-blue-300",
      text: "text-blue-800",
      card: "bg-white/90",
      animation: "/animations/partly-cloudy.gif",
      icon: "⛅",
      dayNight: "day",
    },
    "02n": {
      bg: "from-indigo-800 to-gray-700",
      text: "text-indigo-100",
      card: "bg-indigo-800/90",
      animation: "/animations/partly-cloudy-night.gif",
      icon: "☁️",
      dayNight: "night",
    },
    "03": {
      bg: "from-gray-200 to-gray-400",
      text: "text-gray-700",
      card: "bg-white/90",
      animation: "/animations/cloudy.gif",
      icon: "☁️",
    },
    "04": {
      bg: "from-gray-300 to-gray-500",
      text: "text-gray-800",
      card: "bg-gray-100/90",
      animation: "/animations/overcast.gif",
      icon: "☁️",
    },
    "09": {
      bg: "from-blue-300 to-gray-400",
      text: "text-blue-900",
      card: "bg-blue-100/90",
      animation: "/animations/rain.gif",
      icon: "🌧️",
    },
    "10d": {
      bg: "from-blue-400 to-gray-500",
      text: "text-blue-900",
      card: "bg-blue-200/90",
      animation: "/animations/rain-day.gif",
      icon: "🌦️",
      dayNight: "day",
    },
    "10n": {
      bg: "from-blue-900 to-gray-700",
      text: "text-blue-100",
      card: "bg-blue-900/90",
      animation: "/animations/rain-night.gif",
      icon: "🌧️",
      dayNight: "night",
    },
    "11": {
      bg: "from-purple-600 to-gray-700",
      text: "text-purple-100",
      card: "bg-purple-800/90",
      animation: "/animations/thunderstorm.gif",
      icon: "⛈️",
    },
    "13": {
      bg: "from-blue-100 to-white",
      text: "text-blue-900",
      card: "bg-blue-50/90",
      animation: "/animations/snow.gif",
      icon: "❄️",
    },
    "50": {
      bg: "from-gray-100 to-gray-300",
      text: "text-gray-700",
      card: "bg-white/90",
      animation: "/animations/fog.gif",
      icon: "🌫️",
    },
    default: {
      bg: "from-blue-100 to-blue-200",
      text: "text-gray-800",
      card: "bg-white/90",
      animation: "/animations/partly-cloudy.gif",
      icon: "🌈",
    },
  };

  if (assetsMap[iconCode]) {
    return assetsMap[iconCode];
  }

  const generalCode = iconCode.substring(0, 2);
  if (assetsMap[generalCode]) {
    return assetsMap[generalCode];
  }

  return assetsMap.default;
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const groupForecastByDate = (forecastList: ForecastItem[]): GroupedForecast[] => {
  const grouped: Record<string, ForecastItem[]> = {};

  forecastList.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(item);
  });

  return Object.entries(grouped).map(([date, items]) => ({
    date,
    items,
  }));
};


export default async function Page() {

  const headersList = await headers();
  const pathname = headersList.get("x-invoke-path") || "";
  const cityName = decodeURIComponent(pathname.split("/").pop() || "london");

  const weather: WeatherResponse = await fetchWeather(cityName);
  const forecast: ForecastResponse = await fetchForecast(cityName);

  const weatherIconCode = weather.weather[0]?.icon || "01d";
  const { bg, text, card, animation, icon } = getWeatherAssets(weatherIconCode);

  const groupedForecast = groupForecastByDate(forecast.list);

  return (
    <main
      className={`min-h-screen bg-gradient-to-b ${bg} ${text} p-4 md:p-6 transition-colors duration-500`}
    >
      <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
        <Image
          src={animation}
          alt="Weather animation"
          fill
          className="object-cover opacity-20"
          unoptimized
        />
      </div>

      <div className="max-w-4xl mx-auto relative">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">
            {icon} Weather in {weather.name}
            {weather.sys?.country ? `, ${weather.sys.country}` : ""}
          </h1>
          <p className="opacity-80 mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div
          className={`${card} rounded-xl shadow-lg p-6 mb-8 backdrop-blur-sm transition-all duration-300 hover:shadow-xl`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Current Weather</h2>
              <div className="flex items-center mb-6">
                <div className="text-6xl font-bold">
                  {weather.main.temp.toFixed(1)}°C
                </div>
                <div className="ml-4">
                  <div className="text-lg capitalize">
                    {weather.weather[0]?.description || "Unknown"}
                  </div>
                  {weather.main.feels_like !== undefined && (
                    <div className="opacity-80">
                      Feels like {weather.main.feels_like.toFixed(1)}°C
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-3">
                <div>📈 High: {weather.main.temp_max.toFixed(1)}°C</div>
                <div>📉 Low: {weather.main.temp_min.toFixed(1)}°C</div>
                <div>💧 Humidity: {weather.main.humidity}%</div>
                {weather.main.pressure !== undefined && (
                  <div>🧭 Pressure: {weather.main.pressure} hPa</div>
                )}
              </div>
            </div>

            <div className="border-t pt-4 md:pt-0 md:border-t-0 md:border-l md:pl-6 border-opacity-20">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="grid grid-cols-1 gap-y-3">
                <div className="flex items-center">
                  <span className="inline-block w-28">💨 Wind:</span>
                  <span>
                    {weather.wind.speed} m/s
                    {weather.wind.deg !== undefined
                      ? `, ${weather.wind.deg}°`
                      : ""}
                  </span>
                </div>
                {weather.sys?.sunrise !== undefined && (
                  <div className="flex items-center">
                    <span className="inline-block w-28">🌅 Sunrise:</span>
                    <span>
                      {new Date(weather.sys.sunrise * 1000).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </span>
                  </div>
                )}
                {weather.sys?.sunset !== undefined && (
                  <div className="flex items-center">
                    <span className="inline-block w-28">🌇 Sunset:</span>
                    <span>
                      {new Date(weather.sys.sunset * 1000).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </span>
                  </div>
                )}
                <div className="flex items-center">
                  <span className="inline-block w-28">⏱️ Updated:</span>
                  <span>
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`${card} rounded-xl shadow-lg p-6 backdrop-blur-sm`}>
          <h2 className="text-xl font-semibold mb-4">5-Day Forecast</h2>

          {groupedForecast.length > 0 ? (
            <div className="space-y-6">
              {groupedForecast.map((group, idx) => (
                <div key={idx}>
                  <h3 className="font-semibold text-lg mb-2">
                    {formatDate(group.date)}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {group.items.map((item, i) => {
                      const { icon: forecastIcon } = getWeatherAssets(
                        item.weather[0]?.icon || "01d"
                      );
                      return (
                        <div
                          key={i}
                          className="bg-white/50 rounded-lg p-3 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                        >
                          <div className="text-sm opacity-80 mb-1">
                            {formatTime(item.dt_txt)}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-semibold">
                              {item.main.temp.toFixed(1)}°C
                            </span>
                            <span className="text-2xl">{forecastIcon}</span>
                          </div>
                          <div className="text-sm capitalize">
                            {item.weather[0]?.description || "Unknown"}
                          </div>
                          <div className="text-xs opacity-70 mt-1">
                            Humidity: {item.main.humidity}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 opacity-70">
              No forecast data available
            </p>
          )}
        </div>
      </div>
    </main>
  );
}