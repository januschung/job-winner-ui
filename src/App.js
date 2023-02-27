import JobApplicationList from './components/JobApplicationList';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PrimarySearchAppBar from './components/SearchBar';
import { Route, Routes } from "react-router-dom"

const theme = createTheme();


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PrimarySearchAppBar/>
      <div className="App">
      <Routes>
        <Route path="/" element={<JobApplicationList/ >} />
      </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
