import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Grid, TextField } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import { useSnackbar } from './common/SnackbarContext';
import { ADD_FREQUENT_URL, UPDATE_FREQUENT_URL } from '../graphql/mutation';
import { GET_FREQUENT_URLS } from '../graphql/query';
import CustomDialog from './common/CustomDialog';
import { useTranslation } from 'react-i18next';

export default function AddOrEditFrequentUrlDialog({ handleClose, open, setOpen, frequentUrl }) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
  });
  const [errors, setErrors] = useState({});
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [addFrequentUrl] = useMutation(ADD_FREQUENT_URL, {
    refetchQueries: [
      { query: GET_FREQUENT_URLS },
    ],
  });
  
  const [updateFrequentUrl] = useMutation(UPDATE_FREQUENT_URL);

  const validateFields = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required.';
    if (!formData.url) newErrors.url = 'Url is required.';
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
      const mutationFn = frequentUrl ? updateFrequentUrl : addFrequentUrl;
      const variables = {
          ...formData,
          ...(frequentUrl && { id: frequentUrl.id }),
      };
      mutationFn({ variables });

      showSnackbar('Bookmark updated successfully!', 'success');
      setTimeout(() => handleClose(), 500);
    } catch (err) {
      showSnackbar('Error saving bookmark. Please try again.' + err, 'error');
    }
  };

  useEffect(() => {
      if (!frequentUrl) {
          setFormData({
              ...formData,
          });
      } else {
          setFormData({
              title: frequentUrl.title || '',
              url: frequentUrl.url || '',
          });
      }
  }, [frequentUrl]);

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      onCancel={handleClose}
      onSave={handleSubmit}
      title={(frequentUrl ? 'Edit ' : 'Add ') + 'Bookmark'}
    >
      <DialogContent dividers>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <TextField
              id="title"
              name="title"
              label={t('dialogs.addBookmark.fields.title')}
              fullWidth
              variant="outlined"
              onChange={handleFormChange}
              value={formData.title}
              error={!!errors.title}
              helperText={errors.title && t('dialogs.addBookmark.errors.titleRequired')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="url"
              name="url"
              label={t('dialogs.addBookmark.fields.url')}
              fullWidth
              variant="outlined"
              onChange={handleFormChange}
              value={formData.url}
              error={!!errors.url}
              helperText={errors.url && t('dialogs.addBookmark.errors.urlRequired')}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </CustomDialog>
  );
}
