import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';
import { JOB_STATUSES, statusColor } from '../config/status';

const FILTERS = ['all', ...JOB_STATUSES];

export default function JobStatusBar({
  data,
  selectedStatus = 'all',
  handleStatusClick,
}) {
  const { t } = useTranslation();

  const counts = useMemo(() => {
    const applications = data?.allJobApplication || [];
    return applications.reduce(
      (acc, { status }) => ({ ...acc, [status]: (acc[status] || 0) + 1 }),
      { all: applications.length }
    );
  }, [data]);

  return (
    <Box
      role="group"
      aria-label={t('jobStatusBar.label')}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 1,
        pb: 3,
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
  );
}
