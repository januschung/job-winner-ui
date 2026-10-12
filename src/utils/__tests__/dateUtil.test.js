import { describe, expect, test } from 'vitest';
import { formatCalendarDate } from '../dateUtil';

// Fixed "today" so results never depend on when the suite runs.
const NOW = new Date(2026, 9, 11, 9, 30); // Oct 11, 2026, local time

describe('formatCalendarDate', () => {
  test('formats an absolute date per locale', () => {
    expect(formatCalendarDate('2026-10-02', 'en', NOW).absolute).toBe(
      'Oct 2, 2026'
    );
    expect(formatCalendarDate('2026-10-02', 'es', NOW).absolute).toBe(
      '2 oct 2026'
    );
  });

  test('keeps the calendar day regardless of time of day', () => {
    const lateEvening = new Date(2026, 9, 11, 23, 59);
    expect(formatCalendarDate('2026-10-11', 'en', lateEvening)).toEqual({
      absolute: 'Oct 11, 2026',
      relative: 'today',
    });
  });

  test.each([
    ['2026-10-10', 'yesterday'],
    ['2026-10-02', '9 days ago'],
    ['2026-09-20', '3 weeks ago'],
    ['2026-07-11', '3 months ago'],
    ['2024-10-11', '2 years ago'],
    ['2026-10-20', 'in 9 days'],
  ])('relative label for %s is "%s"', (date, label) => {
    expect(formatCalendarDate(date, 'en', NOW).relative).toBe(label);
  });

  test.each([undefined, '', 'not a date', '2026-02-30', '10/02/2026'])(
    'returns null for invalid input %p',
    value => {
      expect(formatCalendarDate(value, 'en', NOW)).toBeNull();
    }
  );
});
