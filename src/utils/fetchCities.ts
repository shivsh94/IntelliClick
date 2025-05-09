import { City } from "@/types/city";

const BASE_URL = "https://public.opendatasoft.com/api/records/1.0/search/";
const DATASET = "geonames-all-cities-with-a-population-1000";

export const fetchCities = async (
  search = "",
  start = 0,
  rows = 50
): Promise<City[]> => {
  const url = `${BASE_URL}?dataset=${DATASET}&q=${search}&start=${start}&rows=${rows}&sort=name`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch cities");

  const data = await res.json();

  return data.records.map((record: any) => ({
    name: record.fields.name,
    country: record.fields.cou_name_en,
    timezone: record.fields.timezone,
    coordinates: {
      lon: record.fields.coordinates?.[1] || 0,
      lat: record.fields.coordinates?.[0] || 0,
    },
  }));
};
