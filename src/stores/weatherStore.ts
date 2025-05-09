import { types } from "mobx-state-tree";

export const WeatherStore = types
  .model("WeatherStore", {
    cityName: types.optional(types.string, ""),
    weatherData: types.frozen(),
  })
  .actions((self) => ({
    setCityName(name: string) {
      self.cityName = name;
    },
    setWeatherData(data: any) {
      self.weatherData = data;
    },
  }));

export const store = WeatherStore.create();
