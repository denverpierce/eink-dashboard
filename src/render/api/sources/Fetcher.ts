import { tomClient } from "../ApiMain"
import { AmbLocation } from "./amb/amb.service"

export interface DataFetchConfig {
  primaryLocation: AmbLocation,
  remoteLocation: AmbLocation,
  fetchTime: DayJs
}

export const getAllApiData = async (fetchConfig: DataFetchConfig) => {
  const currentDataFields = tomClient.getCurrentDataFields({
    lat: fetchConfig.primaryLocation.lat,
    lng: fetchConfig.primaryLocation.lng,
    fetchMidnight: getBeginMidnight(fetchConfig.fetchTime)
  });
  const currentTimeBoundFields = tomClient.getTimeBoundedFields({
    lat: fetchConfig.primaryLocation.lat,
    lng: fetchConfig.primaryLocation.lng,
  }, 'endTime=nowPlus1h&timesteps=1h');
  const tenDayTimeBoundFields = tomClient.getTimeBoundedFields({
    lat: fetchConfig.primaryLocation.lat,
    lng: fetchConfig.primaryLocation.lng,
  }, 'endTime=nowPlus9d&timesteps=1d');
  const remoteTimeBoundFields = tomClient.getTimeBoundedFields({
    lat: fetchConfig.primaryLocation.lat,
    lng: fetchConfig.primaryLocation.lng,
  }, 'endTime=nowPlus1h&timesteps=1h');
  return Promise.all([
    currentDataFields,
    currentTimeBoundFields,
    tenDayTimeBoundFields,
    remoteTimeBoundFields
  ])
}