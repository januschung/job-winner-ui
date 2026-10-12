import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import DialogContent from '@mui/material/DialogContent';
import { Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import ActionIcons from './common/ActionIcons';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ConfirmDialog from './common/ConfirmDialog';
import useConfirmedAction from '../hooks/useConfirmedAction';
import useDialog from '../hooks/useDialog';
import { DELETE_QUESTION } from '../graphql/mutation';
import { GET_QUESTIONS } from '../graphql/query';
import AddOrEditQuestionDialog from './AddOrEditQuestionDialog';
import { useTranslation } from 'react-i18next';

export default function QuestionContent() {
  const { t } = useTranslation();

  const [question, setQuestion] = useState(null);
  const { dialogOpen, handleOpen, handleClose } = useDialog();
  const { data, loading, error } = useQuery(GET_QUESTIONS, {
    fetchPolicy: 'network-only',
  });
  const [deleteQuestion] = useMutation(DELETE_QUESTION, {
    refetchQueries: [{ query: GET_QUESTIONS }],
  });
  const remove = useConfirmedAction({
    action: item => deleteQuestion({ variables: { id: item.id } }),
    successMessage: t('questionContent.messages.deleteSuccess'),
    errorMessage: t('questionContent.messages.deleteError'),
  });

  const handleOpenEditDialog = question => {
    setQuestion(question);
    handleOpen();
  };

  return (
    <DialogContent>
      <AddOrEditQuestionDialog
        open={dialogOpen}
        handleClose={handleClose}
        question={question}
      />
      {loading &&
        Array.from(new Array(4)).map((_, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ backgroundColor: 'custom.table.header' }}
            >
              <Skeleton variant="text" width="80%" height={24} />
            </AccordionSummary>
            <AccordionDetails>
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="60%" height={20} />
            </AccordionDetails>
          </Accordion>
        ))}
      {!loading && !error && data?.allQuestion?.length === 0 && (
        <Typography variant="body1">
          {t('questionContent.messages.noQuestions')}
        </Typography>
      )}
      {!loading && !error && data?.allQuestion?.length > 0 && (
        <>
          {data.allQuestion.map(question => (
            <Accordion key={question.id}>
              <AccordionSummary
                // A div (with button role) rather than a <button>, so the
                // edit/delete buttons inside are valid HTML.
                component="div"
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  backgroundColor: 'custom.table.header',
                  '&:hover': {
                    backgroundColor: 'custom.table.headerHover',
                  },
                }}
              >
                <Typography component="span" sx={{ flexGrow: 1 }}>
                  {question.question}
                </Typography>
                <ActionIcons
                  onEdit={() => handleOpenEditDialog(question)}
                  onDelete={() => remove.request(question)}
                  name={question.question}
                  stopPropagation
                />
              </AccordionSummary>
              <AccordionDetails>{question.answer}</AccordionDetails>
            </Accordion>
          ))}
        </>
      )}
      <ConfirmDialog
        {...remove.dialogProps}
        title={t('questionContent.dialogs.confirmDelete.title')}
        content={t('questionContent.dialogs.confirmDelete.content')}
      />
    </DialogContent>
  );
}
