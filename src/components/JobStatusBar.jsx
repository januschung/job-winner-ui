import React, { useEffect, useState } from 'react';
import { Chip } from '@mui/material';
import Container from '@mui/material/Container';
import { STATUS_COLORS } from '../config/statusColor';
import { useTranslation } from 'react-i18next';

export default function JobStatusBar({ data, handleStatusClick }) {
  const [statusCounts, setStatusCounts] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (data) {
      setStatusCounts(countApplicationsByStatus(data.allJobApplication));
    }
  }, [data]);

  const countApplicationsByStatus = jobApplications => {
    return jobApplications.reduce((acc, jobApplication) => {
      const { status } = jobApplication;
      acc[status] = acc[status] ? acc[status] + 1 : 1;
      return acc;
    }, {});
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pb: 3,
      }}
    >
      <div>
        <Chip
          label={`${t('jobStatusBar.all')} ${data.allJobApplication.length || 0}`}
          onClick={() => handleStatusClick('all')}
          sx={{
            backgroundColor: STATUS_COLORS.all,
            color: 'white',
            '&:hover': { backgroundColor: STATUS_COLORS.all_hover },
            margin: 0.5,
          }}
        />
        <Chip
          label={`${t('jobStatusBar.open')} ${statusCounts?.open || 0}`}
          onClick={() => handleStatusClick('open')}
          disabled={!statusCounts.open}
          sx={{
            backgroundColor: STATUS_COLORS.open,
            color: 'white',
            '&:hover': { backgroundColor: STATUS_COLORS.open_hover },
            margin: 0.5,
          }}
        />
        <Chip
          label={`${t('jobStatusBar.active')} ${statusCounts?.active || 0}`}
          onClick={() => handleStatusClick('active')}
          disabled={!statusCounts.active}
          sx={{
            backgroundColor: STATUS_COLORS.active,
            color: 'white',
            '&:hover': { backgroundColor: STATUS_COLORS.active_hover },
            margin: 0.5,
          }}
        />
        <Chip
          label={`${t('jobStatusBar.ghosted')} ${statusCounts?.ghosted || 0}`}
          onClick={() => handleStatusClick('ghosted')}
          disabled={!statusCounts.ghosted}
          sx={{
            backgroundColor: STATUS_COLORS.ghosted,
            color: 'white',
            '&:hover': { backgroundColor: STATUS_COLORS.ghosted_hover },
            margin: 0.5,
          }}
        />
        <Chip
          label={`${t('jobStatusBar.rejected')} ${statusCounts?.rejected || 0}`}
          onClick={() => handleStatusClick('rejected')}
          disabled={!statusCounts.rejected}
          sx={{
            backgroundColor: STATUS_COLORS.rejected,
            color: 'white',
            '&:hover': { backgroundColor: STATUS_COLORS.rejected_hover },
            margin: 0.5,
          }}
        />
      </div>
    </Container>
  );
}
