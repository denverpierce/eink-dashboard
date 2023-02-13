import type { Dayjs } from "dayjs";
import { tomClient } from "../ApiMain"
import { getOneDayTimeQuery } from "../time.utils";
import { AmbLocation } from "./amb/amb.service"
import { fetchEventsFromGoogleCalendar } from "./glg/glg.service";

export interface DataFetchConfig {
  primaryLocation: AmbLocation,
  remoteLocation: AmbLocation,
  fetchTime: Dayjs
}

export const getAllApiData = async (fetchConfig: DataFetchConfig) => {
  const currentDataFields = tomClient.getCurrentDataFields({
    lat: fetchConfig.primaryLocation.lat,
    lng: fetchConfig.primaryLocation.lng
  },
    getOneDayTimeQuery(fetchConfig.fetchTime)
  );
  const currentTimeBoundFields = tomClient.getTimeBoundedFields({
    lat: fetchConfig.primaryLocation.lat,
    lng: fetchConfig.primaryLocation.lng,
  }, 'endTime=nowPlus24h&timesteps=1h');
  const tenDayTimeBoundFields = tomClient.getTimeBoundedFields({
    lat: fetchConfig.primaryLocation.lat,
    lng: fetchConfig.primaryLocation.lng,
  }, 'endTime=nowPlus9d&timesteps=1d');
  const remoteTimeBoundFields = tomClient.getTimeBoundedFields({
    lat: fetchConfig.remoteLocation.lat,
    lng: fetchConfig.remoteLocation.lng,
  }, getOneDayTimeQuery(fetchConfig.fetchTime));
  // const gCalendarPromise = fetchEventsFromGoogleCalendar(fetchConfig);

  return Promise.all([
    currentDataFields,
    currentTimeBoundFields,
    tenDayTimeBoundFields,
    remoteTimeBoundFields,
    // gCalendarPromise
  ])
}