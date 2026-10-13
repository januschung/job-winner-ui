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
      // Job status tones: main for accents, soft/text for tinted chips,
      // solid/solidText for the selected filter. All text pairs pass WCAG AA.
      status: {
        all: {
          main: '#475569',
          soft: '#F1F5F9',
          text: '#334155',
          solid: '#334155',
          solidText: '#FFFFFF',
        },
        open: {
          main: '#0284C7',
          soft: '#E0F2FE',
          text: '#075985',
          solid: '#075985',
          solidText: '#FFFFFF',
        },
        active: {
          main: '#059669',
          soft: '#D1FAE5',
          text: '#065F46',
          solid: '#065F46',
          solidText: '#FFFFFF',
        },
        ghosted: {
          main: '#D97706',
          soft: '#FEF3C7',
          text: '#92400E',
          solid: '#92400E',
          solidText: '#FFFFFF',
        },
        rejected: {
          main: '#E11D48',
          soft: '#FFE4E6',
          text: '#9F1239',
          solid: '#9F1239',
          solidText: '#FFFFFF',
        },
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
      // MUI's default dark red fails contrast with white button text.
      error: {
        main: '#F87171',
        light: '#FCA5A5',
        dark: '#DC2626',
        contrastText: '#0B1020',
      },
      background: { default: '#0B1120', paper: '#111827' },
      text: { primary: '#E2E8F0', secondary: '#94A3B8' },
      divider: '#1F2937',
      custom: {
        table: { header: '#1E1B4B', headerHover: '#312E81' },
      },
      status: {
        all: {
          main: '#94A3B8',
          soft: '#1E293B',
          text: '#CBD5E1',
          solid: '#94A3B8',
          solidText: '#0B1020',
        },
        open: {
          main: '#38BDF8',
          soft: '#082F49',
          text: '#7DD3FC',
          solid: '#38BDF8',
          solidText: '#0B1020',
        },
        active: {
          main: '#34D399',
          soft: '#022C22',
          text: '#6EE7B7',
          solid: '#34D399',
          solidText: '#0B1020',
        },
        ghosted: {
          main: '#FBBF24',
          soft: '#451A03',
          text: '#FCD34D',
          solid: '#FBBF24',
          solidText: '#0B1020',
        },
        rejected: {
          main: '#FB7185',
          soft: '#4C0519',
          text: '#FDA4AF',
          solid: '#FB7185',
          solidText: '#0B1020',
        },
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
