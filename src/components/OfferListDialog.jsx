import { useTranslation } from 'react-i18next';
import { GET_ALL_OFFERS } from '../graphql/query';
import RecordListDialog from './common/RecordListDialog';

// Defined outside the component so the derived rows stay memoized.
const selectRows = data => data.allOffer;

export default function OfferListDialog({ handleClose, open }) {
  const { t } = useTranslation();
  const label = key => t(`dialogs.offerList.columns.${key}`);

  return (
    <RecordListDialog
      open={open}
      handleClose={handleClose}
      query={GET_ALL_OFFERS}
      selectRows={selectRows}
      title={t('dialogs.offerList.title')}
      jobColumnLabel={label('jobApplication')}
      jobDetailsLabel={t('dialogs.offerList.jobDetails')}
      columns={[
        {
          key: 'jobApplication.companyName',
          label: label('companyName'),
          sortable: true,
          render: (value, row) =>
            value || row.jobApplication?.companyName || t('common.na'),
        },
        { key: 'offerDate', label: label('offerDate'), sortable: true },
        { key: 'salaryOffered', label: label('salaryOffered'), sortable: true },
        { key: 'description', label: label('note') },
      ]}
    />
  );
}
