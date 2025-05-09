import { types, flow } from "mobx-state-tree";
import { fetchCities } from "@/utils/fetchCities";

const City = types.model({
  name: types.string,
  country: types.string,
  timezone: types.string,
  coordinates: types.model({
    lon: types.number,
    lat: types.number,
  }),
});

export const CityStore = types
  .model("CityStore", {
    cities: types.array(City),
    search: types.optional(types.string, ""),
    loading: types.optional(types.boolean, false),
    start: types.optional(types.number, 0),
  })
  .actions((self) => ({
    fetchCities: flow(function* () {
      self.loading = true;
      try {
        const results = yield fetchCities(self.search, self.start);
        self.cities.push(...results);
        self.start += 50;
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        self.loading = false;
      }
    }),
    resetAndSearch(term: string) {
      self.search = term;
      self.start = 0;
      self.cities.clear();
      this.fetchCities();
    },
  }));

export const cityStore = CityStore.create({});
