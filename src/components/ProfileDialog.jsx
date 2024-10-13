import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography, Grid } from '@mui/material';
import { UPDATE_PROFILE } from '../graphql/mutation';
import { GET_PROFILE } from '../graphql/query';
import ProfileTextField from './ProfileTextField';

export default function ProfileDialog({ profile, handleClose, open, setOpen }) {
  const id = 1;

  const fields = [
    { id: 'firstName', label: 'First Name' },
    { id: 'lastName', label: 'Last Name' },
    { id: 'addressStreet1', label: 'Address Line 1' },
    { id: 'addressStreet2', label: 'Address Line 2' },
    { id: 'addressCity', label: 'City' },
    { id: 'addressState', label: 'State' },
    { id: 'addressZip', label: 'ZIP Code' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'github', label: 'GitHub' },
    { id: 'personalWebsite', label: 'Personal Website' },
  ];

  const initialFormData = () => 
    fields.reduce((acc, field) => {
      acc[field.id] = '';
      return acc;
    }, {});

  const [formData, setFormData] = useState(initialFormData);

  const { error, data, loading } = useQuery(GET_PROFILE, {
    variables: { id },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        ...profile
      });
    }
  }, [profile, open]);

  const [updateProfile] = useMutation(UPDATE_PROFILE, {
    refetchQueries: [{ query: GET_PROFILE, variables: { id } }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateProfile = (event) => {
    event.preventDefault();
    updateProfile({
      variables: {
        id: 1,
        ...formData,
      },
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description" fullWidth maxWidth="sm">
      <DialogTitle>Profile</DialogTitle>
      <form onSubmit={handleUpdateProfile}>
        <DialogContent dividers>
          <Grid container spacing={2} alignItems="center">
            {fields.map((field) => (
              <ProfileTextField
                key={field.id}
                id={field.id}
                label={field.label}
                value={formData[field.id]}
                onChange={handleChange}
                name={field.id}
              />
            ))}
          </Grid>
          <Typography variant="overline" align="right" paragraph>
            * Click the copy icon to copy to clipboard
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="info" variant="outlined" startIcon={<CancelIcon />} onClick={handleClose}>
            Cancel
          </Button>
          <Button color="info" variant="contained" startIcon={<SaveIcon />} type="submit">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
