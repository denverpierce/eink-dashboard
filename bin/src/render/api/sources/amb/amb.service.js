"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbClient = exports.POLLEN_LOW = void 0;
/* eslint-disable camelcase */
const axios_1 = __importDefault(require("axios"));
const logging_1 = __importDefault(require("../../logging"));
exports.POLLEN_LOW = 'Low';
const POLLEN_MED = 'Med';
const POLLEN_HIGH = 'High';
const POLLEN_VERYHIGH = 'Very High';
// eslint-disable-next-line import/prefer-default-export,@typescript-eslint/explicit-module-boundary-types
const AmbClient = (token) => {
    const AMB_API = 'https://api.ambeedata.com';
    const httpClient = axios_1.default.create();
    httpClient.interceptors.request.use(req => {
        req.headers['x-api-key'] = token;
        req.headers['Content-type'] = 'application/json';
        return req;
    });
    return {
        getLatestPollen(location) {
            return httpClient.get(`${AMB_API}/latest/pollen/by-lat-lng?lat=${location.lat}&lng=${location.lng}`).catch(e => {
                logging_1.default.error(`An error occured calling the pollen api: ${JSON.stringify(e)}`);
                throw new Error('An error occured calling the pollen api');
            });
        },
    };
};
exports.AmbClient = AmbClient;
