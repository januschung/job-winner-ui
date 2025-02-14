import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';

import Dialog from '@mui/material/Dialog';
import { Grid, TextField } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogTitleBar from './DialogTitleBar';
import { useSnackbar } from './common/SnackbarContext';
import { ADD_FREQUENT_URL, UPDATE_FREQUENT_URL } from '../graphql/mutation';
import { GET_FREQUENT_URLS } from '../graphql/query';


export default function AddOrEditFrequentUrlDialog({ handleClose, open, setOpen, frequentUrl }) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
  });
  const [errors, setErrors] = useState({});
  const { showSnackbar } = useSnackbar();

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
      showSnackbar('Error saving bookmark. Please try again.' + e, 'error');
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
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      height="lg"
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(8px)'
          },
        },
      }}
    >
      <DialogTitleBar title={(frequentUrl ? 'Edit ' : 'Add ') + 'Bookmark'} />             
        <DialogContent dividers>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <TextField
                id="title"
                name="title"
                label="Title"
                fullWidth
                variant="outlined"
                onChange={handleFormChange}
                value={formData.title}
                error={!!errors.title}
                helperText={errors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="url"
                name="url"
                label="Url"
                fullWidth
                variant="outlined"
                onChange={handleFormChange}
                value={formData.url}
                error={!!errors.url}
                helperText={errors.url}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="info" variant="outlined" startIcon={<CancelIcon />} onClick={handleClose}>
            Cancel
          </Button>
          <Button color="info" variant="contained" startIcon={<SaveIcon />} onClick={handleSubmit
          }>
            Save
          </Button>
      </DialogActions>
    </Dialog>
  );
}
