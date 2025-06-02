import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import DialogContent from '@mui/material/DialogContent';
import { Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import ActionIcons from './common/ActionIcons';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ConfirmDialog from './common/ConfirmDialog';
import { useSnackbar } from './common/SnackbarContext';
import useDialog from '../hooks/useDialog';
import useQuestion from '../hooks/useQuestion';
import { DELETE_QUESTION } from '../graphql/mutation';
import { GET_QUESTIONS } from '../graphql/query';
import AddOrEditQuestionDialog from './AddOrEditQuestionDialog';
import { useTheme } from "@mui/material/styles";
import { useTranslation } from 'react-i18next';

export default function QuestionContent() {
  const theme = useTheme();
  const { t } = useTranslation();

  const [question, setQuestion] = useState(null);
  const { dialogOpen: confirmDialogOpen, 
          handleOpen: handleConfirmDialogOpen, 
          handleClose: handleConfirmDialogClose } = useDialog();

  const { dialogOpen, handleOpen, handleClose } = useDialog();

  const { data, loading, error } = useQuestion();
  const { showSnackbar } = useSnackbar();
  const [deleteQuestion] = useMutation(DELETE_QUESTION, {
    refetchQueries: [{ query: GET_QUESTIONS }],
  });

  const confirmDeleteQuestion = () => {
    deleteQuestion({
      variables: { id: question.id }
    })
      .then(() => {
        showSnackbar(t('questionContent.messages.deleteSuccess'), 'success');
    })
      .catch(() => {
        showSnackbar(t('questionContent.messages.deleteError'), 'error');
    });
    handleConfirmDialogClose();
  }

  const handleDeleteQuestion = (question) => {
    setQuestion(question)
    handleConfirmDialogOpen();    
  };

  const handleOpenEditDialog = (question) => {
    setQuestion(question)
    handleOpen();
  }

  return (
    <DialogContent dividers>
      <AddOrEditQuestionDialog open={dialogOpen} handleClose={handleClose} question={question} />
      {loading && (
        Array.from(new Array(4)).map((_, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ backgroundColor: theme.palette.custom.table.header }}
            >
              <Skeleton variant="text" width="80%" height={24} />
            </AccordionSummary>
            <AccordionDetails>
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="60%" height={20} />
            </AccordionDetails>
          </Accordion>
        ))
      )}
        {!loading && !error && data?.allQuestion?.length === 0 && (
          <Typography variant="body1">{t('questionContent.messages.noQuestions')}</Typography>
        )}
        {!loading && !error && data?.allQuestion?.length > 0 && (
          <>
            {data.allQuestion.map((question) => (
                <Accordion key={question.id}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{ 
                      display: "flex", 
                      alignItems: "center", 
                      width: "100%", 
                      backgroundColor: theme.palette.custom.table.header,
                      "&:hover": { backgroundColor: theme.palette.custom.table.headerHover }
                    }}
                  >
                    <Typography component="span" sx={{ flexGrow: 1 }}>
                      {question.question}
                    </Typography>
                    <ActionIcons 
                      onEdit={() => handleOpenEditDialog(question)} 
                      onDelete={() => handleDeleteQuestion(question)} 
                      stopPropagation 
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    {question.answer}
                  </AccordionDetails>
                </Accordion>
              ))}
            </>
          )}
        <ConfirmDialog
            open={confirmDialogOpen}
            onCancel={handleConfirmDialogClose}
            onConfirm={confirmDeleteQuestion}
            title={t('questionContent.dialogs.confirmDelete.title')}
            content={t('questionContent.dialogs.confirmDelete.content')}
        />
      </DialogContent>
    );
  }
