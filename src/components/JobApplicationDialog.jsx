import React, { useEffect, useState } from 'react';

import { useMutation } from '@apollo/client';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import { ADD_JOB_APPLICATION, UPDATE_JOB_APPLICATION } from '../graphql/mutation';
import { GET_JOB_APPLICATIONS } from '../graphql/query';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';


export default function JobApplicationDialog({jobApplication, handleClose, open, setOpen, isNew}){

    const [companyName, setCompanyName] = useState('')
    const [jobTitle, setJobTitle] = useState('');
    const [salaryRange, setSalaryRange] = useState('');
    const [description, setDescription] = useState('');
    const [jobUrl, setJobUrl] = useState('');
    const [status, setStatus] = useState('open');
    const [appliedDate, setAppliedDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'));
    const [dialogTitle, setDialogTitle] = useState('Edit Job Application')
    const [newJobApplication] = useMutation(ADD_JOB_APPLICATION, {
        refetchQueries: [
            {query: GET_JOB_APPLICATIONS}
        ]
    });
    
    useEffect(()=> {
        if(isNew){
            setStatus('open')
            setAppliedDate(dayjs(new Date()).format('YYYY-MM-DD'))
            setDialogTitle('Add Job Application')
        }
        else{
            if( companyName !== jobApplication.companyName) setCompanyName(jobApplication.companyName)
            if( jobTitle !== jobApplication.jobTitle ) setJobTitle(jobApplication.jobTitle)
            if( salaryRange !== jobApplication.salaryRange ) setSalaryRange(jobApplication.salaryRange)
            if( description !== jobApplication.description ) setDescription(jobApplication.description)
            if( jobUrl !== jobApplication.jobUrl ) setJobUrl(jobApplication.jobUrl)
            if( status !== jobApplication.status ) setStatus(jobApplication.status)
            if( appliedDate !== jobApplication.appliedDate ) setAppliedDate(jobApplication.appliedDate)
        }
    }, [open])

    const [updateJobApplication] = useMutation(UPDATE_JOB_APPLICATION, {
        refetchQueries: [
            {query: GET_JOB_APPLICATIONS}
        ]
    });

    function handleUpdateJobApplication(id) {

        console.log("update id: " + id)

        updateJobApplication({
            variables: {
                id: id,
                companyName: companyName,
                jobTitle: jobTitle,
                salaryRange: salaryRange,
                description: description,
                jobUrl: jobUrl,
                appliedDate: appliedDate,
                status: status,
            }
        })

        setOpen(false);

    }

    function handleAddJobApplication() {
        newJobApplication({
            variables: {
                companyName: companyName,
                jobTitle: jobTitle,
                salaryRange: salaryRange,
                description: description,
                jobUrl: jobUrl,
                appliedDate: appliedDate,
                status: status,
            }
        })

        setOpen(false)
    }

    return (
            <>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogContent dividers>
                        <TextField
                            required
                            id="companyName"
                            name="companyName"
                            label="Company name"
                            fullWidth
                            autoComplete="given-name"
                            variant="standard"
                            onChange={(e) => {
                                setCompanyName(e.target.value);
                            }}
                            defaultValue={jobApplication.companyName}
                            // defaultValue={companyName}
                        />

                        <TextField
                            required
                            id="jobTitle"
                            name="jobTitle"
                            label="Job Title"
                            fullWidth
                            autoComplete="family-name"
                            variant="standard"
                            onChange={(e) => {
                                setJobTitle(e.target.value);
                            }}
                            defaultValue={jobApplication.jobTitle}
                        />

                        <TextField
                            required
                            id="salaryRange"
                            name="salaryRange"
                            label="Salary Range"
                            fullWidth
                            autoComplete="shipping address-level2"
                            variant="standard"
                            onChange={(e) => {
                                setSalaryRange(e.target.value);
                            }}
                            defaultValue={jobApplication.salaryRange}
                        />
                        <DialogContent />

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                            label="Applied Date"
                            inputFormat="MM/DD/YYYY"
                            variant="standard"
                            value={appliedDate}
                            onChange={(e) => {
                                setAppliedDate(dayjs(e).format('YYYY-MM-DD'))
                            } } 
                            renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>

                        <TextField
                            required
                            id="description"
                            name="description"
                            label="Description"
                            multiline
                            rows={4}
                            fullWidth
                            variant="standard"
                            onChange={(e) => {
                                setDescription(e.target.value);
                            }}
                            defaultValue={jobApplication.description}
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
                            onChange={(e) => {
                                setJobUrl(e.target.value);
                            }}
                            defaultValue={jobApplication.jobUrl}

                        />

                        <DialogContent />
                            <FormControl sx={{ minWidth: 120 }} variant="standard" size="small">
                                <InputLabel id="status-label">Status</InputLabel>
                                <Select
                                    labelId="status-label"
                                    id="status"
                                    name="status"
                                    // value={status}
                                    onChange={(e) => {
                                        setStatus(e.target.value);
                                    }}
                                    defaultValue={jobApplication.status}
                                    >
                                    <MenuItem value="open">Open</MenuItem>
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="rejected">Rejected</MenuItem>
                                </Select>
                            </FormControl>

                            <DialogActions>
                                <Button color="info" variant="outlined" startIcon={<CancelIcon />} onClick={handleClose}>Cancel</Button>
                                <Button color="info" variant="contained" startIcon={<SaveIcon />} onClick={() => isNew?handleAddJobApplication():handleUpdateJobApplication(jobApplication.id)} >Save</Button>
                            </DialogActions>
                    </DialogContent>
                </Dialog>
            </>
    );
}