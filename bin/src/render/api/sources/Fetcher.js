"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllApiData = void 0;
const ApiMain_1 = require("../ApiMain");
const time_utils_1 = require("../time.utils");
const getAllApiData = async (fetchConfig) => {
    const currentDataFields = ApiMain_1.tomClient.getCurrentDataFields({
        lat: fetchConfig.primaryLocation.lat,
        lng: fetchConfig.primaryLocation.lng
    }, (0, time_utils_1.getOneDayTimeQuery)(fetchConfig.fetchTime));
    const currentTimeBoundFields = ApiMain_1.tomClient.getTimeBoundedFields({
        lat: fetchConfig.primaryLocation.lat,
        lng: fetchConfig.primaryLocation.lng,
    }, 'endTime=nowPlus24h&timesteps=1h');
    const tenDayTimeBoundFields = ApiMain_1.tomClient.getTimeBoundedFields({
        lat: fetchConfig.primaryLocation.lat,
        lng: fetchConfig.primaryLocation.lng,
    }, 'endTime=nowPlus9d&timesteps=1d');
    const remoteTimeBoundFields = ApiMain_1.tomClient.getTimeBoundedFields({
        lat: fetchConfig.remoteLocation.lat,
        lng: fetchConfig.remoteLocation.lng,
    }, (0, time_utils_1.getOneDayTimeQuery)(fetchConfig.fetchTime));
    // const gCalendarPromise = fetchEventsFromGoogleCalendar(fetchConfig);
    return Promise.all([
        currentDataFields,
        currentTimeBoundFields,
        tenDayTimeBoundFields,
        remoteTimeBoundFields,
        // gCalendarPromise
    ]);
};
exports.getAllApiData = getAllApiData;
