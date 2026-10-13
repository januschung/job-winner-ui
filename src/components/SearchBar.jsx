import { useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
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
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.vars.palette.divider}`,
  backgroundColor: theme.vars.palette.background.default,
  transition: theme.transitions.create(['border-color', 'box-shadow']),
  '&:hover': {
    borderColor: theme.vars.palette.text.secondary,
  },
  '&:focus-within': {
    borderColor: theme.vars.palette.primary.main,
    boxShadow: `0 0 0 3px rgba(${theme.vars.palette.primary.mainChannel} / 0.2)`,
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1.5),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  color: theme.vars.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  flex: 1,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    width: '100%',
  },
}));

// Keyboard hint shown at the end of the desktop field.
const ShortcutHint = styled('kbd')(({ theme }) => ({
  marginRight: theme.spacing(1),
  padding: theme.spacing(0, 0.75),
  minWidth: 20,
  textAlign: 'center',
  borderRadius: 4,
  border: `1px solid ${theme.vars.palette.divider}`,
  color: theme.vars.palette.text.secondary,
  fontFamily: 'inherit',
  fontSize: '0.75rem',
  lineHeight: '18px',
}));

const isTypingTarget = el =>
  el &&
  (el.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));

export default function SearchBar({
  onSearch,
  isExpanded,
  onToggle,
  value = '',
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const inputRef = useRef(null);
  const showMobile = isMobile && onToggle;

  // "/" focuses the desktop search field unless the user is already typing.
  useEffect(() => {
    if (showMobile) return undefined;
    const handleKeyDown = event => {
      if (
        event.key === '/' &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !isTypingTarget(document.activeElement)
      ) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showMobile]);

  const handleInputChange = event => {
    onSearch(event.target.value);
  };

  if (showMobile) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {!isExpanded && (
          <IconButton color="inherit" onClick={onToggle} aria-label="search">
            <SearchIcon />
          </IconButton>
        )}
        <Slide direction="down" in={isExpanded} mountOnEnter unmountOnExit>
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              px: 2,
              zIndex: 1,
              bgcolor: 'background.paper',
            }}
          >
            <Search>
              <SearchIconWrapper>
                <SearchIcon fontSize="small" />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder={t('searchBar.placeholder')}
                inputProps={{ 'aria-label': 'search' }}
                value={value}
                onChange={handleInputChange}
                // Shown only after the user taps the search icon.
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
              />
              <IconButton
                size="small"
                onClick={onToggle}
                aria-label="close search"
                sx={{ mr: 0.5 }}
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
        <SearchIcon fontSize="small" />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder={t('searchBar.placeholder')}
        inputRef={inputRef}
        inputProps={{ 'aria-label': 'search', 'aria-keyshortcuts': '/' }}
        value={value}
        onChange={handleInputChange}
      />
      {!value && <ShortcutHint aria-hidden>/</ShortcutHint>}
    </Search>
  );
}
