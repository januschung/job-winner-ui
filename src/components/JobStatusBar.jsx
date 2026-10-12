import { useEffect, useMemo, useRef, useState } from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';
import { JOB_STATUSES, statusColor } from '../config/status';

const FILTERS = ['all', ...JOB_STATUSES];

// Edge fade over the scrolling chip row (small screens only).
const fade = side => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  [side]: 0,
  width: 32,
  pointerEvents: 'none',
  display: { xs: 'block', sm: 'none' },
  background: theme => {
    const bg = theme.vars.palette.background.defaultChannel;
    const to = side === 'right' ? '90deg' : '270deg';
    return `linear-gradient(${to}, rgba(${bg} / 0), rgba(${bg} / 1))`;
  },
});

export default function JobStatusBar({
  data,
  selectedStatus = 'all',
  handleStatusClick,
}) {
  const { t } = useTranslation();
  const scrollerRef = useRef(null);
  const [overflow, setOverflow] = useState({ left: false, right: false });

  const counts = useMemo(() => {
    const applications = data?.allJobApplication || [];
    return applications.reduce(
      (acc, { status }) => ({ ...acc, [status]: (acc[status] || 0) + 1 }),
      { all: applications.length }
    );
  }, [data]);

  // Track whether the row can scroll further in each direction.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;
    const update = () =>
      setOverflow({
        left: el.scrollLeft > 1,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
      });
    update();
    el.addEventListener('scroll', update, { passive: true });
    const resize =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    resize?.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      resize?.disconnect();
    };
  }, []);

  // Keep the selected chip visible when the row scrolls.
  useEffect(() => {
    scrollerRef.current
      ?.querySelector('[aria-pressed="true"]')
      ?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  }, [selectedStatus]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
      <Box sx={{ position: 'relative', minWidth: 0 }}>
        <Box
          ref={scrollerRef}
          role="group"
          aria-label={t('jobStatusBar.label')}
          sx={{
            display: 'flex',
            gap: 1,
            py: 0.5,
            flexWrap: { xs: 'nowrap', sm: 'wrap' },
            overflowX: { xs: 'auto', sm: 'visible' },
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {FILTERS.map(status => {
            const count = counts[status] || 0;
            const selected = selectedStatus === status;
            return (
              <Chip
                key={status}
                clickable
                aria-pressed={selected}
                disabled={status !== 'all' && count === 0}
                onClick={() => handleStatusClick(status)}
                icon={
                  <Box
                    component="span"
                    aria-hidden
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: selected
                        ? statusColor(status, 'solidText')
                        : statusColor(status, 'main'),
                    }}
                  />
                }
                label={
                  <>
                    {t(`jobStatusBar.${status}`)}{' '}
                    <Box
                      component="span"
                      sx={{ ml: 0.25, fontWeight: 700, opacity: 0.85 }}
                    >
                      {count}
                    </Box>
                  </>
                }
                sx={{
                  flexShrink: 0,
                  px: 0.5,
                  border: 1,
                  borderColor: selected
                    ? statusColor(status, 'solid')
                    : statusColor(status, 'soft'),
                  bgcolor: selected
                    ? statusColor(status, 'solid')
                    : statusColor(status, 'soft'),
                  color: selected
                    ? statusColor(status, 'solidText')
                    : statusColor(status, 'text'),
                  '& .MuiChip-icon': { ml: 1, mr: -0.25 },
                  '&:hover': {
                    borderColor: statusColor(status, 'main'),
                    bgcolor: selected
                      ? statusColor(status, 'solid')
                      : statusColor(status, 'soft'),
                  },
                }}
              />
            );
          })}
        </Box>
        {overflow.left && <Box aria-hidden sx={fade('left')} />}
        {overflow.right && <Box aria-hidden sx={fade('right')} />}
      </Box>
      {selectedStatus !== 'all' && (
        <Button
          size="small"
          startIcon={<CloseRoundedIcon />}
          onClick={() => handleStatusClick('all')}
          aria-label={t('jobStatusBar.clearLabel')}
          sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
        >
          {t('jobStatusBar.clear')}
        </Button>
      )}
    </Box>
  );
}
