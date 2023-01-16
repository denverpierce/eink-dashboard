/* eslint-disable camelcase */
import client from 'axios';
import { z } from 'zod';
import logger from '../../logging';
import { AmbLocation } from '../amb/amb.service';

const tomIndexValues = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)])

const tomValue = z.object({
  treeIndex: tomIndexValues.optional(),
  weedIndex: tomIndexValues.optional(),
  grassIndex: tomIndexValues.optional(),
  epaIndex: z.number().optional(),
  sunriseTime: z.string().optional(),
  sunsetTime: z.string().optional()
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
  const currentFields = ['treeIndex', 'grassIndex', 'weedIndex'];
  const timeBoundedFields = ['epaIndex', 'sunriseTime', 'sunsetTime'];

  return {
    getCurrentDataFields(location: AmbLocation) {
      const url = `${TOM_API}/v4/timelines?location=${location.lat},${location.lng}&units=imperial&timesteps=current&fields=${currentFields.join(',')}&apikey=${token}`
      // logger.info(`Url is: ${url}`)
      return httpClient.get<unknown>(url)
        .then(r => {
          const maybeParsedData = TomDataOrError.safeParse(r.data);
          if (!maybeParsedData.success) {
            logger.error(`Tom Pollen parsing error: ${JSON.stringify(maybeParsedData.error)}`)
            throw new Error('Data didnt parse correctly');
          }
          if ('code' in maybeParsedData.data) {
            if (maybeParsedData.data.code === 429001) {
              throw new Error('API Rate limit reached');
            }
            throw new Error('Unknown api error occured');
          }
          // console.log(maybeParsedData.data.data)
          return maybeParsedData.data.data;
        })
        .catch(e => {
          logger.error(`An error occured calling the pollen api: ${JSON.stringify(e)}`);
          throw new Error('An error occured calling the pollen api');
        });
    },
    getTimeBoundedFields(location: AmbLocation) {
      const url = `${TOM_API}/v4/timelines?location=${location.lat},${location.lng}&units=metric&timesteps=1h&fields=${timeBoundedFields.join(',')}&endTime=nowPlus1h&apikey=${token}`
      logger.info(`Url is: ${url}`)
      return httpClient.get<unknown>(url)
        .then(r => {
          const maybeParsedData = tomData.safeParse(r.data);
          if (!maybeParsedData.success) {
            logger.error(`Tom Pollen parsing error: ${JSON.stringify(maybeParsedData.error)}`)
            throw new Error('Data didnt parse correctly')
          }
          // console.log(maybeParsedData.data.data)
          return maybeParsedData.data.data;
        })
        .catch(e => {
          logger.error(`An error occured calling the pollen api: ${JSON.stringify(e)}`);
          throw new Error('An error occured calling the pollen api');
        });
    },
  };
};
