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
    lng: fetchConfig.primaryLocation.lng,
  }, 'endTime=nowPlus1h&timesteps=1h'),
  tomClient.getTimeBoundedFields({
    lat: fetchConfig.primaryLocation.lat,
    lng: fetchConfig.primaryLocation.lng,
  }, 'endTime=nowPlus9d&timesteps=1d')];
  return Promise.all(airQualityPromises)
}