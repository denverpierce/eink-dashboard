/* eslint-disable camelcase */
import client, { Axios, AxiosError, AxiosResponse, isAxiosError } from 'axios';
import { number, z, ZodError } from 'zod';
import { getAxiosLog } from '../../ApiMain';
import logger from '../../logging';
import { AmbLocation } from '../amb/amb.service';

const tomIndexValues = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)])

const tomValue = z.object({
  treeIndex: tomIndexValues.optional(),
  weedIndex: tomIndexValues.optional(),
  grassIndex: tomIndexValues.optional(),
  treeIndexMax: tomIndexValues.optional(),
  weedIndexMax: tomIndexValues.optional(),
  grassIndexMax: tomIndexValues.optional(),
  epaHealthConcernMax: z.number().optional(),
  sunriseTime: z.string().optional(),
  sunsetTime: z.string().optional(),
  /** Per the request, in Farenheight */
  temperatureMax: z.number().optional(),
  /** Per the request, in Farenheight */
  temperatureMin: z.number().optional(),
  /** Per the request, in Farenheight */
  temperatureAvg: z.number().optional(),
  /** Per the request, in Farenheight */
  temperatureApparentAvg: z.number().optional(),
  precipitationProbabilityAvg: z.number().optional(),
  /** In Miles Per Hour */
  windSpeedAvg: z.number().optional(),
  /** In Degrees */
  windDirection: z.number().optional(),
  /** In Miles Per Hour */
  windGust: z.number().optional(),
  /** Per the request, inches per hour */
  precipitationIntensity: z.number().optional()
});
const tomInterval = z.object({
  startTime: z.string(),
  values: tomValue,
});
const tomTimestep = z.object({
  startTime: z.string(),
  endTime: z.string(),
  intervals: z.array(tomInterval),
});
const tomTimelines = z.object({
  timelines: z.array(tomTimestep),
});
const tomData = z.object({
  data: tomTimelines
});
const tomError = z.object({
  code: z.number(),
  type: z.string(),
  message: z.string()
});

export type TomData = z.infer<typeof tomTimelines>;
type TomError = z.infer<typeof tomError>;
const TomDataOrError = tomData.or(tomError)

const catchTomError = (e: any) => {
  switch (e) {
    case e.data && e.data.code && e.data.code === 429001:
      // TODO: make this catch correctly
      logger.error('API Rate limit reached');
      break;
    case e.name === "AxiosError":
      logger.log('-----------------------------------')
      const axiosError = e as AxiosError;
      logger.error(`A http error occured fetching the tom api: ${getAxiosLog(axiosError)}`);
      break;
    case 'issues' in e:
      const zodError = e as z.ZodError;
      logger.error('An error ocured parsing the api response')
      logger.error(zodError.format())
      break;
    case 'cause' in e:
      const apiError = e as TomError;
      if (apiError.code && apiError.code === 429001) {
        // I dont think this gets here due to an axios error upstack
        logger.error('API Rate limit reached');
      }
      logger.error(`An error was returned by the API: ${JSON.stringify(e)}`);
      break;
    default:
      logger.error(`An error occured calling the tom api: ${JSON.stringify(e)}`);
      break;
  }
  throw new Error('An unclassified error occured calling the tom api');
}

const parseApiReturn = (reponseData: AxiosResponse<unknown, any>): TomData => {
  const parsedApiData = TomDataOrError.parse(reponseData.data);
  if ('code' in parsedApiData) {
    // TODO: make this work correctly, and log based on return
    throw new Error('API error fall through thing', { cause: 'api' });
  }
  return parsedApiData.data;
}

// eslint-disable-next-line import/prefer-default-export,@typescript-eslint/explicit-module-boundary-types
export const TomClient = (token: string) => {
  const TOM_API = 'https://api.tomorrow.io';
  const httpClient = client.create();

  // TODO: make configurable
  const currentFields = ['treeIndexMax', 'grassIndexMax', 'weedIndexMax', 'epaHealthConcernMax', 'sunriseTime', 'sunsetTime'];
  const timeBoundedFields = [
    'temperatureMax',
    'temperatureMin',
    'temperatureAvg',
    'temperatureApparentAvg',
    'precipitationProbabilityAvg',
    'windSpeedAvg',
    'windDirection',
    'windGust',
    'precipitationIntensity'
  ];

  return {
    getCurrentDataFields(location: AmbLocation, timeParameters: string) {
      const url = `${TOM_API}/v4/timelines?location=${location.lat},${location.lng}&units=imperial&fields=${currentFields.join(',')}&${timeParameters}&apikey=${token}`
      // logger.info(`Url is: ${url}`)
      return httpClient.get<unknown>(url)
        .then(parseApiReturn)
        .catch(catchTomError);
    },
    getTimeBoundedFields(location: AmbLocation, timeParameters: string) {
      const url = `${TOM_API}/v4/timelines?location=${location.lat},${location.lng}&units=imperial&fields=${timeBoundedFields.join(',')}&${timeParameters}&apikey=${token}`
      // logger.info(`Url is: ${url}`)
      return httpClient.get<unknown>(url)
        .then(parseApiReturn)
        .catch(catchTomError);
    },
  };
};
