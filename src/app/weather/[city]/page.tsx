import { fetchWeather, fetchForecast } from "@/utils/fetchWeather";

// Define types for the API responses
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

interface WeatherPageProps {
  params: { city: string };
}

// Weather icon mapping
const getWeatherIcon = (iconCode: string): string => {
  const iconMap: Record<string, string> = {
    '01d': '☀️',
    '01n': '🌙',
    '02d': '⛅',
    '02n': '☁️',
    '03d': '☁️',
    '03n': '☁️',
    '04d': '☁️',
    '04n': '☁️',
    '09d': '🌧️',
    '09n': '🌧️',
    '10d': '🌦️',
    '10n': '🌧️',
    '11d': '⛈️',
    '11n': '⛈️',
    '13d': '❄️',
    '13n': '❄️',
    '50d': '🌫️',
    '50n': '🌫️'
  };
  
  return iconMap[iconCode] || '🌈';
};

// Format date string to more readable format
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Format time string
const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Group forecast by date
const groupForecastByDate = (forecastList: ForecastItem[]): GroupedForecast[] => {
  const grouped: Record<string, ForecastItem[]> = {};
  
  forecastList.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(item);
  });
  
  return Object.entries(grouped).map(([date, items]) => ({
    date,
    items
  }));
};

export default async function WeatherPage({ params }: WeatherPageProps) {
  const cityName = decodeURIComponent(params.city);
  const weather: WeatherResponse = await fetchWeather(cityName);
  const forecast: ForecastResponse = await fetchForecast(cityName);
  
  // Group the forecast data by date
  const groupedForecast = groupForecastByDate(forecast.list);
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 text-gray-800 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with city name */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800">
            {getWeatherIcon(weather.weather[0]?.icon || '01d')} Weather in {weather.name}
            {weather.sys?.country ? `, ${weather.sys.country}` : ''}
          </h1>
          <p className="text-blue-600 mt-1">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        {/* Current Weather Card */}
        <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-blue-700 mb-4">Current Weather</h2>
              <div className="flex items-center mb-6">
                <div className="text-6xl font-bold">{weather.main.temp.toFixed(1)}°C</div>
                <div className="ml-4">
                  <div className="text-lg capitalize">{weather.weather[0]?.description || 'Unknown'}</div>
                  {weather.main.feels_like !== undefined && (
                    <div className="text-gray-500">Feels like {weather.main.feels_like.toFixed(1)}°C</div>
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
            
            <div className="border-t pt-4 md:pt-0 md:border-t-0 md:border-l md:pl-6">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">Details</h2>
              <div className="grid grid-cols-1 gap-y-3">
                <div className="flex items-center">
                  <span className="inline-block w-28">💨 Wind:</span>
                  <span>{weather.wind.speed} m/s{weather.wind.deg !== undefined ? `, ${weather.wind.deg}°` : ''}</span>
                </div>
                {weather.sys?.sunrise !== undefined && (
                  <div className="flex items-center">
                    <span className="inline-block w-28">🌅 Sunrise:</span>
                    <span>{new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                )}
                {weather.sys?.sunset !== undefined && (
                  <div className="flex items-center">
                    <span className="inline-block w-28">🌇 Sunset:</span>
                    <span>{new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <span className="inline-block w-28">⏱️ Updated:</span>
                  <span>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 5-Day Forecast */}
        <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">5-Day Forecast</h2>
          
          {groupedForecast.length > 0 ? (
            <div className="space-y-6">
              {groupedForecast.map((group, idx) => (
                <div key={idx}>
                  <h3 className="font-semibold text-lg mb-2 text-blue-600">{formatDate(group.date)}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {group.items.map((item, i) => (
                      <div key={i} className="bg-blue-50 rounded-lg p-3 hover:shadow-md transition-shadow">
                        <div className="text-sm text-gray-600 mb-1">{formatTime(item.dt_txt)}</div>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-semibold">{item.main.temp.toFixed(1)}°C</span>
                          <span className="text-2xl">{getWeatherIcon(item.weather[0]?.icon || '01d')}</span>
                        </div>
                        <div className="text-sm capitalize">{item.weather[0]?.description || 'Unknown'}</div>
                        <div className="text-xs text-gray-500 mt-1">Humidity: {item.main.humidity}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">No forecast data available</p>
          )}
        </div>
      </div>
    </main>
  );
}