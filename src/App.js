import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppHeader from './components/AppHeader';
import { SnackbarProvider } from './components/common/SnackbarContext';

const theme = createTheme();


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <AppHeader/>
          <div className="App">
          </div>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
