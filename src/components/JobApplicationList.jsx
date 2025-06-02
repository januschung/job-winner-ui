import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import ErrorIcon from '@mui/icons-material/Error';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import JobApplicationDialog from '../components/JobApplicationDialog';
import { STATUS_COLORS } from '../config/statusColor';
import { DELETE_JOB_APPLICATION } from '../graphql/mutation';
import { GET_JOB_APPLICATIONS } from '../graphql/query';
import useDialog from '../hooks/useDialog';
import useJobApplicationDialog from '../hooks/useJobApplicationDialog';
import useJobApplications from '../hooks/useJobApplications';
import ActionIcons from './common/ActionIcons';
import ConfirmDialog from './common/ConfirmDialog';
import Loading from './common/Loading';
import { useSnackbar } from './common/SnackbarContext';
import JobStatusBar from './JobStatusBar';
import { useTranslation } from 'react-i18next';

export default function JobApplicationList({ searchTerm }) {
  const [jobApplicationToDelete, setJobApplicationToDelete] = useState(null);
  const [localData, setLocalData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const { data, loading, error } = useJobApplications();
  const { showSnackbar } = useSnackbar();
  const {
    dialogOpen: confirmDialogOpen,
    handleOpen: handleConfirmDialogOpen,
    handleClose: handleConfirmDialogClose,
  } = useDialog();
  const { open, jobApplication, handleOpen, handleClose } = useJobApplicationDialog();
  const { t } = useTranslation();

  const [deleteJobApplication] = useMutation(DELETE_JOB_APPLICATION, {
    refetchQueries: [{ query: GET_JOB_APPLICATIONS }],
  });

  const sortJobApplications = (jobApplications) => {
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
            : data.allJobApplication.filter((job) => job.status === selectedStatus)
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
          setLocalData(localData.filter((jobApp) => jobApp.id !== jobApplicationToDelete.id));
          showSnackbar(t('jobApplicationList.messages.deleteSuccess'), 'success');
        })
        .catch(() => {
          showSnackbar(t('jobApplicationList.messages.deleteError'), 'error');
        });
    }
    handleConfirmDialogClose();
    setJobApplicationToDelete(null);
  };

  const handleDeleteJobApplication = (jobApplication) => {
    setJobApplicationToDelete(jobApplication);
    handleConfirmDialogOpen();
  };

  const containsIgnoreCase = (str, searchTerm) =>
    str.toLowerCase().includes(searchTerm?.toLowerCase() || '');

  const filteredData = localData.filter(
    (jobApp) =>
      containsIgnoreCase(jobApp.companyName, searchTerm) ||
      containsIgnoreCase(jobApp.description, searchTerm) ||
      containsIgnoreCase(jobApp.jobTitle, searchTerm)
  );

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
  };

  return (
    <div>
      <main>
        <JobApplicationDialog
          jobApplication={jobApplication}
          handleClose={handleClose}
          open={open}
        />
        <Container sx={{ py: 4 }} maxWidth="lg">
          {loading && <Loading />}
          {error && (
            <Alert severity="error" icon={<ErrorIcon fontSize="inherit" />} sx={{ mt: 2 }}>
              <AlertTitle>{t('common.error')}</AlertTitle>
              {t('jobApplicationList.messages.fetchError')}
            </Alert>
          )}
          {!loading && !error && filteredData.length === 0 && (
            <Typography variant="body1">{t('jobApplicationList.messages.noResults')}</Typography>
          )}
          {!loading && !error && filteredData.length > 0 && (
            <>
              <JobStatusBar data={data} handleStatusClick={handleStatusClick} />
              <Grid container spacing={4}>
                {filteredData.map((jobApplication) => (
                  <Grid item key={jobApplication.id} xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderTop: 4,
                        borderColor: STATUS_COLORS[jobApplication.status] || 'grey',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: 6,
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                          <CalendarMonthRoundedIcon fontSize="inherit" /> {jobApplication.appliedDate}
                        </Typography>
                        <Typography
                          sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}
                          color="text.secondary"
                        >
                          <Link
                            href={jobApplication.jobUrl || '#'}
                            variant="h5"
                            underline="hover"
                            color="inherit"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {jobApplication.companyName}
                          </Link>
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                          {jobApplication.jobTitle}
                        </Typography>
                        <Typography
                          sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}
                          color="text.secondary"
                        >
                          <MonetizationOnIcon fontSize="inherit" sx={{ marginRight: 0.5 }} />
                          {jobApplication.salaryRange}
                        </Typography>
                        <Typography
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            WebkitLineClamp: 3,
                          }}
                        >
                          {jobApplication.description}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <ActionIcons
                          onEdit={() => handleOpen(jobApplication)}
                          onDelete={() => handleDeleteJobApplication(jobApplication)}
                        />
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
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
