import React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function MobileMenu({ mobileMoreAnchorEl, isMobileMenuOpen, handleMobileMenuClose, handleProfileMenuOpen, handleJobApplicationOpen, handleInterviewListDialogOpen, handleOfferListDialogOpen, interviewCount, offerCount }) {
  const mobileMenuId = 'primary-search-account-menu-mobile';
  return (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleJobApplicationOpen}>
        <IconButton size="large" aria-label="New" color="inherit">
          <AddCircleIcon />
        </IconButton>
        <p>New</p>
      </MenuItem>
      <MenuItem onClick={handleInterviewListDialogOpen}>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={interviewCount} color="error">
            <EventAvailableIcon />
          </Badge>
        </IconButton>
        <p>Interviews</p>
      </MenuItem>
      <MenuItem onClick={handleOfferListDialogOpen}>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={offerCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Offers</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton size="large" aria-label="account of current user" aria-controls="primary-search-account-menu" aria-haspopup="true" color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
}
