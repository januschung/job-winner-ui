// import logo from './logo.svg';
// import './App.css';
import JobApplicationList from './pages/JobApplicationList';
import NewJobApplication from './pages/newJobApplication';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PrimarySearchAppBar from './components/SearchBar';
import { Route, Routes, Navigate } from "react-router-dom"

const theme = createTheme();


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PrimarySearchAppBar/>
      <div className="App">
      <Routes>
        <Route path="/" element={<JobApplicationList/ >} />
        <Route path="/new" element={<NewJobApplication/>} />
        <Route path="/success" element={<Navigate to='/'/>} />
      </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
