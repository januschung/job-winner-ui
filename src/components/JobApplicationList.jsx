import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import WorkOutlinedIcon from '@mui/icons-material/WorkOutlined';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import JobApplicationDialog from '../components/JobApplicationDialog';
import { DELETE_JOB_APPLICATION } from '../graphql/mutation';
import { GET_JOB_APPLICATIONS } from '../graphql/query';
import useDialog from '../hooks/useDialog';
import useJobApplicationDialog from '../hooks/useJobApplicationDialog';
import useJobApplications from '../hooks/useJobApplications';
import { useAppDialogs } from './AppDialogsContext';
import ConfirmDialog from './common/ConfirmDialog';
import EmptyState from './common/EmptyState';
import Loading from './common/Loading';
import { useSnackbar } from './common/SnackbarContext';
import JobApplicationCard from './JobApplicationCard';
import JobStatusBar from './JobStatusBar';
import { useTranslation } from 'react-i18next';

export default function JobApplicationList({ searchTerm, onClearSearch }) {
  const [jobApplicationToDelete, setJobApplicationToDelete] = useState(null);
  const [localData, setLocalData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const { data, loading, error, refetch } = useJobApplications();
  // Optional so the list still renders outside the app shell (e.g. tests).
  const dialogs = useAppDialogs();
  const { showSnackbar } = useSnackbar();
  const {
    dialogOpen: confirmDialogOpen,
    handleOpen: handleConfirmDialogOpen,
    handleClose: handleConfirmDialogClose,
  } = useDialog();
  const { open, jobApplication, handleOpen, handleClose } =
    useJobApplicationDialog();
  const { t } = useTranslation();

  const [deleteJobApplication] = useMutation(DELETE_JOB_APPLICATION, {
    refetchQueries: [{ query: GET_JOB_APPLICATIONS }],
  });

  const sortJobApplications = jobApplications => {
    const statusOrder = { active: 1, open: 2, ghosted: 3, rejected: 4 };

    return [...jobApplications].sort((a, b) => {
      const statusComparison = statusOrder[a.status] - statusOrder[b.status];
      return statusComparison !== 0
        ? statusComparison
        : new Date(b.appliedDate) - new Date(a.appliedDate);
    });
  };

  useEffect(() => {
    setSelectedStatus('all');
  }, [searchTerm]);

  useEffect(() => {
    if (data?.allJobApplication) {
      setLocalData(
        sortJobApplications(
          selectedStatus === 'all'
            ? data.allJobApplication
            : data.allJobApplication.filter(
                job => job.status === selectedStatus
              )
        )
      );
    }
  }, [data, selectedStatus]);

  const confirmDeleteJobApplication = () => {
    if (jobApplicationToDelete) {
      deleteJobApplication({
        variables: { id: jobApplicationToDelete.id },
      })
        .then(() => {
          setLocalData(
            localData.filter(jobApp => jobApp.id !== jobApplicationToDelete.id)
          );
          showSnackbar(
            t('jobApplicationList.messages.deleteSuccess'),
            'success'
          );
        })
        .catch(() => {
          showSnackbar(t('jobApplicationList.messages.deleteError'), 'error');
        });
    }
    handleConfirmDialogClose();
    setJobApplicationToDelete(null);
  };

  const handleDeleteJobApplication = jobApplication => {
    setJobApplicationToDelete(jobApplication);
    handleConfirmDialogOpen();
  };

  const containsIgnoreCase = (str, searchTerm) =>
    str.toLowerCase().includes(searchTerm?.toLowerCase() || '');

  const filteredData = localData.filter(
    jobApp =>
      containsIgnoreCase(jobApp.companyName, searchTerm) ||
      containsIgnoreCase(jobApp.description, searchTerm) ||
      containsIgnoreCase(jobApp.jobTitle, searchTerm)
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
        <JobApplicationDialog
          jobApplication={jobApplication}
          handleClose={handleClose}
          open={open}
        />
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
                    onDelete={() => handleDeleteJobApplication(jobApplication)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
        <ConfirmDialog
          open={confirmDialogOpen}
          onCancel={handleConfirmDialogClose}
          onConfirm={confirmDeleteJobApplication}
          title={t('jobApplicationList.dialogs.confirmDelete.title')}
          content={t('jobApplicationList.dialogs.confirmDelete.content')}
        />
      </main>
    </div>
  );
}
