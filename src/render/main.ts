import type { GeoJSON } from 'geojson';
import client from 'axios';
import express from 'express';
import mustacheExpress from 'mustache-express';
import moment from 'moment';
import { tomClient } from './api/ApiMain';
import { DataFetchConfig, getAllApiData } from './api/sources/Fetcher';

const app = express()
const port = 3000;

let tenDay: TimeSeriesEntry[] = [];

const dataFechConfig: DataFetchConfig = {
    primaryLocation: {
        lat: 32.9,
        lng: -96.7
    },
    remoteLocation: {
        lat: 39.9,
        lng: -105.5
    }
}

// TODO: types
let allApiData: any[] = [];

app.use(express.static('public'))
app.get('/', async function (req, res) {
    try {
        allApiData = await getAllApiData(dataFechConfig);
    } catch (error) {

    } finally {
        res.sendFile('./index.html', { root: `${__dirname}/../` });
    }
});

// Register '.mustache' extension with mustache-express
app.engine('mst', mustacheExpress('views', '.mst'));

app.get('/tenDay', function (req, res) {
    var renderer = mustacheExpress('views', '.mst');
    (renderer('views/tenDay.mst',
        {
            days: tenDay.map((weather) => {
                return {
                    ...weather,
                    time: moment.weekdaysShort(moment(weather.time).weekday())
                }
            })
        }, function (err, result) {
            res.send(result)
        }));
});

app.get('/solar', function (req, res) {
    var renderer = mustacheExpress('views', '.mst');
    (renderer('views/solar.mst',
        {
            days: tenDay.map((weather) => {
                return {
                    ...weather,
                    time: moment.weekdaysShort(moment(weather.time).weekday())
                }
            })
        }, function (err, result) {
            res.send(result)
        }));
});

app.get('/airQuality', function (req, res) {
    var renderer = mustacheExpress('views', '.mst');
    console.log(allApiData)
    const airQuality = {
        ...allApiData[0].timelines[0].intervals[0].values,
        ...allApiData[1].timelines[0].intervals[0].values
    }
    // console.log(airQuality)
    renderer('views/airQuality.mst',
        {
            airQuality
        }, function (err, result) {
            res.send(result)
        })
});

app.get('/calendar', function (req, res) {
    var renderer = mustacheExpress('views', '.mst');
    renderer('views/calendar.mst',
        {
            calendar: 1
        }, function (err, result) {
            res.send(result)
        })
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});



type TimeSeriesEntry = {
    time: string | number,
    data: {
        instant: {
            details: {
                air_pressure_at_sea_level: number,
                air_temperature: number,
                cloud_area_fraction: number,
                relative_humidity: number,
                wind_from_direction: number,
                wind_speed: number,
            }
        }
    }
}

type WeatherProperties = {
    meta: any,
    time: string | number,
    timeseries: TimeSeriesEntry[]
}

const httpClient = client.create();
httpClient.defaults.headers.common['User-Agent'] = 'me'


httpClient.get<GeoJSON.Feature<GeoJSON.Point, WeatherProperties>>(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${dataFechConfig.primaryLocation.lat}&lon=${dataFechConfig.primaryLocation.lng}&altitude=100`).then((resp) => {
    const weatherData = resp.data;
    tenDay = weatherData.properties.timeseries
        // @ts-ignore
        .filter((pTs) => pTs.time.includes('T00:00:00Z'))
        .map((ts) => {
            return {
                time: Date.parse(ts.time as string),
                data: ts.data
            }
        });
})