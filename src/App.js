import React from "react";
import { CssBaseline } from "@mui/material";
import AppHeader from "./components/AppHeader";
import { SnackbarProvider } from './components/common/SnackbarContext';
import { ThemeContextProvider } from "./components/ThemeContext";

function App() {
  
  return (
    <ThemeContextProvider>
      <CssBaseline />
      <SnackbarProvider>
        <AppHeader />
        <div className="App"></div>
      </SnackbarProvider>
    </ThemeContextProvider>
  );
}

export default App;
