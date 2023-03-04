"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tomClient = exports.getAxiosLog = void 0;
const axios_1 = require("axios");
const tom_service_1 = require("./sources/tom/tom.service");
if (!process.env['TOM_TOKEN']) {
    console.error('No Tom token found, exiting');
    process.exit();
}
const tomClient = (0, tom_service_1.TomClient)(process.env.TOM_TOKEN || '');
exports.tomClient = tomClient;
const getAxiosLog = (error) => {
    if ((0, axios_1.isAxiosError)(error)) {
        if (error.code && 'response' in error) {
            return error.code;
        }
        else if (error.code && error.response)
            return `${error.code}: ${error.response}`;
    }
    return JSON.stringify(error);
};
exports.getAxiosLog = getAxiosLog;
