import { tomClient } from "../ApiMain"
import { AmbLocation } from "./amb/amb.service"

export interface DataFetchConfig {
  primaryLocation: AmbLocation,
  remoteLocation: AmbLocation
}

export const getAllApiData = async (fetchConfig: DataFetchConfig) => {
  const airQualityPromises = [tomClient.getCurrentDataFields({
    lat: fetchConfig.primaryLocation.lat,
    lng: fetchConfig.primaryLocation.lng
  }), tomClient.getTimeBoundedFields({
    lat: fetchConfig.primaryLocation.lat,
    lng: fetchConfig.primaryLocation.lng
  })];
  return await Promise.all(airQualityPromises)
}