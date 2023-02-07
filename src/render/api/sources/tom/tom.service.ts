/* eslint-disable camelcase */
import client, { AxiosError, isAxiosError } from 'axios';
import { number, z } from 'zod';
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
  epaIndex: z.number().optional(),
  epaIndexMax: z.number().optional(),
  sunriseTime: z.string().optional(),
  sunsetTime: z.string().optional(),
  /** Per the request, in Farenheight */
  temperatureMax: z.number().optional(),
  /** Per the request, in Farenheight */
  temperatureMin: z.number().optional(),
  /** Per the request, in Farenheight */
  temperatureAvg: z.number().optional(),
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

// eslint-disable-next-line import/prefer-default-export,@typescript-eslint/explicit-module-boundary-types
export const TomClient = (token: string) => {
  const TOM_API = 'https://api.tomorrow.io';
  const httpClient = client.create();

  // TODO: make configurable
  const currentFields = ['treeIndexMax', 'grassIndexMax', 'weedIndexMax', 'epaIndexMax', 'sunriseTime', 'sunsetTime'];
  const timeBoundedFields = [
    'temperatureMax',
    'temperatureMin',
    'temperatureAvg',
    'precipitationProbabilityAvg',
    'windSpeedAvg',
    'windDirection',
    'windGust',
    'precipitationIntensity'
  ];

  const catchTomError = (e: any) => {
    switch (e) {
      case isAxiosError(e):
        const axiosError = e as AxiosError;
        if (axiosError.code && axiosError.code === '429001') {
          logger.error('API Rate limit reached');
        }
        logger.error(`An error occured calling the tom api: ${getAxiosLog(axiosError)}`);
        throw new Error('An error occured calling the tom api');
      case e instanceof z.ZodError:
        const zodError = e as z.ZodError;
        logger.error(zodError.format())
        break;
      default:
        logger.error(`An error occured calling the tom api: ${JSON.stringify(e)}`);
        break;
    }
    throw new Error('An error occured calling the tom api');
  }

  return {
    getCurrentDataFields(location: AmbLocation, timeParameters: string) {
      const url = `${TOM_API}/v4/timelines?location=${location.lat},${location.lng}&units=imperial&fields=${currentFields.join(',')}&${timeParameters}&apikey=${token}`
      // logger.info(`Url is: ${url}`)
      return httpClient.get<unknown>(url)
        .then(r => {
          return TomDataOrError.parse(r.data);
        })
        .catch(catchTomError);
    },
    getTimeBoundedFields(location: AmbLocation, timeParameters: string) {
      const url = `${TOM_API}/v4/timelines?location=${location.lat},${location.lng}&units=imperial&fields=${timeBoundedFields.join(',')}&${timeParameters}&apikey=${token}`
      // logger.info(`Url is: ${url}`)
      return httpClient.get<unknown>(url)
        .then(r => {
          return TomDataOrError.parse(r.data);
        })
        .catch(catchTomError);
    },
  };
};
