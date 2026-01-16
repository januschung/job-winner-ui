import { useQuery } from '@apollo/client';
import { Brightness4, Brightness7, GitHub } from '@mui/icons-material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MoreIcon from '@mui/icons-material/MoreVert';
import NotificationsIcon from '@mui/icons-material/Notifications';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { Tooltip } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useState, useEffect } from 'react';
import {
  GET_ALL_INTERVIEWS,
  GET_ALL_OFFERS,
  GET_PROFILE,
} from '../graphql/query';
import useDialog from '../hooks/useDialog';
import useJobApplicationDialog from '../hooks/useJobApplicationDialog';
import { getFilteredInterviews } from '../utils/interviewUtil';
import FrequentUrlDialog from './FrequentUrlDialog';
import InterviewListDialog from './InterviewListDialog';
import JobApplicationDialog from './JobApplicationDialog';
import JobApplicationList from './JobApplicationList';
import MobileMenu from './MobileMenu';
import OfferListDialog from './OfferListDialog';
import ProfileDialog from './ProfileDialog';
import QuestionDialog from './QuestionDialog';
import SearchBar from './SearchBar';
import { useColorMode } from './ThemeContext';
import { useTranslation } from 'react-i18next';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useTheme, useMediaQuery } from '@mui/material';

export default function AppHeader() {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { mode, toggleColorMode } = useColorMode();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const {
    data: offersData,
    loading: offersLoading,
    error: offersError,
    refetch: refetchOffers,
  } = useQuery(GET_ALL_OFFERS, {
    fetchPolicy: 'network-only',
  });
  const {
    data: interviewsData,
    loading: interviewsLoading,
    error: interviewsError,
    refetch: refetchInterviews,
  } = useQuery(GET_ALL_INTERVIEWS, {
    fetchPolicy: 'network-only',
  });
  const { open, handleOpen, handleClose } =
    useJobApplicationDialog(refetchOffers);

  const {
    dialogOpen: offerListingDialogOpen,
    handleOpen: handleOfferListDialogOpen,
    handleClose: handleOfferListDialogClose,
  } = useDialog(refetchOffers);

  const {
    dialogOpen: interviewListingDialogOpen,
    handleOpen: handleInterviewListDialogOpen,
    handleClose: handleInterviewListDialogClose,
  } = useDialog(refetchInterviews);

  const {
    dialogOpen: frequentUrlsDialogOpen,
    handleOpen: handleFrequentUrlsDialogOpen,
    handleClose: handleFrequentUrlsDialogClose,
  } = useDialog();

  const {
    dialogOpen: questionDialogOpen,
    handleOpen: handleQuestionDialogOpen,
    handleClose: handleQuestionDialogClose,
  } = useDialog();

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const id = 1;

  const { error, data, loading } = useQuery(GET_PROFILE, {
    variables: { id },
  });

  const offerCount = offersData?.allOffer?.length || 0;

  const filteredInterviews = getFilteredInterviews(
    interviewsData?.allInterview
  );

  const interviewCount = filteredInterviews?.length || 0;

  const handleProfileMenuOpen = () => {
    setProfileOpen(true);
    setProfile(data.profileById);
  };

  const handleProfileClose = () => setProfileOpen(false);
  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);

  const handleSearch = text => {
    setSearchTerm(text);
  };

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  const handleLanguageChange = event => {
    i18n.changeLanguage(event.target.value);
  };

  useEffect(() => {
    if (isDesktop && mobileMoreAnchorEl) {
      setMobileMoreAnchorEl(null);
    }
  }, [isDesktop, mobileMoreAnchorEl]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <JobApplicationDialog
        jobApplication={{ status: 'open' }}
        open={open}
        handleClose={handleClose}
        setOpen={handleOpen}
        isNew
      />
      <FrequentUrlDialog
        open={frequentUrlsDialogOpen}
        handleClose={handleFrequentUrlsDialogClose}
        setOpen={handleFrequentUrlsDialogOpen}
      />
      <QuestionDialog
        open={questionDialogOpen}
        handleClose={handleQuestionDialogClose}
        setOpen={handleQuestionDialogOpen}
      />
      <ProfileDialog
        profile={profile}
        open={profileOpen}
        handleClose={handleProfileClose}
      />
      <InterviewListDialog
        open={interviewListingDialogOpen}
        handleClose={handleInterviewListDialogClose}
        setOpen={handleInterviewListDialogOpen}
      />
      <OfferListDialog
        open={offerListingDialogOpen}
        handleClose={handleOfferListDialogClose}
        setOpen={handleOfferListDialogOpen}
      />
      <AppBar position="static">
        <Toolbar sx={{ position: 'relative' }}>
          <Box
            sx={{
              display: { xs: isSearchExpanded ? 'none' : 'flex', md: 'flex' },
              alignItems: 'center',
            }}
          >
            <EmojiEventsIcon sx={{ color: '#FFD700', mr: 2 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: 'flex',
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {t('appHeader.appTitle')}
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <SearchBar onSearch={handleSearch} value={searchTerm} />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{
              display: { xs: isSearchExpanded ? 'none' : 'none', md: 'flex' },
            }}
          >
            <Tooltip title={t('appHeader.newJobApplication')}>
              <IconButton
                size="large"
                aria-label="New"
                color="inherit"
                onClick={handleOpen}
              >
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('appHeader.bookmarks')}>
              <IconButton
                size="large"
                aria-label="Bookmarks"
                color="inherit"
                onClick={handleFrequentUrlsDialogOpen}
              >
                <BookmarksIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('appHeader.qa')}>
              <IconButton
                size="large"
                aria-label="Q&A"
                color="inherit"
                onClick={handleQuestionDialogOpen}
              >
                <QuestionAnswerIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('appHeader.interviewList')}>
              <IconButton
                size="large"
                color="inherit"
                onClick={handleInterviewListDialogOpen}
              >
                <Badge
                  badgeContent={interviewsLoading ? '...' : interviewCount}
                  color="error"
                >
                  <EventAvailableIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title={t('appHeader.offerList')}>
              <IconButton
                size="large"
                color="inherit"
                onClick={handleOfferListDialogOpen}
              >
                <Badge
                  badgeContent={offersLoading ? '...' : offerCount}
                  color="error"
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Select
              value={i18n.language}
              onChange={handleLanguageChange}
              sx={{
                color: 'inherit',
                border: 'none',
                '& .MuiSelect-icon': { color: 'inherit' },
              }}
            >
              <MenuItem value="en">EN</MenuItem>
              <MenuItem value="es">ES</MenuItem>
            </Select>
            <Tooltip
              title={
                mode === 'dark'
                  ? t('appHeader.lightMode')
                  : t('appHeader.darkMode')
              }
            >
              <IconButton onClick={toggleColorMode} color="inherit">
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
            <Tooltip title={t('appHeader.githubStar')}>
              <IconButton
                href="https://github.com/januschung/job-winner-ui"
                target="_blank"
                color="inherit"
              >
                <GitHub />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('appHeader.profile')}>
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
            </Tooltip>
          </Box>
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <SearchBar
              onSearch={handleSearch}
              isExpanded={isSearchExpanded}
              onToggle={handleSearchToggle}
              value={searchTerm}
            />
          </Box>
          <Box
            sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}
          >
            {!isSearchExpanded && (
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls="primary-search-account-menu-mobile"
                aria-haspopup="true"
                onClick={event => setMobileMoreAnchorEl(event.currentTarget)}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
        <MobileMenu
          mobileMoreAnchorEl={mobileMoreAnchorEl}
          isMobileMenuOpen={isMobileMenuOpen}
          handleMobileMenuClose={handleMobileMenuClose}
          handleProfileMenuOpen={handleProfileMenuOpen}
          handleJobApplicationOpen={handleOpen}
          handleFrequentUrlsDialogOpen={handleFrequentUrlsDialogOpen}
          handleQuestionDialogOpen={handleQuestionDialogOpen}
          handleInterviewListDialogOpen={handleInterviewListDialogOpen}
          handleOfferListDialogOpen={handleOfferListDialogOpen}
          interviewCount={interviewCount}
          offerCount={offerCount}
          colorMode={mode}
          toggleColorMode={toggleColorMode}
          i18n={i18n}
        />
      </AppBar>
      <JobApplicationList searchTerm={searchTerm} />
    </Box>
  );
}
