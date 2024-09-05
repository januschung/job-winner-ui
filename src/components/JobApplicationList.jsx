import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
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
import JobApplicationDialog from '../components/JobApplicationDialog';
import Loading from '../components/Loading';
import { DELETE_JOB_APPLICATION } from '../graphql/mutation';
import { GET_JOB_APPLICATIONS } from '../graphql/query';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export default function JobApplicationList({ searchTerm }) {
    const [open, setOpen] = useState(false);
    const [jobApplication, setJobApplication] = useState("");
    const [localData, setLocalData] = useState([]);

    const { error, data, loading } = useQuery(GET_JOB_APPLICATIONS, {
        fetchPolicy: 'network-only'
    });

    const [deleteJobApplication] = useMutation(DELETE_JOB_APPLICATION, {
        refetchQueries: [{ query: GET_JOB_APPLICATIONS }]
    });

    useEffect(() => {
        if (data) {
            setLocalData(data.allJobApplication);
        }
    }, [data]);

    const handleOpen = (jobApplication) => {
        setJobApplication(jobApplication);
        setOpen(true);
    }

    const handleClose = () => setOpen(false);

    const handleDeleteJobApplication = (id) => {
        if (window.confirm('Are you sure you want to delete?')) {
            deleteJobApplication({
                variables: { id }
            }).then(() => {
                setLocalData(localData.filter(jobApp => jobApp.id !== id));
            });
        }
    }

    function containsIgnoreCase(str, searchTerm) {
        if (searchTerm) {
            return str.toLowerCase().includes(searchTerm.toLowerCase());
        } else {
            return str.toLowerCase().includes(searchTerm);
        }
    }
    
    const filteredData = localData.filter(jobApp =>
        containsIgnoreCase(jobApp.companyName, searchTerm) ||
        containsIgnoreCase(jobApp.description, searchTerm) ||
        containsIgnoreCase(jobApp.jobTitle, searchTerm)
    );
    
    
    return (
        <div>
            <main>
                <JobApplicationDialog jobApplication={jobApplication} handleClose={handleClose} open={open} setOpen={setOpen}/>                
                <Container sx={{ py: 8 }} maxWidth="lg">
                    {loading && <Loading />}
                    {error && (
                        <Alert severity="error" icon={<ErrorIcon fontSize="inherit" />} sx={{ mt: 2 }}>
                            <AlertTitle>Error</AlertTitle>
                            <strong>Failed to fetch data. Please check your network connection and try again.</strong>
                        </Alert>
                    )}
                    {!loading && !error && (
                    <Grid container spacing={4}>
                        {filteredData.map(jobApplication => (
                            <Grid item key={jobApplication.id} xs={12} sm={6} md={4}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                                            <Button size="small" color="warning" variant="outlined" startIcon={<DeleteIcon />} onClick={() => handleDeleteJobApplication(jobApplication.id)}>Delete</Button>
                                        </CardActions>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    )}
                </Container>
            </main>
        </div>
    );
}
