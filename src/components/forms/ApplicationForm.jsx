import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Grid, TextField, FormControl, InputLabel, MenuItem, Select, Button, DialogActions, DialogContent } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SnackbarComponent from '../common/SnackbarComponent';
import useSnackbar from '../hooks/useSnackbar';
import { ADD_JOB_APPLICATION, UPDATE_JOB_APPLICATION } from '../../graphql/mutation';
import { GET_JOB_APPLICATIONS } from '../../graphql/query';
import dayjs from 'dayjs';

export default function ApplicationForm({ jobApplication, isNew, handleClose }) {
    const [formData, setFormData] = useState({
        companyName: '',
        jobTitle: '',
        salaryRange: '',
        description: '',
        jobUrl: '',
        status: 'open',
        appliedDate: dayjs().format('YYYY-MM-DD'),
    });
    const [errors, setErrors] = useState({});
    const { snackbarOpen, snackbarMessage, snackbarSeverity, showSnackbar, handleSnackbarClose } = useSnackbar();

    const [newJobApplication] = useMutation(ADD_JOB_APPLICATION, {
        refetchQueries: [{ query: GET_JOB_APPLICATIONS }],
    });
    const [updateJobApplication] = useMutation(UPDATE_JOB_APPLICATION, {
        refetchQueries: [{ query: GET_JOB_APPLICATIONS }],
    });

    useEffect(() => {
        if (isNew) {
            setFormData({
                ...formData,
                appliedDate: dayjs().format('YYYY-MM-DD'),
            });
        } else if (jobApplication) {
            setFormData({
                companyName: jobApplication.companyName || '',
                jobTitle: jobApplication.jobTitle || '',
                salaryRange: jobApplication.salaryRange || '',
                description: jobApplication.description || '',
                jobUrl: jobApplication.jobUrl || '',
                status: jobApplication.status || 'open',
                appliedDate: jobApplication.appliedDate || dayjs().format('YYYY-MM-DD'),
            });
        }
    }, [jobApplication, isNew]);

    const validateFields = () => {
        const newErrors = {};
        if (!formData.companyName) newErrors.companyName = 'Company Name is required.';
        if (!formData.jobTitle) newErrors.jobTitle = 'Job Title is required.';
        if (!formData.salaryRange) newErrors.salaryRange = 'Salary Range is required.';
        if (!formData.appliedDate || !dayjs(formData.appliedDate).isValid()) {
            newErrors.appliedDate = 'Valid Applied date is required.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (event) => {
        if (!validateFields()) return;
        try {
            event.preventDefault();
            const mutationFn = isNew ? newJobApplication : updateJobApplication;
            const variables = {
                ...formData,
                ...(jobApplication && { id: jobApplication.id }),
            };
            mutationFn({ variables });
            showSnackbar('Job Application updated successfully!', 'success');
            setTimeout(() => handleClose(), 500);
        } catch (err) {
            showSnackbar('Error saving job application. Please try again.', 'error');
        }
    };

    return (
        <>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="companyName"
                            name="companyName"
                            label="Company Name"
                            fullWidth
                            variant="outlined"
                            onChange={handleFormChange}
                            value={formData.companyName}
                            error={!!errors.companyName}
                            helperText={errors.companyName}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="jobTitle"
                            name="jobTitle"
                            label="Job Title"
                            fullWidth
                            variant="outlined"
                            onChange={handleFormChange}
                            value={formData.jobTitle}
                            error={!!errors.jobTitle}
                            helperText={errors.jobTitle}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            required
                            id="salaryRange"
                            name="salaryRange"
                            label="Salary Range"
                            fullWidth
                            variant="outlined"
                            onChange={handleFormChange}
                            value={formData.salaryRange}
                            error={!!errors.salaryRange}
                            helperText={errors.salaryRange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                                id="appliedDate"
                                label="Applied Date"
                                inputFormat="MM/DD/YYYY"
                                disablePast
                                value={formData.appliedDate}
                                onChange={(date) =>
                                    setFormData({
                                        ...formData,
                                        appliedDate: dayjs(date).format('YYYY-MM-DD'),
                                    })
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        error={!!errors.appliedDate}
                                        helperText={errors.appliedDate}
                                    />
                                )}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                label="Status"
                                value={formData.status}
                                onChange={handleFormChange}
                                disabled={isNew}
                            >
                                <MenuItem value="open">Open</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="rejected">Rejected</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="description"
                            name="description"
                            label="Description"
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            onChange={handleFormChange}
                            value={formData.description}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="jobUrl"
                            name="jobUrl"
                            label="Job Link"
                            multiline
                            rows={2}
                            fullWidth
                            variant="outlined"
                            onChange={handleFormChange}
                            value={formData.jobUrl}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    color="info"
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleClose}
                >
                    Cancel
                </Button>
                <Button
                    color="info"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                >
                    Save
                </Button>
            </DialogActions>
            <SnackbarComponent
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={handleSnackbarClose}
            />
        </>
    );
}
