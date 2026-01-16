import React, { createContext, useState, useMemo, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createAppTheme } from '../config/theme';

const ColorModeContext = createContext();

export const useColorMode = () => useContext(ColorModeContext);

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem('theme') || 'light');

  const toggleColorMode = () => {
    setMode(prevMode => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newMode);
      return newMode;
    });
  };

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
