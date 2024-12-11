import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Dialog from '@mui/material/Dialog';

import DialogTitleBar from './DialogTitleBar';

import ApplicationForm from './forms/ApplicationForm';
import InterviewsForm from './forms/InterviewsForm';
import OfferForm from './forms/OfferForm';


export default function JobApplicationDialog({ jobApplication, handleClose, open, setOpen, isNew }) {

    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            height="lg"
            slotProps={{
                backdrop: {
                    sx: {
                        backdropFilter: 'blur(8px)'
                    },
                },
            }}
        >
            <DialogTitleBar title={(isNew ? 'Add ' : 'Edit ') + 'Job Application'} />
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
            >
                <Tab label="Application" />
                <Tab label="Interviews" />
                <Tab label="Offer" />
            </Tabs>
            {activeTab === 0 && (
                <ApplicationForm
                    jobApplication={jobApplication}
                    isNew={isNew}
                    setOpen={setOpen}
                    handleClose={handleClose}
                />
            )}
            {activeTab === 1 && (
                <InterviewsForm 
                    // jobApplicationId={jobApplication}
                    handleClose={handleClose}
                />
            )}

            {activeTab === 2 && (
                <OfferForm
                    jobApplicationId={parseInt(jobApplication.id)}
                    handleClose={handleClose}
                />
            )}
        </Dialog>
    );
}
