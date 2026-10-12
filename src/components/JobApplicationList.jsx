import { useEffect, useMemo, useState } from 'react';
import { useMutation } from '@apollo/client/react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import WorkOutlinedIcon from '@mui/icons-material/WorkOutlined';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MountOnFirstOpen from './common/MountOnFirstOpen';
import { JobApplicationDialog } from './lazyDialogs';
import { STATUS_SORT_ORDER } from '../config/status';
import { DELETE_JOB_APPLICATION } from '../graphql/mutation';
import { GET_JOB_APPLICATIONS } from '../graphql/query';
import useConfirmedAction from '../hooks/useConfirmedAction';
import useJobApplicationDialog from '../hooks/useJobApplicationDialog';
import useJobApplications from '../hooks/useJobApplications';
import { useAppDialogs } from './AppDialogsContext';
import ConfirmDialog from './common/ConfirmDialog';
import EmptyState from './common/EmptyState';
import Loading from './common/Loading';
import JobApplicationCard from './JobApplicationCard';
import JobStatusBar from './JobStatusBar';
import { useTranslation } from 'react-i18next';

const matchesSearch = (job, searchTerm) => {
  const term = (searchTerm || '').toLowerCase();
  return [job.companyName, job.description, job.jobTitle].some(text =>
    (text || '').toLowerCase().includes(term)
  );
};

// Most actionable first (see STATUS_SORT_ORDER), newest first within a status.
const sortByStatusThenDate = jobs =>
  [...jobs].sort(
    (a, b) =>
      (STATUS_SORT_ORDER[a.status] ?? 99) -
        (STATUS_SORT_ORDER[b.status] ?? 99) ||
      new Date(b.appliedDate) - new Date(a.appliedDate)
  );

export default function JobApplicationList({ searchTerm, onClearSearch }) {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const { data, loading, error, refetch } = useJobApplications();
  // Optional so the list still renders outside the app shell (e.g. tests).
  const dialogs = useAppDialogs();
  const { open, jobApplication, handleOpen, handleClose } =
    useJobApplicationDialog();
  const { t } = useTranslation();

  // Resolves once the list has refetched, so the card is already gone when
  // the success message shows.
  const [deleteJobApplication] = useMutation(DELETE_JOB_APPLICATION, {
    refetchQueries: [{ query: GET_JOB_APPLICATIONS }],
    awaitRefetchQueries: true,
  });
  const remove = useConfirmedAction({
    action: item => deleteJobApplication({ variables: { id: item.id } }),
    successMessage: t('jobApplicationList.messages.deleteSuccess'),
    errorMessage: t('jobApplicationList.messages.deleteError'),
  });

  useEffect(() => {
    setSelectedStatus('all');
  }, [searchTerm]);

  const filteredData = useMemo(
    () =>
      sortByStatusThenDate(
        (data?.allJobApplication || []).filter(
          job =>
            (selectedStatus === 'all' || job.status === selectedStatus) &&
            matchesSearch(job, searchTerm)
        )
      ),
    [data, selectedStatus, searchTerm]
  );

  const handleStatusClick = status => {
    setSelectedStatus(status);
  };

  // Skeleton only before there is data: first load, or a retry after an
  // error. Background refetches (after save/delete) keep the list on screen.
  const showSkeleton = loading && !data;
  const totalCount = data?.allJobApplication?.length || 0;
  const statusLabel = t(`jobStatusBar.${selectedStatus}`);

  return (
    <div>
      <main>
        <MountOnFirstOpen open={open}>
          <JobApplicationDialog
            jobApplication={jobApplication}
            handleClose={handleClose}
            open={open}
          />
        </MountOnFirstOpen>
        <Container
          // Extra bottom space on small screens for the floating "New" button.
          sx={{ pt: 4, pb: { xs: 12, md: 4 } }}
          maxWidth="lg"
        >
          {showSkeleton && <Loading />}
          {error && !showSkeleton && (
            <Alert
              severity="error"
              sx={{ alignItems: 'center' }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={() => refetch()}
                >
                  {t('jobApplicationList.messages.retry')}
                </Button>
              }
            >
              <AlertTitle sx={{ mb: 0 }}>
                {t('jobApplicationList.messages.fetchErrorTitle')}
              </AlertTitle>
              {t('jobApplicationList.messages.fetchError')}
            </Alert>
          )}
          {!showSkeleton && !error && totalCount > 0 && (
            <JobStatusBar
              data={data}
              selectedStatus={selectedStatus}
              handleStatusClick={handleStatusClick}
            />
          )}
          {!showSkeleton && !error && data && totalCount === 0 && (
            <EmptyState
              icon={<WorkOutlinedIcon />}
              title={t('jobApplicationList.empty.title')}
              description={t('jobApplicationList.empty.description')}
              actions={
                dialogs && (
                  <Button
                    variant="contained"
                    startIcon={<AddRoundedIcon />}
                    onClick={dialogs.openNewJobApplication}
                  >
                    {t('appHeader.newApplication')}
                  </Button>
                )
              }
            />
          )}
          {!showSkeleton &&
            !error &&
            totalCount > 0 &&
            filteredData.length === 0 && (
              <EmptyState
                icon={<SearchOffIcon />}
                title={
                  searchTerm
                    ? t('jobApplicationList.noMatches.titleSearch', {
                        query: searchTerm,
                      })
                    : t('jobApplicationList.noMatches.titleStatus', {
                        status: statusLabel,
                      })
                }
                description={
                  searchTerm && selectedStatus !== 'all'
                    ? t('jobApplicationList.noMatches.inStatus', {
                        status: statusLabel,
                      })
                    : searchTerm
                      ? t('jobApplicationList.noMatches.tryAnother')
                      : undefined
                }
                actions={
                  <>
                    {searchTerm && onClearSearch && (
                      <Button variant="outlined" onClick={onClearSearch}>
                        {t('jobApplicationList.noMatches.clearSearch')}
                      </Button>
                    )}
                    {selectedStatus !== 'all' && (
                      <Button
                        variant="outlined"
                        onClick={() => handleStatusClick('all')}
                      >
                        {t('jobApplicationList.noMatches.showAll')}
                      </Button>
                    )}
                  </>
                }
              />
            )}
          {!showSkeleton && !error && filteredData.length > 0 && (
            <Grid container spacing={2.5}>
              {filteredData.map(jobApplication => (
                <Grid key={jobApplication.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <JobApplicationCard
                    jobApplication={jobApplication}
                    onEdit={() => handleOpen(jobApplication)}
                    onDelete={() => remove.request(jobApplication)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
        <ConfirmDialog
          {...remove.dialogProps}
          title={
            remove.item
              ? t('common.deleteNamed', { name: remove.item.companyName })
              : t('jobApplicationList.dialogs.confirmDelete.title')
          }
          content={t('jobApplicationList.dialogs.confirmDelete.content')}
        />
      </main>
    </div>
  );
}
