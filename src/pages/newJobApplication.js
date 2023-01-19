import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Link, Navigate } from "react-router-dom";

import { gql, useMutation } from '@apollo/client';
import GET_JOB_APPLICATIONS from './JobApplicationList'


const ADD_JOB_APPLICATION = gql`
    mutation AddJobApplication(
        $companyName: String!,
        $jobTitle: String!,
        $description: String!,
        $salaryRange: String!,
        $status: String!,
        $jobUrl: String!,
        $appliedDate: String!
    ){
        addJobApplication(addJobApplicationInput: {
        companyName: $companyName,
        jobTitle: $jobTitle,
        description: $description,
        salaryRange: $salaryRange,
        status: $status,
        jobUrl: $jobUrl,
        appliedDate: $appliedDate
        }) {
      id
    }
  }

`


export default function NewJobApplication() {
    const [newJobApplication, {error, data, loading }] = useMutation(ADD_JOB_APPLICATION, {refreshQueries: [
        {query: GET_JOB_APPLICATIONS},
        'allJobApplication'
    ]});

    const [companyName, setCompanyName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [salaryRange, setSalaryRange] = useState("");
    const [description, setDescription] = useState("");
    const [jobUrl, setjobUrl] = useState("");
    const [status, setStatus] = useState('open');
    const [appliedDate, setAppliedDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'));

    console.log("DATE IS :" + appliedDate)

    const addJobApplication = () => {
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
    }

    console.log({ error, data, loading });
    
    if (loading) return <div>spinner...</div>

    if (error) return <div>something went wrong</div>

    if (data) {
        const linkTarget = {
            pathname: "/success",
            key: Math.random,
            state:{
                applied: true
            }
        }
        
        return <Navigate to ={linkTarget} />;
    }
    
    return (
        <div>
            <main>
                <Container sx={{ py: 8 }} maxWidth="md">
                    <Typography variant="h6" gutterBottom>
                        New Job Application
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
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
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
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
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
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
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DesktopDatePicker
                            label="Applied Date"
                            inputFormat="MM/DD/YYYY"
                            value={appliedDate}
                            onChange={(e) => {
                                setAppliedDate(dayjs(e).format('YYYY-MM-DD'))
                            } } 
                            renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                        <TextField
                            required
                            id="description"
                            name="description"
                            label="Description"
                            multiline
                            rows={4}
                            fullWidth
                            autoComplete="shipping address-line1"
                            variant="standard"
                            onChange={(e) => {
                                setDescription(e.target.value);
                            }}
                        />
                        </Grid>
                        <Grid item xs={12}>
                        <TextField
                            required
                            id="jobUrl"
                            name="jobUrl"
                            label="Job Link"
                            multiline
                            rows={4}
                            fullWidth
                            autoComplete="shipping address-line2"
                            variant="standard"
                            onChange={(e) => {
                                setjobUrl(e.target.value);
                            }}
                        />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl sx={{ minWidth: 120 }} variant="standard" size="small">
                                <InputLabel id="status-label">Status</InputLabel>
                                <Select
                                    labelId="status-label"
                                    id="status"
                                    name="status"
                                    value={status}
                                    onChange={(e) => {
                                        setStatus(e.target.value);
                                    }}
                                    defaultValue="open"
                                    >
                                    <MenuItem value="open">Open</MenuItem>
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="rejected">Rejected</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        </Grid>
                        <Grid item xs={2}>
                            <Button variant="contained" onClick={() => addJobApplication()}>
                                Save
                            </Button>
                        </Grid>
                        <Grid item xs={2}>
                            <Button variant="contained" component={Link} to="/">
                                Cancel
                            </Button>
                        </Grid>                    
                    </Grid>
                </Container>
            </main>
        </div>
    )
}