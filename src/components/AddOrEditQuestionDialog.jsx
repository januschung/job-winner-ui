import { useTranslation } from 'react-i18next';
import { ADD_QUESTION, UPDATE_QUESTION } from '../graphql/mutation';
import { GET_QUESTIONS } from '../graphql/query';
import RecordFormDialog from './common/RecordFormDialog';

export default function AddOrEditQuestionDialog({
  handleClose,
  open,
  question,
}) {
  const { t } = useTranslation();
  const key = suffix => `dialogs.addQuestion.${suffix}`;

  return (
    <RecordFormDialog
      open={open}
      handleClose={handleClose}
      record={question}
      fields={[
        {
          name: 'question',
          label: t(key('fields.question')),
          requiredMessage: t(key('errors.questionRequired')),
        },
        {
          name: 'answer',
          label: t(key('fields.answer')),
          requiredMessage: t(key('errors.answerRequired')),
          multiline: true,
        },
      ]}
      addMutation={ADD_QUESTION}
      updateMutation={UPDATE_QUESTION}
      refetchQueries={[{ query: GET_QUESTIONS }]}
      title={t(key(question ? 'editTitle' : 'title'))}
      successMessage={t(key('success'))}
      errorMessage={t(key('error'))}
    />
  );
}
