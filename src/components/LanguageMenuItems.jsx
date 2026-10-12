import CheckIcon from '@mui/icons-material/Check';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

// Menu children (not a component wrapper) so MUI Menu keyboard navigation
// sees each MenuItem directly.
export default function languageMenuItems({ t, i18n, onSelect }) {
  return [
    <ListSubheader key="language-header" sx={{ lineHeight: '32px' }}>
      {t('appHeader.language')}
    </ListSubheader>,
    ...LANGUAGES.map(({ code, label }) => {
      const selected = i18n.resolvedLanguage === code;
      return (
        <MenuItem
          key={code}
          selected={selected}
          lang={code}
          onClick={() => {
            i18n.changeLanguage(code);
            onSelect?.();
          }}
        >
          <ListItemIcon>
            {selected && <CheckIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>{label}</ListItemText>
        </MenuItem>
      );
    }),
  ];
}

export const useLanguageMenuItems = onSelect => {
  const { t, i18n } = useTranslation();
  return languageMenuItems({ t, i18n, onSelect });
};
