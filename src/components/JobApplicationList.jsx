import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorIcon from '@mui/icons-material/Error';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import Button from '@mui/material/Button';
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
import SnackbarComponent from './common/SnackbarComponent';
import useJobApplications from './hooks/useJobApplications';
import useSnackbar from './hooks/useSnackbar';
import useConfirmDialog from './hooks/useConfirmDialog';
import { DELETE_JOB_APPLICATION } from '../graphql/mutation';
import { GET_JOB_APPLICATIONS } from '../graphql/query';

export default function JobApplicationList({ searchTerm }) {
    const [open, setOpen] = useState(false);
    const [jobApplication, setJobApplication] = useState(null);
    const [jobApplicationToDelete, setJobApplicationToDelete] = useState(null);
    const [localData, setLocalData] = useState([]);

    const { data, loading, error } = useJobApplications();
    const { snackbarOpen, snackbarMessage, showSnackbar, handleSnackbarClose } = useSnackbar();
    const { confirmOpen, openConfirmDialog, cancel } = useConfirmDialog();


    const [deleteJobApplication] = useMutation(DELETE_JOB_APPLICATION, {
        refetchQueries: [{ query: GET_JOB_APPLICATIONS }],
    });

    useEffect(() => {
        if (data) {
            setLocalData(data.allJobApplication);
        }
    }, [data]);

    const handleOpen = (jobApplication) => {
        setJobApplication(jobApplication);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

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
        cancel();
        setJobApplicationToDelete(null);
    };

    const handleDeleteJobApplication = (jobApplication) => {
        setJobApplicationToDelete(jobApplication);
        openConfirmDialog();
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
                    {!loading && !error && (
                        <Grid container spacing={4}>
                            {filteredData.map((jobApplication) => (
                                <Grid item key={jobApplication.id} xs={12} sm={6} md={4}>
                                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                                                <CalendarMonthRoundedIcon fontSize="inherit" />{" "}
                                                {jobApplication.appliedDate}
                                            </Typography>
                                            <Typography variant="h5" component="div">
                                                {jobApplication.companyName}
                                            </Typography>
                                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                {jobApplication.jobTitle}
                                            </Typography>
                                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                <MonetizationOnIcon fontSize="inherit" />
                                                {jobApplication.salaryRange}
                                            </Typography>
                                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                Status: {jobApplication.status}
                                            </Typography>
                                        </CardContent>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography
                                                color="text.secondary"
                                                sx={{
                                                    display: '-webkit-box',
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    WebkitLineClamp: 3,
                                                }}
                                            >
                                                <CommentRoundedIcon fontSize="inherit" />
                                                <br />
                                                {jobApplication.description}
                                            </Typography>
                                            <Typography color="text.secondary">
                                                <LinkRoundedIcon fontSize="inherit" />{" "}
                                                <Link href={jobApplication.jobUrl} underline="hover" color="inherit">
                                                    job link
                                                </Link>
                                            </Typography>
                                        </CardContent>
                                        <CardActions sx={{ justifyContent: 'flex-end' }}>
                                            <Button
                                                size="small"
                                                color="info"
                                                variant="outlined"
                                                startIcon={<ReadMoreIcon />}
                                                onClick={() => handleOpen(jobApplication)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="small"
                                                color="warning"
                                                variant="outlined"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeleteJobApplication(jobApplication)}
                                            >
                                                Delete
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Container>
                <ConfirmDialog
                    open={confirmOpen}
                    onCancel={cancel}
                    onConfirm={confirmDeleteJobApplication}
                    title="Confirm Deletion"
                    content="Are you sure you want to delete this job application? This action cannot be undone."
                />
                <SnackbarComponent
                    open={snackbarOpen}
                    message={snackbarMessage}
                    severity="success"
                    onClose={handleSnackbarClose}
                />

            </main>
        </div>
    );
}
