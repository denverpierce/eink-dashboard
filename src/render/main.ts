import type { GeoJSON } from 'geojson';
import client from 'axios';
import express from 'express';
import mustacheExpress from 'mustache-express';
import moment from 'moment';

const app = express()
const port = 3000;

let tenDay: TimeSeriesEntry[] = [];

app.use(express.static('public'))
app.use(express.static('node_modules/@fortawesome/fontawesome-free/'))
app.get('/', function (req, res) {
    res.sendFile('./index.html', { root: `${__dirname}/../` });
});

// Register '.mustache' extension with The Mustache Express
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

app.get('/today', function (req, res) {
    var renderer = mustacheExpress('views', '.mst');
    (renderer('views/today.mst',
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

app.get('/pollen', function (req, res) {
    var renderer = mustacheExpress('views', '.mst');
    (renderer('views/pollen.mst',
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

const config = {
    latitude: 36.0,
    longitude: -96.0
}

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


httpClient.get<GeoJSON.Feature<GeoJSON.Point, WeatherProperties>>(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${config.latitude}&lon=${config.longitude}&altitude=100`).then((resp) => {
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