import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Grid, TextField } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import { useSnackbar } from './common/SnackbarContext';
import { ADD_QUESTION, UPDATE_QUESTION } from '../graphql/mutation';
import { GET_QUESTIONS } from '../graphql/query';
import CustomDialog from './common/CustomDialog';


export default function AddOrEditQuestionDialog({ handleClose, open, setOpen, question }) {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
  });
  const [errors, setErrors] = useState({});
  const { showSnackbar } = useSnackbar();

  const [addQuestion] = useMutation(ADD_QUESTION, {
    refetchQueries: [
      { query: GET_QUESTIONS },
    ],
  });
  
  const [updateQuestion] = useMutation(UPDATE_QUESTION);

  const validateFields = () => {
    const newErrors = {};
    if (!formData.question) newErrors.question = 'Question is required.';
    if (!formData.answer) newErrors.answer = 'Answer is required.';
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

      showSnackbar('Q&A updated successfully!', 'success');
      setTimeout(() => handleClose(), 500);
    } catch (err) {
      showSnackbar('Error saving Q&A. Please try again.' + err, 'error');
    }
  };

  useEffect(() => {
      if (!question) {
          setFormData({
              ...formData,
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
      title={(question ? 'Edit ' : 'Add ') + 'Q&A'}
    >      
      <DialogContent dividers>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <TextField
              id="question"
              name="question"
              label="Question"
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
              label="Answer"
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
