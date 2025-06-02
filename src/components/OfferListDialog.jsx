import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { GET_ALL_OFFERS } from '../graphql/query';
import JobApplicationDialog from './JobApplicationDialog';
import useJobApplicationDialog from '../hooks/useJobApplicationDialog';
import useSortableTable from '../hooks/useSortableTable';
import SortableTable from './common/SortableTable';
import CustomDialog from './common/CustomDialog';
import { useTranslation } from 'react-i18next';

export default function OfferListDialog({ handleClose, open }) {
  const [offers, setOffers] = useState([]);
  const { t } = useTranslation();

  const { loading, error, data, refetch } = useQuery(GET_ALL_OFFERS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => setOffers(data.allOffer),
  });

  const { 
    open: jobDialogOpen, 
    jobApplication, 
    handleOpen: handleJobDialogOpen, 
    handleClose: handleJobDialogClose 
  } = useJobApplicationDialog(() => {
    refetch().then(({ data }) => setOffers(data.allOffer));
  });

  const columns = [
    {
      key: 'jobApplication.companyName',
      label: t('dialogs.offerList.columns.companyName'),
      sortable: true,
      render: (value, row) => value || row.jobApplication?.companyName || t('common.na'),
    },
    { key: 'offerDate', label: t('dialogs.offerList.columns.offerDate'), sortable: true },
    { key: 'salaryOffered', label: t('dialogs.offerList.columns.salaryOffered'), sortable: true },
    { key: 'description', label: t('dialogs.offerList.columns.note') },
    {
      key: 'actions',
      label: t('dialogs.offerList.columns.jobApplication'),
      render: (value, row) => (
        <Button 
          size="small" 
          color="info" 
          variant="outlined" 
          onClick={() => handleJobDialogOpen(row.jobApplication)}
        >
          {t('dialogs.offerList.jobDetails')}
        </Button>
      ),
      align: 'center',
    },
  ];

  const { sortedData, handleSort, getSortIndicator } = useSortableTable(offers, columns);

  useEffect(() => {
    if (open) {
      refetch()
        .then(({ data }) => {
          if (data) setOffers(data.allOffer);
        })
        .catch((err) => console.error('Refetch error:', err));
    }
  }, [open, refetch]);

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      onCancel={handleClose}
      title={t('dialogs.offerList.title')}
    >
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
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
