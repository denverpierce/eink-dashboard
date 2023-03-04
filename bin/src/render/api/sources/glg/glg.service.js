"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchEventsFromGoogleCalendar = void 0;
const zod_1 = __importDefault(require("zod"));
const googleapis_1 = require("googleapis");
// Declare the shape of the data we expect from the API
const calendarEventShape = zod_1.default.object({
    summary: zod_1.default.string(),
    start: zod_1.default.object({
        dateTime: zod_1.default.string(),
    }),
    end: zod_1.default.object({
        dateTime: zod_1.default.string(),
    }),
});
const gAuth = process.env.GOOGLE_API_KEY;
async function fetchEventsFromGoogleCalendar(fetchConfig) {
    const calendar = googleapis_1.google.calendar({ version: 'v3', auth: gAuth });
    const events = await calendar.events.list({
        calendarId: 'family14183577567145905956',
        timeMin: fetchConfig.fetchTime.toISOString(),
        maxResults: 4,
        singleEvents: true,
        orderBy: 'startTime',
    });
    if (events && events.data && events.data.items) {
        const parsedEvents = events.data.items.map((event) => calendarEventShape.parse(event));
        return parsedEvents;
    }
    return [];
}
exports.fetchEventsFromGoogleCalendar = fetchEventsFromGoogleCalendar;
