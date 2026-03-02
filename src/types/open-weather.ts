/**
 * OpenWeatherMap Geocoding API response types
 */

export interface LocalNames {
  [languageCode: string]: string;
}

export interface GeocodingCity {
  name: string;
  local_names?: LocalNames;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

export interface GeocodingMappedCity {
  id: string;
  name: string;
  lat: number;
  lon: number;
}