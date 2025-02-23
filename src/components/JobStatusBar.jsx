import React, { useEffect, useState } from 'react';
import { Chip } from '@mui/material'
import Container from '@mui/material/Container';
import { STATUS_COLORS } from '../config/statusColor';


export default function JobStatusBar({ data, handleStatusClick }) {

  const [statusCounts, setStatusCounts] = useState([]);

  useEffect(() => {
    if (data) {
      setStatusCounts(countApplicationsByStatus(data.allJobApplication));
    }
  }, [data]);

  const countApplicationsByStatus = (jobApplications) => {
    return jobApplications.reduce((acc, jobApplication) => {
      const { status } = jobApplication;
      acc[status] = acc[status] ? acc[status] + 1 : 1;
      return acc;
    }, {});
  };

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pb: 3 }}>
      <div>
        <Chip
          label={`All ${data.allJobApplication.length || 0}`}
          onClick={() => handleStatusClick('all')}
          sx={{
            backgroundColor: STATUS_COLORS.all,
            color: 'white',
            '&:hover': { backgroundColor: STATUS_COLORS.all_hover },
            margin: 0.5,
          }}
        />
        <Chip
          label={`Open ${statusCounts?.open || 0}`}
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
          label={`Active ${statusCounts?.active || 0}`}
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
          label={`Ghosted ${statusCounts?.ghosted || 0}`}
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
          label={`Rejected ${statusCounts?.rejected || 0}`}
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
