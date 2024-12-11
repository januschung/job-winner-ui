import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ADD_JOB_APPLICATION, UPDATE_JOB_APPLICATION } from '../../graphql/mutation';
import { GET_JOB_APPLICATIONS } from '../../graphql/query';
import dayjs from 'dayjs';

export default function ApplicationForm({ jobApplication, isNew, setOpen, handleClose }) {
    const [formData, setFormData] = useState({
        companyName: '',
        jobTitle: '',
        salaryRange: '',
        description: '',
        jobUrl: '',
        status: 'open',
        appliedDate: dayjs().format('YYYY-MM-DD'),
    });

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
    }, [open, jobApplication, isNew]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const mutationFn = isNew ? newJobApplication : updateJobApplication;
        const variables = {
            ...formData,
            ...(jobApplication && { id: jobApplication.id }),
        };
        mutationFn({ variables });
        setOpen(false);
    };

    return (
        <>
            <DialogContent>
                <TextField
                    required
                    id="companyName"
                    name="companyName"
                    label="Company Name"
                    fullWidth
                    variant="standard"
                    onChange={handleFormChange}
                    value={formData.companyName}
                />
                <TextField
                    required
                    id="jobTitle"
                    name="jobTitle"
                    label="Job Title"
                    fullWidth
                    variant="standard"
                    onChange={handleFormChange}
                    value={formData.jobTitle}
                />
                <TextField
                    id="salaryRange"
                    name="salaryRange"
                    label="Salary Range"
                    fullWidth
                    variant="standard"
                    onChange={handleFormChange}
                    value={formData.salaryRange}
                />
                <DialogContent />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                        id="appliedDate"
                        label="Applied Date"
                        inputFormat="MM/DD/YYYY"
                        variant="standard"
                        value={formData.appliedDate}
                        onChange={(date) =>
                            setFormData({
                                ...formData,
                                appliedDate: dayjs(date).format('YYYY-MM-DD'),
                            })
                        }
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <DialogContent />
                <TextField
                    id="description"
                    name="description"
                    label="Description"
                    multiline
                    rows={4}
                    fullWidth
                    variant="standard"
                    onChange={handleFormChange}
                    value={formData.description}
                />
                <TextField
                    required
                    id="jobUrl"
                    name="jobUrl"
                    label="Job Link"
                    multiline
                    rows={4}
                    fullWidth
                    variant="standard"
                    onChange={handleFormChange}
                    value={formData.jobUrl}
                />

                <DialogContent />
                <FormControl sx={{ minWidth: 120 }} variant="standard" size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                        name="status"
                        value={formData.status}
                        onChange={handleFormChange}
                        disabled={isNew}
                    >
                        <MenuItem value="open">Open</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                </FormControl>
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
            </>
    );
}
