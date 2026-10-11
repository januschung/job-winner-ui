import { createTheme } from '@mui/material/styles';

const fontFamily = [
  "'Inter Variable'",
  'system-ui',
  '-apple-system',
  "'Segoe UI'",
  'Roboto',
  "'Helvetica Neue'",
  'sans-serif',
].join(',');

// Indigo/violet accents on slate neutrals. Both schemes are emitted as CSS
// variables, so components should read colors through sx palette paths or
// theme.vars rather than theme.palette (which always holds the light values).
const colorSchemes = {
  light: {
    palette: {
      primary: {
        main: '#4F46E5',
        light: '#818CF8',
        dark: '#3730A3',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#7C3AED',
        light: '#A78BFA',
        dark: '#5B21B6',
        contrastText: '#FFFFFF',
      },
      background: { default: '#F8FAFC', paper: '#FFFFFF' },
      text: { primary: '#0F172A', secondary: '#475569' },
      divider: '#E2E8F0',
      custom: {
        table: { header: '#EEF2FF', headerHover: '#E0E7FF' },
      },
    },
  },
  dark: {
    palette: {
      primary: {
        main: '#818CF8',
        light: '#A5B4FC',
        dark: '#6366F1',
        contrastText: '#0B1020',
      },
      secondary: {
        main: '#A78BFA',
        light: '#C4B5FD',
        dark: '#7C3AED',
        contrastText: '#0B1020',
      },
      background: { default: '#0B1120', paper: '#111827' },
      text: { primary: '#E2E8F0', secondary: '#94A3B8' },
      divider: '#1F2937',
      custom: {
        table: { header: '#1E1B4B', headerHover: '#312E81' },
      },
    },
  },
};

export const appTheme = createTheme({
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes,
  shape: { borderRadius: 10 },
  typography: {
    fontFamily,
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.02em' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        // Drop the dark-mode elevation overlay for flatter surfaces.
        root: { backgroundImage: 'none' },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 14,
          border: `1px solid ${theme.vars.palette.divider}`,
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
        }),
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { fontSize: '0.75rem', borderRadius: 6 },
      },
    },
  },
});
