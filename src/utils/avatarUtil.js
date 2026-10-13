function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

// Relative luminance per WCAG 2.x, for a '#rrggbb' color.
const luminance = hex => {
  const [r, g, b] = [1, 3, 5].map(i => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// Black or white, whichever contrasts more with `background` (always at
// least 4.5:1).
export const readableTextColor = background =>
  luminance(background) > 0.179 ? '#000000' : '#FFFFFF';

export function stringAvatar(name) {
  const nameParts = name.split(' ');
  const initials = nameParts[0][0] + (nameParts[1]?.[0] || ''); // Handle single-word names

  const bgcolor = stringToColor(name);
  return {
    sx: {
      bgcolor,
      color: readableTextColor(bgcolor),
    },
    children: initials.toUpperCase(),
  };
}
