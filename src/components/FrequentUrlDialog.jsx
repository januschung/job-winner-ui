import { useTranslation } from 'react-i18next';
import AddOrEditFrequentUrlDialog from './AddOrEditFrequentUrlDialog';
import CollectionDialog from './common/CollectionDialog';
import FrequentUrlContent from './FrequentUrlContent';

export default function FrequentUrlDialog({ handleClose, open }) {
  const { t } = useTranslation();
  return (
    <CollectionDialog
      open={open}
      handleClose={handleClose}
      title={t('dialogs.addBookmark.title')}
      FormDialog={AddOrEditFrequentUrlDialog}
    >
      <FrequentUrlContent />
    </CollectionDialog>
  );
}
