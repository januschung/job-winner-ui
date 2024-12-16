import JobApplicationList from './components/JobApplicationList';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppHeader from './components/AppHeader';
import { Route, Routes } from "react-router-dom"

const theme = createTheme();


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppHeader/>
      <div className="App">
      </div>
    </ThemeProvider>
  );
}

export default App;
