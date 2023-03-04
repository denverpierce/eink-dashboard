"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mustache_express_1 = __importDefault(require("mustache-express"));
const Fetcher_1 = require("./api/sources/Fetcher");
const tom_renderer_1 = require("./api/sources/tom/tom.renderer");
const dayjs_1 = __importDefault(require("dayjs"));
const app = (0, express_1.default)();
const port = 3000;
// TODO: types
let allApiData = [];
app.use(express_1.default.static('src/render/public'));
app.get('/', async function (req, res) {
    const now = (0, dayjs_1.default)();
    console.log('Fetching data with a start time of: ', now.toISOString());
    const dataFechConfig = {
        primaryLocation: {
            lat: 32.9,
            lng: -96.7
        },
        remoteLocation: {
            lat: 39.9,
            lng: -105.5
        },
        fetchTime: now
    };
    try {
        allApiData = await (0, Fetcher_1.getAllApiData)(dataFechConfig);
    }
    catch (error) {
        console.error(error);
    }
    finally {
        res.sendFile('./index.html', { root: `${__dirname}/../../../src/render/` });
    }
});
// Register '.mustache' extension with mustache-express
app.engine('mst', (0, mustache_express_1.default)('views', '.mst'));
app.get('/meta', function (_req, res) {
    var renderer = (0, mustache_express_1.default)('views', '.mst');
    // TODO: fix this so that we don't recreate fetchTime here,
    // as it's not directly connected to the fetched time
    const meta = (0, tom_renderer_1.fetchConfigToMeta)({ fetchTime: (0, dayjs_1.default)() });
    renderer('src/render/views/meta.mst', {
        meta
    }, function (err, result) {
        res.send(result);
    });
});
app.get('/calendar', function (req, res) {
    var renderer = (0, mustache_express_1.default)('views', '.mst');
    const calendar = (0, tom_renderer_1.tomDataArrayToObject)(allApiData);
    renderer('src/render/views/calendar.mst', {
        calendar
    }, function (err, result) {
        res.send(result);
    });
});
app.get('/airQuality', function (req, res) {
    var renderer = (0, mustache_express_1.default)('views', '.mst');
    const airQuality = (0, tom_renderer_1.apiPayloadToAirQuality)((0, tom_renderer_1.tomDataArrayToObject)(allApiData));
    console.log(airQuality);
    renderer('src/render/views/airQuality.mst', {
        airQuality
    }, function (err, result) {
        err ? console.log(err) : undefined;
        res.send(result);
    });
});
app.get('/tenDay', function (req, res) {
    var renderer = (0, mustache_express_1.default)('views', '.mst');
    const tenDay = (0, tom_renderer_1.apiPayloadToTenDay)((0, tom_renderer_1.tomDataArrayToObject)(allApiData));
    (renderer('src/render/views/tenDay_old.mst', {
        days: tenDay
    }, function (err, result) {
        res.send(result);
    }));
});
app.get('/solar', function (req, res) {
    var renderer = (0, mustache_express_1.default)('views', '.mst');
    (renderer('src/render/views/solar.mst', {
        solar: (0, tom_renderer_1.apiPayloadToSolarTimes)((0, tom_renderer_1.tomDataArrayToObject)(allApiData))
    }, function (err, result) {
        res.send(result);
    }));
});
app.get('/graph', function (req, res) {
    var renderer = (0, mustache_express_1.default)('views', '.mst');
    const remote = (0, tom_renderer_1.apiPayloadToHourlyGraph)((0, tom_renderer_1.tomDataArrayToObject)(allApiData));
    renderer('src/render/views/graph.mst', {
        graph: JSON.stringify((0, tom_renderer_1.apiPayloadToHourlyGraph)((0, tom_renderer_1.tomDataArrayToObject)(allApiData)))
    }, function (err, result) {
        res.send(result);
    });
});
app.get('/remote', function (req, res) {
    var renderer = (0, mustache_express_1.default)('views', '.mst');
    const remote = (0, tom_renderer_1.apiPayloadToRemote)((0, tom_renderer_1.tomDataArrayToObject)(allApiData));
    renderer('src/render/views/remote.mst', {
        remote
    }, function (err, result) {
        res.send(result);
    });
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
