import React from 'react';
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import { useTheme, useMediaQuery } from '@mui/material';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function SearchBar({
  onSearch,
  isExpanded,
  onToggle,
  value = '',
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleInputChange = event => {
    const inputText = event.target.value;
    onSearch(inputText);
  };

  if (isMobile && onToggle) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {!isExpanded && (
          <IconButton
            color="inherit"
            onClick={onToggle}
            aria-label="search"
            sx={{
              backgroundColor: alpha(theme.palette.common.white, 0.15),
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.25),
              },
            }}
          >
            <SearchIcon />
          </IconButton>
        )}
        <Slide direction="down" in={isExpanded} mountOnEnter unmountOnExit>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              px: 2,
              zIndex: 1,
              backgroundColor: 'inherit',
            }}
          >
            <Search sx={{ width: '100%', pr: 5, m: 0 }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder={t('searchBar.placeholder')}
                inputProps={{ 'aria-label': 'search' }}
                value={value}
                onChange={handleInputChange}
                autoFocus
              />
              <IconButton
                size="small"
                onClick={onToggle}
                aria-label="close search"
                sx={{
                  position: 'absolute',
                  right: theme.spacing(0.5),
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'inherit',
                  padding: theme.spacing(0.5),
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Search>
          </Box>
        </Slide>
      </Box>
    );
  }

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder={t('searchBar.placeholder')}
        inputProps={{ 'aria-label': 'search' }}
        value={value}
        onChange={handleInputChange}
      />
    </Search>
  );
}
