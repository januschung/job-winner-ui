import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import DialogContent from '@mui/material/DialogContent';
import { Typography } from '@mui/material';
import ActionIcons from './common/ActionIcons';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useQuestion from './hooks/useQuestion';
import Loading from './common/Loading';
import ConfirmDialog from './common/ConfirmDialog';
import { useSnackbar } from './common/SnackbarContext';
import useDialog from './hooks/useDialog';
import { DELETE_QUESTION } from '../graphql/mutation';
import { GET_QUESTIONS } from '../graphql/query';
import AddOrEditQuestionDialog from './AddOrEditQuestionDialog';


export default function QuestionContent({ }) {
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
        showSnackbar("Bookmark deleted successfully!");
    })
      .catch(() => {
        showSnackbar("Failed to delete the bookmark.");
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
        {loading && <Loading />}
        {!loading && !error && data?.allQuestion?.length === 0 && (
          <Typography variant="body1">No Q&A</Typography>
        )}
        {!loading && !error && data?.allQuestion?.length > 0 && (
          <>
            {data.allQuestion.map((question) => (
              <>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{ 
                      display: "flex", 
                      alignItems: "center", 
                      width: "100%", 
                      backgroundColor: "#e3f2fd",
                      "&:hover": { backgroundColor: "#e0e0e0" }
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
              </>
              ))}
            </>
          )}
        <ConfirmDialog
            open={confirmDialogOpen}
            onCancel={handleConfirmDialogClose}
            onConfirm={confirmDeleteQuestion}
            title="Confirm Deletion"
            content="Are you sure you want to delete this Q&A? This action cannot be undone."
        />
      </DialogContent>
    );
  }
