import React, { useState, useMemo } from "react";
import { CssBaseline } from "@mui/material";
// import { createAppTheme } from "./config/theme";
import AppHeader from "./components/AppHeader";
import { SnackbarProvider } from './components/common/SnackbarContext';
import { ThemeContextProvider } from "./components/ThemeContext";

function App() {
  // const [mode, setMode] = useState("light");

  // const theme = useMemo(() => createAppTheme(mode), [mode]);

  // const toggleColorMode = () => {
  //   setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  // };

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
