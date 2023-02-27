import { useQuery } from "@apollo/client";
import React, { useState } from 'react';

import { useMutation } from '@apollo/client';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import DeleteIcon from '@mui/icons-material/Delete';
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




export default function JobApplicationList() {

    const [open, setOpen] = useState(false);
    const [jobApplication, setJobApplication] = useState("")

    function handleOpen(jobApplication) {
        
        setJobApplication(jobApplication)
        setOpen(true);
        console.log("edit companyName: " + jobApplication.companyName)
        console.log("passing jobApplication info: " + jobApplication.companyName)
    }
    
    const handleClose = () => setOpen(false);

    const { error, data, loading } = useQuery(GET_JOB_APPLICATIONS, {
        fetchPolicy: 'network-only'
    });

    console.log({ error, data, loading });

    const [deleteJobApplication] = useMutation(DELETE_JOB_APPLICATION, {
        refetchQueries: [
            {query: GET_JOB_APPLICATIONS}
        ]
    });

    function handleDeleteJobApplication(id) {
        if(window.confirm('Are you sure you want to delete?')) {
            console.log("delete id: " + id)
            deleteJobApplication({
                variables: {
                    id: id
                }
            })
        }
    }
    
    if (loading) return <Loading/>
    
    if (error) return <div>something went wrong</div>
    
    return (
        <div>
            <main>
                <JobApplicationDialog jobApplication={jobApplication} handleClose={handleClose} open={open} setOpen={setOpen}/>                
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