import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ApplicationForm from './forms/ApplicationForm';
import InterviewsForm from './forms/InterviewsForm';
import OfferForm from './forms/OfferForm';
import CustomDialog from './common/CustomDialog';


export default function JobApplicationDialog({ jobApplication, handleClose, open, setOpen, isNew }) {

    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <CustomDialog
          open={open}
          onClose={handleClose}
          title={(isNew ? 'Add ' : 'Edit ') + 'Job Application'}
        >
          {!isNew && (
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
          )}  
          {isNew && (
            <div/>
          )}
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
              jobApplicationId={parseInt(jobApplication?.id || 0)}
            />
          )}

          {activeTab === 2 && (
            <OfferForm
              jobApplicationId={parseInt(jobApplication?.id || 0)}
              handleClose={handleClose}
            />
          )}
        </CustomDialog>
    );
}
