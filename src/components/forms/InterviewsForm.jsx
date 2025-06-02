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
import { useSnackbar } from '../common/SnackbarContext';
import { ADD_INTERVIEW, UPDATE_INTERVIEW, DELETE_INTERVIEW } from '../../graphql/mutation';
import { GET_INTERVIEWS_BY_JOB_APPLICATION_ID, GET_ALL_INTERVIEWS } from '../../graphql/query';
import dayjs from 'dayjs';
import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function InterviewsForm({ jobApplicationId }) {
    const [interviews, setInterviews] = useState([]);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [interviewToDelete, setInterviewToDelete] = useState(null);
    const { showSnackbar } = useSnackbar();
    const { t } = useTranslation();

    const { loading, error } = useQuery(GET_INTERVIEWS_BY_JOB_APPLICATION_ID, {
        variables: { jobApplicationId },
        onCompleted: (data) => setInterviews(data.allInterviewByJobApplicationId),
    });

    const [addInterview] = useMutation(ADD_INTERVIEW, {
        refetchQueries: [
            { query: GET_INTERVIEWS_BY_JOB_APPLICATION_ID, variables: { jobApplicationId } },
            { query: GET_ALL_INTERVIEWS }
        ],
    });

    const [updateInterview] = useMutation(UPDATE_INTERVIEW, {
        refetchQueries: [
            { query: GET_INTERVIEWS_BY_JOB_APPLICATION_ID, variables: { jobApplicationId } },
            { query: GET_ALL_INTERVIEWS }
        ],
    });

    const [deleteInterview] = useMutation(DELETE_INTERVIEW, {
        refetchQueries: [
            { query: GET_INTERVIEWS_BY_JOB_APPLICATION_ID, variables: { jobApplicationId } },
            { query: GET_ALL_INTERVIEWS }
        ],
        onError: (err) => {
            console.error(t('interviews.messages.deleteError'), err.message);
            showSnackbar(t('interviews.messages.deleteError'), 'error');
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
                showSnackbar(t('interviews.messages.addSuccess'), 'success');
            } else {
                console.warn(t('interviews.messages.addError'));
            }
        } catch (err) {
            console.error(t('interviews.messages.addError'), err.message);
            showSnackbar(t('interviews.messages.addError'), 'error');
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
    
            showSnackbar(t('interviews.messages.saveSuccess'), 'success');
        } catch (err) {
            console.error(t('interviews.messages.saveError'), err.message);
            showSnackbar(t('interviews.messages.saveError'), 'error');
        }
    };

    const handleDelete = (id) => {
        setInterviewToDelete(id);
        setConfirmDeleteOpen(true);
    }
    
    const confirmDeleteInterview = async () => {
        try {
            await deleteInterview({ variables: { id: interviewToDelete } });
            setInterviews((prev) => prev.filter((interview) => interview.id !== interviewToDelete));
            showSnackbar(t('interviews.messages.deleteSuccess'), 'success');
        } catch (err) {
            console.error(t('interviews.messages.deleteError'), err.message);
            showSnackbar(t('interviews.messages.deleteError'), 'error');
        } finally {
            setInterviewToDelete(null);
            setConfirmDeleteOpen(false);
        }
    };
        

    const cancelDeleteInterview = () => {
        setConfirmDeleteOpen(false);
        setInterviewToDelete(null);
    };

    if (loading) return <p>{t('common.loading')}</p>;
    if (error) return <p>{t('common.error')}: {error.message}</p>;

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
                                            label={t('interviews.date')}
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
                                        label={t('interviews.interviewer')}
                                        value={interview.interviewer}
                                        onChange={(e) => handleEdit(interview.id, 'interviewer', e.target.value)}
                                        onBlur={() => handleSaveInline(interview.id)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>{t('interviews.status')}</InputLabel>
                                        <Select
                                            label={t('interviews.status')}
                                            value={interview.status}
                                            onChange={(e) => handleEdit(interview.id, 'status', e.target.value)}
                                            onBlur={() => handleSaveInline(interview.id)}
                                        >
                                            <MenuItem value="open">{t('interviews.statuses.open')}</MenuItem>
                                            <MenuItem value="canceled">{t('interviews.statuses.canceled')}</MenuItem>
                                            <MenuItem value="pending">{t('interviews.statuses.pending')}</MenuItem>
                                            <MenuItem value="rejected">{t('interviews.statuses.rejected')}</MenuItem>
                                            <MenuItem value="expired">{t('interviews.statuses.expired')}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <TextField
                                        label={t('interviews.description')}
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
                                        {t('common.delete')}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>

                <Grid container justifyContent="center" sx={{ marginTop: 3 }}>
                    <Button variant="contained" onClick={handleAddInterview} disabled={loading}>
                        {t('interviews.add')}
                    </Button>
                </Grid>
            </DialogContent>

            <ConfirmDialog
                open={confirmDeleteOpen}
                onCancel={cancelDeleteInterview}
                onConfirm={confirmDeleteInterview}
                title={t('dialogs.confirmDeletion.title')}
                content={t('dialogs.confirmDeletion.content')}
            />
        </>
    );
}
