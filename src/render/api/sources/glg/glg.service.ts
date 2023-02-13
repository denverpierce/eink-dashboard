import z from 'zod';
import { google } from 'googleapis';
import { GlobalOptions } from 'googleapis/build/src/apis/calendar';
import { DataFetchConfig } from '../Fetcher';

// Declare the shape of the data we expect from the API
const calendarEventShape = z.object({
  summary: z.string(),
  start: z.object({
    dateTime: z.string(),
  }),
  end: z.object({
    dateTime: z.string(),
  }),
});

const gAuth: GlobalOptions['auth'] = process.env.GOOGLE_API_KEY as string;

export async function fetchEventsFromGoogleCalendar(fetchConfig: DataFetchConfig) {
  const calendar = google.calendar({ version: 'v3', auth: gAuth });
  const events = await calendar.events.list({
    calendarId: 'family14183577567145905956',
    timeMin: fetchConfig.fetchTime.toISOString(),
    maxResults: 4,
    singleEvents: true,
    orderBy: 'startTime',
  });
  if (events && events.data && events.data.items) {
    const parsedEvents = events.data.items.map((event) =>
      calendarEventShape.parse(event)
    );
    return parsedEvents;
  }
  return []
}