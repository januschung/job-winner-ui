import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { GET_ALL_INTERVIEWS } from '../graphql/query';
import useJobApplicationDialog from '../hooks/useJobApplicationDialog';
import useSortableTable from '../hooks/useSortableTable';
import JobApplicationDialog from './JobApplicationDialog';
import CustomDialog from './common/CustomDialog';
import SortableTable from './common/SortableTable';
import { getFilteredInterviews } from '../utils/interviewUtil';
import { useTranslation } from 'react-i18next';

export default function InterviewListDialog({ handleClose, open }) {
  const [interviews, setInterviews] = useState([]);
  const { t } = useTranslation();

  const { loading, error, data, refetch } = useQuery(GET_ALL_INTERVIEWS, {
    fetchPolicy: 'network-only',
    onCompleted: data =>
      setInterviews(getFilteredInterviews(data.allInterview)),
  });

  const {
    open: jobDialogOpen,
    jobApplication,
    handleOpen: handleJobDialogOpen,
    handleClose: handleJobDialogClose,
  } = useJobApplicationDialog(() => {
    refetch().then(({ data }) =>
      setInterviews(getFilteredInterviews(data.allInterview))
    );
  });

  const columns = [
    {
      key: 'jobApplication.companyName',
      label: t('dialogs.interviewList.columns.companyName'),
      sortable: true,
      render: (value, row) =>
        value || row.jobApplication?.companyName || t('common.na'),
    },
    {
      key: 'interviewDate',
      label: t('dialogs.interviewList.columns.interviewDate'),
      sortable: true,
    },
    {
      key: 'interviewer',
      label: t('dialogs.interviewList.columns.interviewer'),
      sortable: true,
    },
    { key: 'description', label: t('dialogs.interviewList.columns.note') },
    {
      key: 'status',
      label: t('dialogs.interviewList.columns.status'),
      sortable: true,
    },
    {
      key: 'actions',
      label: t('dialogs.interviewList.columns.jobApplication'),
      render: (value, row) => (
        <Button
          size="small"
          color="info"
          variant="outlined"
          onClick={() => handleJobDialogOpen(row.jobApplication)}
        >
          {t('dialogs.interviewList.jobDetails')}
        </Button>
      ),
      align: 'center',
    },
  ];

  const { sortedData, handleSort, getSortIndicator } = useSortableTable(
    interviews,
    columns
  );

  useEffect(() => {
    if (open) {
      refetch()
        .then(({ data }) => {
          if (data) setInterviews(getFilteredInterviews(data.allInterview));
        })
        .catch(err => console.error('Refetch error:', err));
    }
  }, [open, refetch]);

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      onCancel={handleClose}
      title={t('dialogs.interviewList.title')}
    >
      <DialogContent dividers>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography variant="body1" color="error" align="center">
            {t('common.errorMessage')}
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
      <JobApplicationDialog
        jobApplication={jobApplication}
        open={jobDialogOpen}
        handleClose={handleJobDialogClose}
      />
    </CustomDialog>
  );
}
