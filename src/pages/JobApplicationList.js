import { useQuery } from "@apollo/client";
import React, { useState } from 'react';

import { useMutation } from '@apollo/client';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import CancelIcon from '@mui/icons-material/Cancel';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import ReactLoading from 'react-loading';
import { UPDATE_JOB_APPLICATION, DELETE_JOB_APPLICATION } from '../graphql/mutation';
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


export default function JobApplicationList() {

    const [open, setOpen] = useState(false);
    const [companyName, setCompanyName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [salaryRange, setSalaryRange] = useState("");
    const [description, setDescription] = useState("");
    const [jobUrl, setjobUrl] = useState("");
    const [status, setStatus] = useState('open');
    const [appliedDate, setAppliedDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'));
    const [jobApplication, setJobApplication ] = useState("")
    
    function handleOpen(jobApplication) {
        setOpen(true);
        setJobApplication(jobApplication)
        setStatus(jobApplication.status)
        setAppliedDate(jobApplication.appliedDate)
        console.log("edit id: " + jobApplication.id)
    }
    
    const handleClose = () => setOpen(false);

    const { error, data, loading } = useQuery(GET_JOB_APPLICATIONS, {
        fetchPolicy: 'network-only'
    });

    console.log({ error, data, loading });

    const [deleteJobApplication, { delError, delData, delLoading }] = useMutation(DELETE_JOB_APPLICATION, {
        refetchQueries: [
            {query: GET_JOB_APPLICATIONS}
        ]
    });

    const [updateJobApplication, { updateError, updateData, updateLoading }] = useMutation(UPDATE_JOB_APPLICATION, {
        refetchQueries: [
            {query: GET_JOB_APPLICATIONS}
        ]
    });

    function handleDeleteJobApplication(id) {
        console.log("delete id: " + id)
        deleteJobApplication({
            variables: {
                id: id
            }
        })
    }

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
    
    if (loading) return <div>
                            <main>
                                <Container sx={{ py: 8 }} maxWidth="md">
                                    <Grid container spacing={4}>
                                        <Grid item xs={12} sm={6} md={4} />
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Card/>
                                            <Card
                                                sx={{ justifyContent: 'center' }}
                                            >
                                                <CardContent>
                                                    <ReactLoading
                                                        type="spin"
                                                        color="inherit"
                                                        height={100}
                                                        width={50}
                                                        />
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Container>
                            </main>
                        </div>

    if (error) return <div>something went wrong</div>
    
    return (
        <div>
            <main>
                <div>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <DialogTitle>Edit Job Application</DialogTitle>
                        <DialogContent>
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
                                    setjobUrl(e.target.value);
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
                                        value={status}
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
                                    <Button color="success" variant="outlined" startIcon={<SaveIcon />} onClick={() => handleUpdateJobApplication(jobApplication.id)} >Save</Button>
                                </DialogActions>
                        </DialogContent>
                    </Dialog>
                </div>
                <Container sx={{ py: 8 }} maxWidth="md">
                    <Grid container spacing={4}>

                {data.allJobApplication.map(jobApplication => {
                    return <Grid item key={jobApplication.id} xs={12} sm={6} md={4}>
                                <Card
                                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                >
                                    <CardContent>
                                        <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                                        <CalendarMonthRoundedIcon fontSize="inherit"/> {jobApplication.appliedDate}
                                        </Typography>
                                        <Typography variant="h5" component="div">
                                        {jobApplication.companyName}
                                        </Typography>
                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        {jobApplication.jobTitle}
                                        </Typography>
                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        <MonetizationOnIcon fontSize="inherit"/>{jobApplication.salaryRange}
                                        </Typography>
                                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Status: {jobApplication.status}
                                        </Typography>
                                        </CardContent>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography color="text.secondary">
                                        <CommentRoundedIcon fontSize="inherit"/>
                                        <br/>
                                        {jobApplication.description}
                                        </Typography>
                                        <Typography color="text.secondary">
                                        <LinkRoundedIcon fontSize="inherit"/> <Link href={jobApplication.jobUrl} underline="hover" color="inherit">job link</Link>
                                        </Typography>
                                        <CardActions>
                                            <Button size="small" color="info" variant="outlined" startIcon={<ReadMoreIcon />} onClick={() => handleOpen(jobApplication)}>Edit</Button>
                                            <Button size="small" color="warning" variant="outlined" startIcon={<DeleteIcon />}  onClick={() => handleDeleteJobApplication(jobApplication.id)}>Delete</Button>
                                        </CardActions>
                                    </CardContent>
                                </Card>
                            </Grid>
                    })}
                    </Grid>
                </Container>
            </main>
        </div>
    )
}