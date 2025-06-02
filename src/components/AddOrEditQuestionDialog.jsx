import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Grid, TextField } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import { useSnackbar } from './common/SnackbarContext';
import { ADD_QUESTION, UPDATE_QUESTION } from '../graphql/mutation';
import { GET_QUESTIONS } from '../graphql/query';
import CustomDialog from './common/CustomDialog';
import { useTranslation } from 'react-i18next';

export default function AddOrEditQuestionDialog({ handleClose, open, setOpen, question }) {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
  });
  const [errors, setErrors] = useState({});
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [addQuestion] = useMutation(ADD_QUESTION, {
    refetchQueries: [
      { query: GET_QUESTIONS },
    ],
  });

  const [updateQuestion] = useMutation(UPDATE_QUESTION);

  const validateFields = () => {
    const newErrors = {};
    if (!formData.question) newErrors.question = t('dialogs.addQuestion.errors.questionRequired');
    if (!formData.answer) newErrors.answer = t('dialogs.addQuestion.errors.answerRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    if (!validateFields()) return;
    try {
      event.preventDefault();
      const mutationFn = question ? updateQuestion : addQuestion;
      const variables = {
        ...formData,
        ...(question && { id: question.id }),
      };
      mutationFn({ variables });

      showSnackbar(t('dialogs.addQuestion.success'), 'success');
      setTimeout(() => handleClose(), 500);
    } catch (err) {
      showSnackbar(t('dialogs.addQuestion.error'), 'error');
    }
  };

  useEffect(() => {
    if (!question) {
      setFormData({
        question: '',
        answer: '',
      });
    } else {
      setFormData({
        question: question.question || '',
        answer: question.answer || '',
      });
    }
  }, [question]);

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      onCancel={handleClose}
      onSave={handleSubmit}
      title={t(question ? 'dialogs.addQuestion.editTitle' : 'dialogs.addQuestion.title')}
    >
      <DialogContent dividers>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <TextField
              id="question"
              name="question"
              label={t('dialogs.addQuestion.fields.question')}
              fullWidth
              variant="outlined"
              onChange={handleFormChange}
              value={formData.question}
              error={!!errors.question}
              helperText={errors.question}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="answer"
              name="answer"
              label={t('dialogs.addQuestion.fields.answer')}
              fullWidth
              multiline
              variant="outlined"
              onChange={handleFormChange}
              value={formData.answer}
              error={!!errors.answer}
              helperText={errors.answer}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </CustomDialog>
  );
}
