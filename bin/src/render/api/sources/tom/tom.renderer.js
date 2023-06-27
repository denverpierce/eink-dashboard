"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchConfigToMeta = exports.apiPayloadToCalendar = exports.apiPayloadToHourlyGraph = exports.apiPayloadToRemote = exports.apiPayloadToTenDay = exports.apiPayloadToSolarTimes = exports.apiPayloadToAirQuality = exports.tomDataArrayToObject = void 0;
const lodash_1 = require("lodash");
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
// dayjs timezone extensions
dayjs_1.default.extend(utc_1.default); // required by 'timezone'
dayjs_1.default.extend(timezone_1.default);
dayjs_1.default.tz.setDefault(dayjs_1.default.tz.guess());
const tomPollenIndexToLabelMap = {
    [0]: 'None',
    [1]: 'Very low',
    [2]: 'Low',
    [3]: 'Medium',
    [4]: 'High',
    [5]: 'Very High'
};
const tomEpaHealthConcernLabelMap = {
    [0]: 'Good',
    [1]: 'Moderate',
    [2]: 'Unhealthy for Sensitive Groups',
    [3]: 'Unhealthy for All',
    [4]: 'Very Unhealthy',
    [5]: 'Hazardous'
};
const tomDataArrayToObject = (tomData) => {
    return {
        current: tomData[0],
        timeBound: tomData[1],
        timeBoundDay: tomData[2],
        remote: tomData[3],
        calendar: tomData[4]
    };
};
exports.tomDataArrayToObject = tomDataArrayToObject;
const pollenKeys = {
    weedIndexMax: 0,
    grassIndexMax: 0,
    treeIndexMax: 0
};
const apiPayloadToAirQuality = (tomData) => {
    const currentTimeValues = tomData.current.timelines[0].intervals[0].values;
    const pollenIndexToLabelMap = (0, lodash_1.mapValues)(pollenKeys, (_v, key) => {
        return tomPollenIndexToLabelMap[currentTimeValues[key]];
    });
    const pollenLabelMap = (0, lodash_1.mapKeys)(pollenIndexToLabelMap, (_v, key) => key.replace('IndexMax', 'Label'));
    if (currentTimeValues.epaHealthConcernMax) {
        // apply epa health concern labels
        pollenLabelMap['epaLabel'] = tomEpaHealthConcernLabelMap[currentTimeValues.epaHealthConcernMax];
        pollenLabelMap['epaIndexMax'] = currentTimeValues.epaHealthConcernMax;
    }
    return {
        ...tomData.current.timelines[0].intervals[0].values,
        ...pollenLabelMap
    };
};
exports.apiPayloadToAirQuality = apiPayloadToAirQuality;
const riseSetTimeFormat = 'h:mm a';
const apiPayloadToSolarTimes = (tomData) => {
    const mostRecentInterval = (0, lodash_1.head)(tomData.current.timelines[0].intervals); // probably sorted?
    if (!mostRecentInterval) {
        throw new Error('Some data not found');
    }
    const mostRecentIntervalValues = mostRecentInterval.values;
    if (!mostRecentIntervalValues.sunsetTime || !mostRecentIntervalValues.sunriseTime) {
        return {
            sunset: 'Error',
            sunrise: 'Error',
            daylightLength: 'Error'
        };
    }
    const dSunset = (0, dayjs_1.default)(mostRecentIntervalValues.sunsetTime);
    const dSunrise = (0, dayjs_1.default)(mostRecentIntervalValues.sunriseTime);
    const dDaylightLength = dSunset.diff(dSunrise, "minutes", true);
    const daylightLengthHours = Math.floor(dDaylightLength / 60);
    const daylightLengthMinutes = dDaylightLength - (daylightLengthHours * 60);
    return {
        sunset: dSunset.format(riseSetTimeFormat),
        sunrise: dSunrise.format(riseSetTimeFormat),
        daylightLength: `${daylightLengthHours} hrs, ${daylightLengthMinutes} m`
    };
};
exports.apiPayloadToSolarTimes = apiPayloadToSolarTimes;
const intervalToDay = (interval) => {
    return {
        temperatureMax: interval.values.temperatureMax?.toFixed(0),
        temperatureMin: interval.values.temperatureMin?.toFixed(0),
        precipitationProbabilityAvg: interval.values.precipitationProbabilityAvg?.toFixed(0),
        windSpeedAvg: interval.values.windSpeedAvg?.toFixed(0),
        windDirection: interval.values.windDirection,
        windGust: interval.values.windGust?.toFixed(0)
    };
};
const apiPayloadToTenDay = (tomData) => {
    return tomData.timeBoundDay.timelines[0].intervals.map(intervalToDay);
};
exports.apiPayloadToTenDay = apiPayloadToTenDay;
const apiPayloadToRemote = (tomData) => {
    return intervalToDay(tomData.remote.timelines[0].intervals[0]);
};
exports.apiPayloadToRemote = apiPayloadToRemote;
const apiPayloadToHourlyGraph = (tomData) => {
    const mappedTemperatrue = tomData.timeBound.timelines[0].intervals.map((int) => {
        return [
            // highcharts expects epoch time in milliseconds, not seconds
            (0, dayjs_1.default)(int.startTime).unix() * 1000,
            int.values.temperatureAvg
        ];
    });
    const mappedPrecipitation = tomData.timeBound.timelines[0].intervals.map((int) => {
        return [
            // highcharts expects epoch time in milliseconds, not seconds
            (0, dayjs_1.default)(int.startTime).unix() * 1000,
            int.values.precipitationIntensity
        ];
    });
    const mappedTemperatureApparent = tomData.timeBound.timelines[0].intervals.map((int) => {
        return [
            // highcharts expects epoch time in milliseconds, not seconds
            (0, dayjs_1.default)(int.startTime).unix() * 1000,
            int.values.temperatureApparentAvg
        ];
    });
    return {
        temperature: mappedTemperatrue,
        precipitation: mappedPrecipitation,
        temperatureApparent: mappedTemperatureApparent
    };
};
exports.apiPayloadToHourlyGraph = apiPayloadToHourlyGraph;
const apiPayloadToCalendar = (tomData) => {
    return {
        ...tomData.current.timelines[0].intervals[0].values,
    };
};
exports.apiPayloadToCalendar = apiPayloadToCalendar;
const fetchConfigToMeta = (fetchConfig) => {
    return {
        fetchTimeFormatted: fetchConfig.fetchTime.format('h:mm a, MMM D, YYYY')
    };
};
exports.fetchConfigToMeta = fetchConfigToMeta;
