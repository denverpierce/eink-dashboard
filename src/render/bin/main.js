"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const mustache_express_1 = __importDefault(require("mustache-express"));
const moment_1 = __importDefault(require("moment"));
const app = (0, express_1.default)();
const port = 3000;
let tenDay = [];
app.use(express_1.default.static('public'));
app.use(express_1.default.static('node_modules/@fortawesome/fontawesome-free/'));
app.get('/', function (req, res) {
    res.sendFile('./index.html', { root: `${__dirname}/../` });
});
// Register '.mustache' extension with The Mustache Express
app.engine('mst', (0, mustache_express_1.default)('views', '.mst'));
app.get('/tenDay', function (req, res) {
    var renderer = (0, mustache_express_1.default)('views', '.mst');
    (renderer('views/tenDay.mst', {
        days: tenDay.map((weather) => {
            return {
                ...weather,
                time: moment_1.default.weekdaysShort((0, moment_1.default)(weather.time).weekday())
            };
        })
    }, function (err, result) {
        res.send(result);
    }));
});
app.get('/today', function (req, res) {
    var renderer = (0, mustache_express_1.default)('views', '.mst');
    (renderer('views/today.mst', {
        days: tenDay.map((weather) => {
            return {
                ...weather,
                time: moment_1.default.weekdaysShort((0, moment_1.default)(weather.time).weekday())
            };
        })
    }, function (err, result) {
        res.send(result);
    }));
});
app.get('/pollen', function (req, res) {
    var renderer = (0, mustache_express_1.default)('views', '.mst');
    (renderer('views/pollen.mst', {
        days: tenDay.map((weather) => {
            return {
                ...weather,
                time: moment_1.default.weekdaysShort((0, moment_1.default)(weather.time).weekday())
            };
        })
    }, function (err, result) {
        res.send(result);
    }));
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
const config = {
    latitude: 36.0,
    longitude: -96.0
};
const httpClient = axios_1.default.create();
httpClient.defaults.headers.common['User-Agent'] = 'me';
httpClient.get(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${config.latitude}&lon=${config.longitude}&altitude=100`).then((resp) => {
    const weatherData = resp.data;
    tenDay = weatherData.properties.timeseries
        // @ts-ignore
        .filter((pTs) => pTs.time.includes('T00:00:00Z'))
        .map((ts) => {
        return {
            time: Date.parse(ts.time),
            data: ts.data
        };
    });
});
