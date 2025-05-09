export interface City {
    name: string;
    country: string;
    timezone: string;
    coordinates: {
      lon: number;
      lat: number;
    };
    preview?: {
      temp_min: number;
      temp_max: number;
      icon: string;
    };
  }
  