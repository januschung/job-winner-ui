import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useTranslation } from 'react-i18next';
import { GET_INTERVIEWS_BY_JOB_APPLICATION_ID } from '../graphql/query';
import ApplicationForm from './forms/ApplicationForm';
import InterviewsForm from './forms/InterviewsForm';
import OfferForm from './forms/OfferForm';
import CustomDialog from './common/CustomDialog';
import StatusBadge from './common/StatusBadge';

const TabCount = ({ value }) => (
  <Box
    component="span"
    sx={{
      ml: 0.25,
      px: 0.875,
      borderRadius: 999,
      fontSize: '0.75rem',
      lineHeight: '18px',
      bgcolor: theme =>
        `rgba(${theme.vars.palette.primary.mainChannel} / 0.12)`,
      color: 'primary.main',
    }}
  >
    {value}
  </Box>
);

export default function JobApplicationDialog({
  jobApplication,
  handleClose,
  open,
  isNew,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useTranslation();
  const jobApplicationId = parseInt(jobApplication?.id || 0);
  // Shares the cache with the Interviews tab, so this adds no request.
  const { data: interviewData } = useQuery(
    GET_INTERVIEWS_BY_JOB_APPLICATION_ID,
    { variables: { jobApplicationId }, skip: isNew || !jobApplicationId }
  );
  const interviewCount =
    interviewData?.allInterviewByJobApplicationId?.length ?? 0;

  const header = isNew
    ? {
        title: t('dialogs.jobApplication.addTitle'),
        subtitle: t('dialogs.jobApplication.addSubtitle'),
      }
    : {
        title: jobApplication?.companyName,
        subtitle: jobApplication?.jobTitle,
        headerAction: jobApplication?.status && (
          <StatusBadge
            tone={jobApplication.status}
            label={t(`jobStatusBar.${jobApplication.status}`, {
              defaultValue: jobApplication.status,
            })}
          />
        ),
      };

  return (
    <CustomDialog open={open} onClose={handleClose} {...header}>
      {!isNew && (
        <Tabs
          value={activeTab}
          onChange={(event, value) => setActiveTab(value)}
          sx={{
            px: 3,
            borderBottom: 1,
            borderColor: 'divider',
            minHeight: 44,
            '& .MuiTab-root': { minWidth: 0, px: 0, mr: 3, minHeight: 44 },
          }}
        >
          <Tab label={t('dialogs.jobApplication.tabs.application')} />
          <Tab
            label={
              <span>
                {t('dialogs.jobApplication.tabs.interviews')}
                {interviewCount > 0 && (
                  <>
                    {' '}
                    <TabCount value={interviewCount} />
                  </>
                )}
              </span>
            }
          />
          <Tab label={t('dialogs.jobApplication.tabs.offer')} />
        </Tabs>
      )}
      {activeTab === 0 && (
        <ApplicationForm
          jobApplication={jobApplication}
          isNew={isNew}
          handleClose={handleClose}
        />
      )}
      {activeTab === 1 && (
        <InterviewsForm
          jobApplicationId={jobApplicationId}
          handleClose={handleClose}
        />
      )}
      {activeTab === 2 && (
        <OfferForm
          jobApplicationId={jobApplicationId}
          handleClose={handleClose}
        />
      )}
    </CustomDialog>
  );
}
