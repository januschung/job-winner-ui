import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useQuery, useMutation } from '@apollo/client';
import { ADD_INTERVIEW, UPDATE_INTERVIEW } from '../../graphql/mutation';
import { GET_INTERVIEWS_BY_JOB_APPLICATION_ID } from '../../graphql/query';
import dayjs from 'dayjs';
import { Grid, Snackbar, Alert } from '@mui/material';

export default function InterviewsForm({ jobApplicationId }) {
    const [interviews, setInterviews] = useState([]);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [interviewToDelete, setInterviewToDelete] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const { loading, error } = useQuery(GET_INTERVIEWS_BY_JOB_APPLICATION_ID, {
        variables: { jobApplicationId },
        onCompleted: (data) => setInterviews(data.allInterviewByJobApplicationId),
    });

    const [addInterview] = useMutation(ADD_INTERVIEW, {
        refetchQueries: [{ query: GET_INTERVIEWS_BY_JOB_APPLICATION_ID, variables: { jobApplicationId } }],
    });

    const [updateInterview] = useMutation(UPDATE_INTERVIEW, {
        refetchQueries: [{ query: GET_INTERVIEWS_BY_JOB_APPLICATION_ID, variables: { jobApplicationId } }],
    });

    const handleAddInterview = async () => {
        try {
            const { data } = await addInterview({
                variables: {
                    interviewInput: {
                        jobApplicationId,
                        interviewDate: dayjs().format('YYYY-MM-DD'),
                        interviewer: '',
                        description: '',
                        status: 'open',
                    },
                },
            });
            if (data?.addInterview?.id) {
                setInterviews([...interviews, data.addInterview]);
            } else {
                console.warn('Failed to retrieve ID for the new interview');
            }
        } catch (err) {
            console.error('Error adding interview:', err.message);
            setSnackbarSeverity('error');
            setSnackbarMessage('Error adding interview');
            setSnackbarOpen(true);
        }
    };

    const handleEdit = (id, field, value) => {
        setInterviews((prev) =>
            prev.map((interview) =>
                interview.id === id ? { ...interview, [field]: value } : interview
            )
        );
    };

    const handleSaveInline = async (id) => {
        try {
            const interview = interviews.find((item) => item.id === id);
            if (!interview) return;

            await updateInterview({
                variables: {
                    id,
                    interview: {
                        id: interview.id,
                        jobApplicationId,
                        interviewDate: interview.interviewDate,
                        interviewer: interview.interviewer,
                        description: interview.description,
                        status: interview.status,
                    }
                },
            });

            setSnackbarSeverity('success');
            setSnackbarMessage('Interview saved successfully');
            setSnackbarOpen(true);
        } catch (err) {
            console.error('Error saving interview:', err.message);
            setSnackbarSeverity('error');
            setSnackbarMessage('Error saving interview');
            setSnackbarOpen(true);
        }
    };

    const handleDelete = (id) => {
        setInterviewToDelete(id);
        setConfirmDeleteOpen(true);
    };

    const confirmDeleteInterview = () => {
        setInterviews((prev) => prev.filter((interview) => interview.id !== interviewToDelete));
        setConfirmDeleteOpen(false);
        setInterviewToDelete(null);
    };

    const cancelDeleteInterview = () => {
        setConfirmDeleteOpen(false);
        setInterviewToDelete(null);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <>
            <DialogContent>
                <Grid container spacing={2}>
                    {interviews.map((interview, index) => (
                        <Grid item xs={12} key={interview.id} sx={{ marginBottom: index < interviews.length - 1 ? 2 : 0 }}>
                            <Grid container spacing={2} alignItems="center" sx={{ border: '1px solid #ddd', padding: 2, borderRadius: 2 }}>
                                <Grid item xs={12} sm={4}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DesktopDatePicker
                                            label="Interview Date"
                                            inputFormat="MM/DD/YYYY"
                                            value={interview.interviewDate}
                                            onChange={(date) =>
                                                handleEdit(interview.id, 'interviewDate', dayjs(date).format('YYYY-MM-DD'))
                                            }
                                            renderInput={(params) => <TextField fullWidth {...params} />}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="Interviewer"
                                        value={interview.interviewer}
                                        onChange={(e) => handleEdit(interview.id, 'interviewer', e.target.value)}
                                        onBlur={() => handleSaveInline(interview.id)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            label="Status"
                                            value={interview.status}
                                            onChange={(e) => handleEdit(interview.id, 'status', e.target.value)}
                                            onBlur={() => handleSaveInline(interview.id)}
                                        >
                                            <MenuItem value="open">Open</MenuItem>
                                            <MenuItem value="canceled">Canceled</MenuItem>
                                            <MenuItem value="pending">Pending</MenuItem>
                                            <MenuItem value="rejected">Rejected</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <TextField
                                        label="Description"
                                        value={interview.description}
                                        onChange={(e) => handleEdit(interview.id, 'description', e.target.value)}
                                        multiline
                                        onBlur={() => handleSaveInline(interview.id)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4} container justifyContent="flex-end" alignItems="center">
                                    <Button
                                        variant="outlined"
                                        color="warning"
                                        onClick={() => handleDelete(interview.id)}
                                    >
                                        Delete
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>

                <Grid container justifyContent="center" sx={{ marginTop: 3 }}>
                    <Button variant="contained" onClick={handleAddInterview}>
                        Add Interview
                    </Button>
                </Grid>
            </DialogContent>

            <Dialog open={confirmDeleteOpen} onClose={cancelDeleteInterview}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this interview? This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDeleteInterview} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDeleteInterview} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}
