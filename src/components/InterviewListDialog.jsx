import { useTranslation } from 'react-i18next';
import { GET_ALL_INTERVIEWS } from '../graphql/query';
import { getFilteredInterviews } from '../utils/interviewUtil';
import RecordListDialog from './common/RecordListDialog';

// Defined outside the component so the derived rows stay memoized.
const selectRows = data => getFilteredInterviews(data.allInterview);

export default function InterviewListDialog({ handleClose, open }) {
  const { t } = useTranslation();
  const label = key => t(`dialogs.interviewList.columns.${key}`);

  return (
    <RecordListDialog
      open={open}
      handleClose={handleClose}
      query={GET_ALL_INTERVIEWS}
      selectRows={selectRows}
      title={t('dialogs.interviewList.title')}
      jobColumnLabel={label('jobApplication')}
      jobDetailsLabel={t('dialogs.interviewList.jobDetails')}
      columns={[
        {
          key: 'jobApplication.companyName',
          label: label('companyName'),
          sortable: true,
          render: (value, row) =>
            value || row.jobApplication?.companyName || t('common.na'),
        },
        { key: 'interviewDate', label: label('interviewDate'), sortable: true },
        { key: 'interviewer', label: label('interviewer'), sortable: true },
        { key: 'description', label: label('note') },
        { key: 'status', label: label('status'), sortable: true },
      ]}
    />
  );
}
