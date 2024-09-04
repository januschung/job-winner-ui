import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useQuery } from '@apollo/client';
import { GET_PROFILE } from '../graphql/query';
import SearchBar from './SearchBar';
import JobApplicationDialog from './JobApplicationDialog';
import ProfileDialog from './ProfileDialog';
import JobApplicationList from './JobApplicationList';

export default function PrimarySearchAppBar() {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [jobApplicationOpen, setJobApplicationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const id = 1;

  const { error, data, loading } = useQuery(GET_PROFILE, {
    variables: { id },
  });

  const handleProfileMenuOpen = () => {
    setProfileOpen(true);
    setProfile(data.profileById);
  };

  const handleProfileClose = () => setProfileOpen(false);
  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);
  const handleJobApplicationOpen = () => setJobApplicationOpen(true);
  const handleJobApplicationClose = () => setJobApplicationOpen(false);

  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <JobApplicationDialog
        jobApplication={{ status: 'open' }}
        open={jobApplicationOpen}
        handleClose={handleJobApplicationClose}
        setOpen={setJobApplicationOpen}
        isNew
      />
      <ProfileDialog
        profile={profile}
        open={profileOpen}
        handleClose={handleProfileClose}
        setOpen={setProfileOpen}
      />
      <AppBar position="static">
        <Toolbar>
          <EmojiEventsIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            JOB WINNER
          </Typography>
          <SearchBar onSearch={handleSearch} />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton size="large" aria-label="New" color="inherit" onClick={handleJobApplicationOpen}>
              <AddCircleIcon />
            </IconButton>
            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls="primary-search-account-menu-mobile"
              aria-haspopup="true"
              onClick={(event) => setMobileMoreAnchorEl(event.currentTarget)}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <JobApplicationList searchTerm={searchTerm} />
    </Box>
  );
}
