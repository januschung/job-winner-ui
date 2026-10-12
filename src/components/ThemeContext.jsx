import { ThemeProvider, useColorScheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { appTheme } from '../config/theme';

// Same storage key the app used before, so saved light/dark choices carry over.
export const COLOR_MODE_STORAGE_KEY = 'theme';

export const useColorMode = () => {
  const { mode, systemMode, setMode } = useColorScheme();
  const resolvedMode = (mode === 'system' ? systemMode : mode) || 'light';

  const toggleColorMode = () =>
    setMode(resolvedMode === 'dark' ? 'light' : 'dark');

  return { mode: resolvedMode, toggleColorMode };
};

export const ThemeContextProvider = ({ children }) => (
  <ThemeProvider
    theme={appTheme}
    defaultMode="system"
    modeStorageKey={COLOR_MODE_STORAGE_KEY}
  >
    <CssBaseline />
    {children}
  </ThemeProvider>
);
