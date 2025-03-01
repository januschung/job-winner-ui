import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import DialogContent from '@mui/material/DialogContent';
import { Grid } from '@mui/material';
import { UPDATE_PROFILE } from '../graphql/mutation';
import { GET_PROFILE } from '../graphql/query';
import { useSnackbar } from './common/SnackbarContext';
import ProfileTextField from './ProfileTextField';
import CustomDialog from './common/CustomDialog';

export default function ProfileDialog({ profile, handleClose, open }) {
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

  const { showSnackbar } = useSnackbar();

  // const { error, data, loading } = useQuery(GET_PROFILE, {
  //   variables: { id },
  //   fetchPolicy: 'network-only',
  // });

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
    showSnackbar("Profile Saved Successfully.", "success");
  };

  return (
    <CustomDialog 
      open={open} 
      maxWidth='sm'
      onClose={handleClose}
      onCancel={handleClose}
      onSave={handleUpdateProfile}
      title="Profile"
    >
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
      </DialogContent>
    </CustomDialog>
  );
}
