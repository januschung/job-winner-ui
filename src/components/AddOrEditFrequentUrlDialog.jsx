import { useTranslation } from 'react-i18next';
import { ADD_FREQUENT_URL, UPDATE_FREQUENT_URL } from '../graphql/mutation';
import { GET_FREQUENT_URLS } from '../graphql/query';
import RecordFormDialog from './common/RecordFormDialog';

export default function AddOrEditFrequentUrlDialog({
  handleClose,
  open,
  frequentUrl,
}) {
  const { t } = useTranslation();
  const key = suffix => `dialogs.addBookmark.${suffix}`;

  return (
    <RecordFormDialog
      open={open}
      handleClose={handleClose}
      record={frequentUrl}
      fields={[
        {
          name: 'title',
          label: t(key('fields.title')),
          requiredMessage: t(key('errors.titleRequired')),
        },
        {
          name: 'url',
          label: t(key('fields.url')),
          requiredMessage: t(key('errors.urlRequired')),
        },
      ]}
      addMutation={ADD_FREQUENT_URL}
      updateMutation={UPDATE_FREQUENT_URL}
      refetchQueries={[{ query: GET_FREQUENT_URLS }]}
      title={t(key(frequentUrl ? 'editTitle' : 'addTitle'))}
      successMessage={t(key('saveSuccess'))}
      errorMessage={t(key('saveError'))}
      saveLabel={t(key('saveButton'))}
    />
  );
}
