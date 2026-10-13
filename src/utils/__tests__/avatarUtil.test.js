import { describe, expect, test } from 'vitest';
import { readableTextColor, stringAvatar } from '../avatarUtil';

// WCAG contrast ratio between two '#rrggbb' colors.
const contrast = (a, b) => {
  const lum = hex => {
    const [r, g, b] = [1, 3, 5].map(i => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe('readableTextColor', () => {
  test('uses white on dark and black on light backgrounds', () => {
    expect(readableTextColor('#1A237E')).toBe('#FFFFFF');
    expect(readableTextColor('#B3E5FC')).toBe('#000000');
  });

  test('meets 4.5:1 for every avatar color', () => {
    const names = Array.from({ length: 500 }, (_, i) => `Bookmark ${i}`);
    for (const name of names) {
      const { bgcolor, color } = stringAvatar(name).sx;
      expect(contrast(bgcolor, color)).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe('stringAvatar', () => {
  test('uses up to two initials', () => {
    expect(stringAvatar('We Work Remotely').children).toBe('WW');
    expect(stringAvatar('indeed').children).toBe('I');
  });
});
