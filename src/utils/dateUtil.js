import dayjs from 'dayjs';

// Applied dates are stored as calendar dates ('YYYY-MM-DD'). Format them in
// UTC so the viewer's time zone can never shift them to the previous day.
const toUtcDate = isoDate => new Date(`${isoDate}T00:00:00Z`);

/**
 * Formats a stored calendar date for display.
 * @param {string} isoDate - Date as 'YYYY-MM-DD'.
 * @param {string} locale - BCP 47 locale, e.g. 'en' or 'es'.
 * @param {Date} [now] - Reference "today", for the relative label.
 * @returns {{absolute: string, relative: string} | null} null when invalid.
 */
export const formatCalendarDate = (isoDate, locale, now = new Date()) => {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(isoDate ?? '') ||
    toUtcDate(isoDate).toISOString().slice(0, 10) !== isoDate
  ) {
    return null;
  }

  const absolute = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(toUtcDate(isoDate));

  // Whole calendar days between the date and the viewer's local today.
  const today = dayjs(now).format('YYYY-MM-DD');
  const days = Math.round(
    (toUtcDate(isoDate) - toUtcDate(today)) / (24 * 60 * 60 * 1000)
  );
  const abs = Math.abs(days);
  // Days up to two weeks, so "9 days ago" never collapses to "last week".
  const [value, unit] =
    abs < 14
      ? [days, 'day']
      : abs < 60
        ? [Math.trunc(days / 7), 'week']
        : abs < 365
          ? [Math.trunc(days / 30), 'month']
          : [Math.trunc(days / 365), 'year'];
  const relative = new Intl.RelativeTimeFormat(locale, {
    numeric: 'auto',
  }).format(value, unit);

  return { absolute, relative };
};
