import { useEffect, useState } from 'react';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';

// Copies `text` to the clipboard and briefly confirms with a check mark.
const CopyButton = ({ text }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  const label = t(copied ? 'common.copied' : 'common.copy');
  return (
    <Tooltip title={label} open={copied || undefined}>
      <IconButton
        onClick={handleCopy}
        size="small"
        edge="end"
        aria-label={label}
        sx={{ color: copied ? 'success.main' : 'text.secondary' }}
      >
        {copied ? (
          <CheckRoundedIcon fontSize="small" />
        ) : (
          <ContentCopyOutlinedIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default CopyButton;
