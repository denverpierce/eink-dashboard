import type { GeoJSON } from 'geojson';
import client from 'axios';
import express from 'express';
import mustacheExpress from 'mustache-express';
import { DataFetchConfig, getAllApiData } from './api/sources/Fetcher';
import {
  apiPayloadToAirQuality,
  apiPayloadToSolarTimes,
  apiPayloadToTenDay,
  tomDataArrayToObject,
  apiPayloadToRemote
} from './api/sources/tom/tom.renderer';

const app = express()
const port = 3000;

let tenDay: any[] = [];



// TODO: types
let allApiData: any[] = [];

app.use(express.static('src/render/public'))
app.get('/', async function (req, res) {
  const dataFechConfig: DataFetchConfig = {
    primaryLocation: {
      lat: 32.9,
      lng: -96.7
    },
    remoteLocation: {
      lat: 39.9,
      lng: -105.5
    },
    fetchTime: dayjs()
  }
  try {
    allApiData = await getAllApiData(dataFechConfig);
  } catch (error) {
    console.error(error)
  } finally {
    res.sendFile('./index.html', { root: `${__dirname}/../../../src/render/` });
  }
});

// Register '.mustache' extension with mustache-express
app.engine('mst', mustacheExpress('views', '.mst'));

app.get('/tenDay', function (req, res) {
  var renderer = mustacheExpress('views', '.mst');
  const tenDay = apiPayloadToTenDay(tomDataArrayToObject(allApiData));
  (renderer('src/render/views/tenDay_old.mst',
    {
      days: tenDay
    }, function (err, result) {
      res.send(result)
    }));
});

app.get('/solar', function (req, res) {
  var renderer = mustacheExpress('views', '.mst');
  (renderer('src/render/views/solar.mst',
    {
      solar: apiPayloadToSolarTimes(tomDataArrayToObject(allApiData))
    }, function (err, result) {
      res.send(result)
    }));
});

app.get('/airQuality', function (req, res) {
  var renderer = mustacheExpress('views', '.mst');
  const airQuality = apiPayloadToAirQuality(tomDataArrayToObject(allApiData));
  // console.log(airQuality)
  renderer('src/render/views/airQuality.mst',
    {
      airQuality
    }, function (err, result) {
      err ? console.log(err) : undefined;
      res.send(result)
    })
});

app.get('/calendar', function (req, res) {
  var renderer = mustacheExpress('views', '.mst');
  renderer('src/render/views/calendar.mst',
    {
      calendar: 1
    }, function (err, result) {
      res.send(result)
    })
});

app.get('/remote', function (req, res) {
  var renderer = mustacheExpress('views', '.mst');
  const remote = apiPayloadToRemote(tomDataArrayToObject(allApiData));
  renderer('src/render/views/remote.mst',
    {
      remote
    }, function (err, result) {
      res.send(result)
    })
});

app.get('/graph', function (req, res) {
  var renderer = mustacheExpress('views', '.mst');
  renderer('src/render/views/graph.mst',
    {
      calendar: 1
    }, function (err, result) {
      res.send(result)
    })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});