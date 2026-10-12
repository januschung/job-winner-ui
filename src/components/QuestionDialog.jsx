import { useTranslation } from 'react-i18next';
import AddOrEditQuestionDialog from './AddOrEditQuestionDialog';
import CollectionDialog from './common/CollectionDialog';
import QuestionContent from './QuestionContent';

export default function QuestionDialog({ handleClose, open }) {
  const { t } = useTranslation();
  return (
    <CollectionDialog
      open={open}
      handleClose={handleClose}
      title={t('dialogs.question.title')}
      FormDialog={AddOrEditQuestionDialog}
    >
      <QuestionContent />
    </CollectionDialog>
  );
}
