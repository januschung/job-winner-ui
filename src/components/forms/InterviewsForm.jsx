import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useQuery, useMutation } from '@apollo/client';
import ConfirmDialog from '../common/ConfirmDialog';
import SnackbarComponent from '../common/SnackbarComponent';
import useSnackbar from '../hooks/useSnackbar';
import { ADD_INTERVIEW, UPDATE_INTERVIEW, DELETE_INTERVIEW } from '../../graphql/mutation';
import { GET_INTERVIEWS_BY_JOB_APPLICATION_ID } from '../../graphql/query';
import dayjs from 'dayjs';
import { Grid } from '@mui/material';

export default function InterviewsForm({ jobApplicationId }) {
    const [interviews, setInterviews] = useState([]);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [interviewToDelete, setInterviewToDelete] = useState(null);
    const { snackbarOpen, snackbarMessage, snackbarSeverity, showSnackbar, handleSnackbarClose } = useSnackbar();

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

    const [deleteInterview] = useMutation(DELETE_INTERVIEW, {
        refetchQueries: [{ query: GET_INTERVIEWS_BY_JOB_APPLICATION_ID, variables: { jobApplicationId } }],
        onError: (err) => {
            console.error('Error deleting interview:', err.message);
            showSnackbar('Error deleting interview', 'error');
        }
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
                showSnackbar('Interview added successfully', 'success');
            } else {
                console.warn('Failed to retrieve ID for the new interview');
            }
        } catch (err) {
            console.error('Error adding interview:', err.message);
            showSnackbar('Error adding interview', 'error');
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
    
            showSnackbar('Interview saved successfully', 'success');
        } catch (err) {
            console.error('Error saving interview:', err.message);
            showSnackbar('Error saving interview', 'error');
        }
    };
    
    const confirmDeleteInterview = async () => {
        try {
            await deleteInterview({ variables: { id: interviewToDelete } });
            setInterviews((prev) => prev.filter((interview) => interview.id !== interviewToDelete));
            showSnackbar('Interview deleted successfully', 'success');
        } catch (err) {
            console.error('Error deleting interview:', err.message);
            showSnackbar('Error deleting interview', 'error');
        } finally {
            setInterviewToDelete(null);
        }
    };
        

    const cancelDeleteInterview = () => {
        setConfirmDeleteOpen(false);
        setInterviewToDelete(null);
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
                    <Button variant="contained" onClick={handleAddInterview} disabled={loading}>
                        Add Interview
                    </Button>
                </Grid>
            </DialogContent>

            <ConfirmDialog
                open={confirmDeleteOpen}
                onCancel={cancelDeleteInterview}
                onConfirm={confirmDeleteInterview}
                title="Confirm Deletion"
                content="Are you sure you want to delete this interview? This action cannot be undone."
            />
            <SnackbarComponent
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={handleSnackbarClose}
            />
        </>
    );
}
