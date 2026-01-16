import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ApplicationForm from './forms/ApplicationForm';
import InterviewsForm from './forms/InterviewsForm';
import OfferForm from './forms/OfferForm';
import CustomDialog from './common/CustomDialog';
import { useTranslation } from 'react-i18next';

export default function JobApplicationDialog({
  jobApplication,
  handleClose,
  open,
  setOpen,
  isNew,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useTranslation();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      title={t(
        isNew
          ? 'dialogs.jobApplication.addTitle'
          : 'dialogs.jobApplication.editTitle'
      )}
    >
      {!isNew && (
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label={t('dialogs.jobApplication.tabs.application')} />
          <Tab label={t('dialogs.jobApplication.tabs.interviews')} />
          <Tab label={t('dialogs.jobApplication.tabs.offer')} />
        </Tabs>
      )}
      {isNew && <div />}
      {activeTab === 0 && (
        <ApplicationForm
          jobApplication={jobApplication}
          isNew={isNew}
          setOpen={setOpen}
          handleClose={handleClose}
        />
      )}
      {activeTab === 1 && (
        <InterviewsForm jobApplicationId={parseInt(jobApplication?.id || 0)} />
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
