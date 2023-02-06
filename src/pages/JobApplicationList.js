import React from 'react'
import { useQuery } from "@apollo/client"

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import DeleteIcon from '@mui/icons-material/Delete';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import ReactLoading from 'react-loading'
import { GET_JOB_APPLICATIONS } from '../graphql/query'
import { DELETE_JOB_APPLICATION } from '../graphql/mutation'
import { useMutation } from '@apollo/client';




export default function JobApplicationList() {

    const { error, data, loading } = useQuery(GET_JOB_APPLICATIONS, {
        fetchPolicy: 'network-only'
    });

    console.log({ error, data, loading });

    const [deleteJobApplication, { delError, delData, delLoading }] = useMutation(DELETE_JOB_APPLICATION, {
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
                                            <Button size="small" color="info" variant="outlined" startIcon={<ReadMoreIcon />}>View</Button>
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