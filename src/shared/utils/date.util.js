export function nowUtc() {
  return new Date();
}

export function assertValidDateRange(startDate, endDate) {
  return new Date(startDate).getTime() < new Date(endDate).getTime();
}

export function minutesBetween(startDate, endDate) {
  return Math.round(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / 60000,
  );
}

export const now = nowUtc;
export const toISOString = (date) => date?.toISOString?.() ?? null;
