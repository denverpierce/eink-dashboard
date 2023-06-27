"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TomClient = void 0;
/* eslint-disable camelcase */
const axios_1 = __importDefault(require("axios"));
const zod_1 = require("zod");
const ApiMain_1 = require("../../ApiMain");
const logging_1 = __importDefault(require("../../logging"));
const tomIndexValues = zod_1.z.union([zod_1.z.literal(0), zod_1.z.literal(1), zod_1.z.literal(2), zod_1.z.literal(3), zod_1.z.literal(4), zod_1.z.literal(5)]);
const tomValue = zod_1.z.object({
    treeIndex: tomIndexValues.optional(),
    weedIndex: tomIndexValues.optional(),
    grassIndex: tomIndexValues.optional(),
    treeIndexMax: tomIndexValues.optional(),
    weedIndexMax: tomIndexValues.optional(),
    grassIndexMax: tomIndexValues.optional(),
    epaHealthConcernMax: zod_1.z.number().optional(),
    sunriseTime: zod_1.z.string().optional(),
    sunsetTime: zod_1.z.string().optional(),
    /** Per the request, in Farenheight */
    temperatureMax: zod_1.z.number().optional(),
    /** Per the request, in Farenheight */
    temperatureMin: zod_1.z.number().optional(),
    /** Per the request, in Farenheight */
    temperatureAvg: zod_1.z.number().optional(),
    /** Per the request, in Farenheight */
    temperatureApparentAvg: zod_1.z.number().optional(),
    precipitationProbabilityAvg: zod_1.z.number().optional(),
    /** In Miles Per Hour */
    windSpeedAvg: zod_1.z.number().optional(),
    /** In Degrees */
    windDirection: zod_1.z.number().optional(),
    /** In Miles Per Hour */
    windGust: zod_1.z.number().optional(),
    /** Per the request, inches per hour */
    precipitationIntensity: zod_1.z.number().optional()
});
const tomInterval = zod_1.z.object({
    startTime: zod_1.z.string(),
    values: tomValue,
});
const tomTimestep = zod_1.z.object({
    startTime: zod_1.z.string(),
    endTime: zod_1.z.string(),
    intervals: zod_1.z.array(tomInterval),
});
const tomTimelines = zod_1.z.object({
    timelines: zod_1.z.array(tomTimestep),
});
const tomData = zod_1.z.object({
    data: tomTimelines
});
const tomError = zod_1.z.object({
    code: zod_1.z.number(),
    type: zod_1.z.string(),
    message: zod_1.z.string()
});
const TomDataOrError = tomData.or(tomError);
const catchTomError = (e) => {
    switch (e) {
        case e.data && e.data.code && e.data.code === 429001:
            // TODO: make this catch correctly
            logging_1.default.error('API Rate limit reached');
            break;
        case e.name === "AxiosError":
            logging_1.default.log('-----------------------------------');
            const axiosError = e;
            logging_1.default.error(`A http error occured fetching the tom api: ${(0, ApiMain_1.getAxiosLog)(axiosError)}`);
            break;
        case 'issues' in e:
            const zodError = e;
            logging_1.default.error('An error ocured parsing the api response');
            logging_1.default.error(zodError.format());
            break;
        case 'cause' in e:
            const apiError = e;
            if (apiError.code && apiError.code === 429001) {
                // I dont think this gets here due to an axios error upstack
                logging_1.default.error('API Rate limit reached');
            }
            logging_1.default.error(`An error was returned by the API: ${JSON.stringify(e)}`);
            break;
        default:
            logging_1.default.error(`An error occured calling the tom api: ${JSON.stringify(e)}`);
            break;
    }
    throw new Error('An unclassified error occured calling the tom api');
};
const parseApiReturn = (reponseData) => {
    const parsedApiData = TomDataOrError.parse(reponseData.data);
    if ('code' in parsedApiData) {
        // TODO: make this work correctly, and log based on return
        throw new Error('API error fall through thing', { cause: 'api' });
    }
    return parsedApiData.data;
};
// eslint-disable-next-line import/prefer-default-export,@typescript-eslint/explicit-module-boundary-types
const TomClient = (token) => {
    const TOM_API = 'https://api.tomorrow.io';
    const httpClient = axios_1.default.create();
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
        getCurrentDataFields(location, timeParameters) {
            const url = `${TOM_API}/v4/timelines?location=${location.lat},${location.lng}&units=imperial&fields=${currentFields.join(',')}&${timeParameters}&apikey=${token}`;
            // logger.info(`Url is: ${url}`)
            return httpClient.get(url)
                .then(parseApiReturn)
                .catch(catchTomError);
        },
        getTimeBoundedFields(location, timeParameters) {
            const url = `${TOM_API}/v4/timelines?location=${location.lat},${location.lng}&units=imperial&fields=${timeBoundedFields.join(',')}&${timeParameters}&apikey=${token}`;
            // logger.info(`Url is: ${url}`)
            return httpClient.get(url)
                .then(parseApiReturn)
                .catch(catchTomError);
        },
    };
};
exports.TomClient = TomClient;
