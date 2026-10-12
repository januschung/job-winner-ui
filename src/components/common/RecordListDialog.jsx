import { useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import useJobApplicationDialog from '../../hooks/useJobApplicationDialog';
import useSortableTable from '../../hooks/useSortableTable';
import JobApplicationDialog from '../JobApplicationDialog';
import CustomDialog from './CustomDialog';
import SortableTable from './SortableTable';

// A sortable table of records that belong to job applications (interviews,
// offers), with a button per row that opens the related application.
export default function RecordListDialog({
  open,
  handleClose,
  query,
  selectRows,
  columns,
  title,
  jobColumnLabel,
  jobDetailsLabel,
}) {
  const { t } = useTranslation();
  const { data, loading, error, refetch } = useQuery(query, {
    fetchPolicy: 'network-only',
  });
  const rows = useMemo(
    () => (data ? selectRows(data) : []),
    [data, selectRows]
  );

  const {
    open: jobDialogOpen,
    jobApplication,
    handleOpen: handleJobDialogOpen,
    handleClose: handleJobDialogClose,
  } = useJobApplicationDialog(() => refetch());

  const allColumns = [
    ...columns,
    {
      key: 'actions',
      label: jobColumnLabel,
      render: (value, row) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => handleJobDialogOpen(row.jobApplication)}
        >
          {jobDetailsLabel}
        </Button>
      ),
      align: 'center',
    },
  ];

  const { sortedData, handleSort, getSortIndicator } = useSortableTable(
    rows,
    allColumns
  );

  useEffect(() => {
    if (open) {
      refetch().catch(err => console.error('Refetch error:', err));
    }
  }, [open, refetch]);

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      onCancel={handleClose}
      title={title}
    >
      <DialogContent dividers>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
            }}
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
            columns={allColumns}
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
