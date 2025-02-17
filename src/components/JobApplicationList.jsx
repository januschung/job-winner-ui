import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import ErrorIcon from '@mui/icons-material/Error';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import JobApplicationDialog from '../components/JobApplicationDialog';
import Loading from './common/Loading';
import ConfirmDialog from './common/ConfirmDialog';
import { useSnackbar } from './common/SnackbarContext';
import ActionIcons from './common/ActionIcons';
import useJobApplications from './hooks/useJobApplications';
import useDialog from './hooks/useDialog';
import useJobApplicationDialog from './hooks/useJobApplicationDialog';
import { DELETE_JOB_APPLICATION } from '../graphql/mutation';
import { GET_JOB_APPLICATIONS } from '../graphql/query';

const STATUS_COLORS = {
    open: '#66BB6A',
    active: '#42A5F5',
    rejected: '#EF5350',
};

export default function JobApplicationList({ searchTerm }) {
    const [jobApplicationToDelete, setJobApplicationToDelete] = useState(null);
    const [localData, setLocalData] = useState([]);
    const { data, loading, error } = useJobApplications();
    const { showSnackbar } = useSnackbar();
    const { 
      dialogOpen: confirmDialogOpen, 
      handleOpen: handleConfirmDialogOpen, 
      handleClose: handleConfirmDialogClose } = useDialog();
    const { open, jobApplication, handleOpen, handleClose } = useJobApplicationDialog();

    const [deleteJobApplication] = useMutation(DELETE_JOB_APPLICATION, {
        refetchQueries: [{ query: GET_JOB_APPLICATIONS }],
    });

    const sortJobApplications = (jobApplications) => {
        const statusOrder = { active: 1, open: 2, rejected: 3 };

        return [...jobApplications].sort((a, b) => {
            const statusComparison = statusOrder[a.status] - statusOrder[b.status];
            return statusComparison !== 0
                ? statusComparison
                : new Date(b.appliedDate) - new Date(a.appliedDate);
        });
    };
    useEffect(() => {
        if (data) {
            setLocalData(sortJobApplications(data.allJobApplication));
        }
    }, [data]);

    const confirmDeleteJobApplication = () => {
        if (jobApplicationToDelete) {
            deleteJobApplication({
                variables: { id: jobApplicationToDelete.id },
            })
                .then(() => {
                    setLocalData(localData.filter((jobApp) => jobApp.id !== jobApplicationToDelete.id));
                    showSnackbar("Job application deleted successfully!");
                })
                .catch(() => {
                    showSnackbar("Failed to delete the job application.");
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
        str.toLowerCase().includes(searchTerm?.toLowerCase() || "");

    const filteredData = localData.filter(
        (jobApp) =>
            containsIgnoreCase(jobApp.companyName, searchTerm) ||
            containsIgnoreCase(jobApp.description, searchTerm) ||
            containsIgnoreCase(jobApp.jobTitle, searchTerm)
    );

    return (
        <div>
            <main>
                <JobApplicationDialog
                    jobApplication={jobApplication}
                    handleClose={handleClose}
                    open={open}
                />
                <Container sx={{ py: 8 }} maxWidth="lg">
                    {loading && <Loading />}
                    {error && (
                        <Alert severity="error" icon={<ErrorIcon fontSize="inherit" />} sx={{ mt: 2 }}>
                            <AlertTitle>Error</AlertTitle>
                            Failed to fetch data. Please check your network connection and try again.
                        </Alert>
                    )}
                    {!loading && !error && filteredData.length === 0 && (
                        <Typography variant="body1">No job applications match your search.</Typography>
                    )}
                    {!loading && !error && filteredData.length > 0 && (
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
                                        }}
                                    >
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                                                <CalendarMonthRoundedIcon fontSize="inherit" />{' '}
                                                {jobApplication.appliedDate}
                                            </Typography>
                                            <Typography variant="h5" component="div">
                                                {jobApplication.companyName}
                                            </Typography>
                                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                {jobApplication.jobTitle}
                                            </Typography>
                                            <Typography sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }} color="text.secondary">
                                                <MonetizationOnIcon fontSize="inherit" sx={{ marginRight: 0.5 }} />
                                                {jobApplication.salaryRange}
                                            </Typography>
                                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                status: {jobApplication.status}
                                            </Typography>
                                            <Typography sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }} color="text.secondary">
                                                <LinkRoundedIcon fontSize="inherit" sx={{ marginRight: 0.5 }} />
                                                <Link
                                                    href={jobApplication.jobUrl || '#'}
                                                    underline="hover"
                                                    color="inherit"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    job link
                                                </Link>
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
                    )}
                </Container>
                <ConfirmDialog
                    open={confirmDialogOpen}
                    onCancel={handleConfirmDialogClose}
                    onConfirm={confirmDeleteJobApplication}
                    title="Confirm Deletion"
                    content="Are you sure you want to delete this job application? This action cannot be undone."
                />
            </main>
        </div>
    );
}
