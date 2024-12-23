import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import CancelIcon from '@mui/icons-material/Cancel';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { GET_ALL_INTERVIEWS } from '../graphql/query';
import useJobApplicationDialog from './hooks/useJobApplicationDialog';
import JobApplicationDialog from './JobApplicationDialog';
import DialogTitleBar from './DialogTitleBar';
import useSortableTable from './hooks/useSortableTable';
import SortableTable from './common/SortableTable';
import { getFilteredInterviews } from '../utils/interviewUtil';

export default function InterviewListDialog({ handleClose, open }) {
  const [interviews, setInterviews] = useState([]);
  
  const { loading, error, data, refetch } = useQuery(GET_ALL_INTERVIEWS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => setInterviews(getFilteredInterviews(data.allInterview)),
  });

  const { 
    open: jobDialogOpen, 
    jobApplication, 
    handleOpen: handleJobDialogOpen, 
    handleClose: handleJobDialogClose 
  } = useJobApplicationDialog(() => {
    refetch().then(({ data }) => setInterviews(getFilteredInterviews(data.allInterview)));
  });

  const columns = [
    {
      key: 'jobApplication.companyName', // Nested property example
      label: 'Company Name',
      sortable: true,
      render: (value, row) => value || row.jobApplication?.companyName || 'N/A', // Fallback for nested value
    },
    { key: 'interviewDate', label: 'Interview Date', sortable: true },
    { key: 'interviewer', label: 'Interviewer', sortable: true },
    { key: 'description', label: 'Note' },
    { key: 'status', label: 'Status', sortable: true },
    {
      key: 'actions',
      label: 'Job Application',
      render: (value, row) => (
        <Button 
          size="small" 
          color="info" 
          variant="outlined" 
          onClick={() => handleJobDialogOpen(row.jobApplication)}
        >
          Job Details
        </Button>
      ),
      align: 'center',
    },
  ];

  const { sortedData, handleSort, getSortIndicator } = useSortableTable(interviews, columns);

  useEffect(() => {
    if (open) {
      refetch()
        .then(({ data }) => {
          if (data) setInterviews(getFilteredInterviews(data.allInterview));
        })
        .catch((err) => console.error('Refetch error:', err));
    }
  }, [open, refetch]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(8px)',
          },
        },
      }}
    >
      <DialogTitleBar title="Interview List" />
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography variant="body1" color="error" align="center">
            Something went wrong. Please try again later.
          </Typography>
        ) : (
          <SortableTable
            data={sortedData}
            columns={columns}
            handleSort={handleSort}
            getSortIndicator={getSortIndicator}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button color="info" variant="outlined" startIcon={<CancelIcon />} onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
      <JobApplicationDialog
        jobApplication={jobApplication}
        open={jobDialogOpen}
        handleClose={handleJobDialogClose}
      />
    </Dialog>
  );
}
