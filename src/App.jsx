import './i18n';
import React from 'react';
import AppHeader from './components/AppHeader';
import { SnackbarProvider } from './components/common/SnackbarContext';
import { ThemeContextProvider } from './components/ThemeContext';

function App() {
  return (
    <ThemeContextProvider>
      <SnackbarProvider>
        <AppHeader />
      </SnackbarProvider>
    </ThemeContextProvider>
  );
}

export default App;
