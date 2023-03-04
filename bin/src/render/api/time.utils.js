"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOneDayTimeQuery = void 0;
const getOneDayTimeQuery = (fetchTime) => {
    const startTime = fetchTime.toISOString();
    const endTime = fetchTime.add(1, 'day').toISOString();
    return `startTime=${startTime}&timesteps=1d&endTime=${endTime}`;
};
exports.getOneDayTimeQuery = getOneDayTimeQuery;
// const calculateTenDayTimes
