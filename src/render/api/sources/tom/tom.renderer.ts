import { head, map, mapKeys, mapValues } from 'lodash';
import dayjs from 'dayjs';
import logger from '../../logging';
import { getTypedKeys } from '../../utils';
import { getAllApiData } from '../Fetcher';
import { TomData } from './tom.service';

const tomPollenIndexToLabelMap = {
  [0]: 'None',
  [1]: 'Very low',
  [2]: 'Low',
  [3]: 'Medium',
  [4]: 'High',
  [5]: 'Very High'
}

const epaIndexToLabel = (epaIndex: number): string => {
  // epaIndex goes from 0-301
  const normalizedIndex = Math.round(epaIndex / 60.2);
  return tomPollenIndexToLabelMap[normalizedIndex]
}

export const tomDataArrayToObject = (tomData: TomData[]) => {
  return {
    current: tomData[0],
    timeBound: tomData[1],
    timeBoundDay: tomData[2],
    remote: tomData[3]
  }
}

const pollenKeys = {
  weedIndex: 0,
  grassIndex: 0,
  treeIndex: 0
}

export const apiPayloadToAirQuality = (tomData: ReturnType<typeof tomDataArrayToObject>) => {
  const mostRecentInterval = head(tomData.timeBound.timelines[0].intervals); // probably sorted?
  const currentTimeValues = tomData.current.timelines[0].intervals[0].values;

  if (!mostRecentInterval) {
    throw new Error('Some data not found')
  }
  const mostRecentIntervalValues = mostRecentInterval.values;
  const pollenIndexToLabelMap = mapValues(pollenKeys, (_v, key) => {
    return tomPollenIndexToLabelMap[currentTimeValues[key]]
  });
  const pollenLabelMap = mapKeys(pollenIndexToLabelMap, (_v, key) => key.replace('Index', 'Label'));

  if (mostRecentIntervalValues.epaIndex) {
    // this has a different mapping, so apply it here
    pollenLabelMap['epaLabel'] = epaIndexToLabel(mostRecentIntervalValues.epaIndex)
  }

  return {
    ...tomData.current.timelines[0].intervals[0].values,
    ...mostRecentInterval.values,
    ...pollenLabelMap
  }
}

const riseSetTimeFormat = 'h:mm a';
export const apiPayloadToSolarTimes = (tomData: ReturnType<typeof tomDataArrayToObject>) => {
  const mostRecentInterval = head(tomData.timeBound.timelines[0].intervals); // probably sorted?

  if (!mostRecentInterval) {
    throw new Error('Some data not found')
  }
  const mostRecentIntervalValues = mostRecentInterval.values;
  if (!mostRecentIntervalValues.sunsetTime || !mostRecentIntervalValues.sunriseTime) {
    return {
      sunset: 'Error',
      sunrise: 'Error',
      daylightLength: 'Error'
    }
  }

  const dSunset = dayjs(mostRecentIntervalValues.sunsetTime)
  const dSunrise = dayjs(mostRecentIntervalValues.sunriseTime)
  const dDaylightLength = dSunset.diff(dSunrise, "minutes", true)
  const daylightLengthHours = Math.floor(dDaylightLength / 60);
  const daylightLengthMinutes = dDaylightLength - (daylightLengthHours * 60);

  return {
    sunset: dSunset.format(riseSetTimeFormat),
    sunrise: dSunrise.format(riseSetTimeFormat),
    daylightLength: `${daylightLengthHours} hrs, ${daylightLengthMinutes} m`
  }
}

const intervalToDay = (interval: TomData['timelines'][0]['intervals'][0]) => {
  return {
    temperatureMax: interval.values.temperatureMax?.toFixed(0),
    temperatureMin: interval.values.temperatureMin?.toFixed(0),
    precipitationProbabilityAvg: interval.values.precipitationProbabilityAvg?.toFixed(0),
    windSpeedAvg: interval.values.temperatureMax?.toFixed(0),
    windDirection: interval.values.temperatureMax,
    windGust: interval.values.temperatureMax?.toFixed(0)
  }
}

export const apiPayloadToTenDay = (tomData: ReturnType<typeof tomDataArrayToObject>) => {
  return tomData.timeBoundDay.timelines[0].intervals.map(intervalToDay);
}
export const apiPayloadToRemote = (tomData: ReturnType<typeof tomDataArrayToObject>) => {
  return tomData.remote.timelines[0].intervals.map(intervalToDay);
}
