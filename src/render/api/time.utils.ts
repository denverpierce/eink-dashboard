import type { Dayjs } from "dayjs";

export const getOneDayTimeQuery = (fetchTime: Dayjs): string => {
  const startTime = fetchTime.toISOString();
  const endTime = fetchTime.add(1, 'day').toISOString();
  return `startTime=${startTime}&timesteps=1d&endTime=${endTime}`
}

// const calculateTenDayTimes

