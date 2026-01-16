import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import DialogContent from '@mui/material/DialogContent';
import { Grid } from '@mui/material';
import { UPDATE_PROFILE } from '../graphql/mutation';
import { GET_PROFILE } from '../graphql/query';
import { useSnackbar } from './common/SnackbarContext';
import ProfileTextField from './ProfileTextField';
import CustomDialog from './common/CustomDialog';
import { useTranslation } from 'react-i18next';

export default function ProfileDialog({ profile, handleClose, open }) {
  const id = 1;
  const { t } = useTranslation();

  const fields = [
    { id: 'firstName', label: t('dialogs.profile.fields.firstName') },
    { id: 'lastName', label: t('dialogs.profile.fields.lastName') },
    { id: 'addressStreet1', label: t('dialogs.profile.fields.addressStreet1') },
    { id: 'addressStreet2', label: t('dialogs.profile.fields.addressStreet2') },
    { id: 'addressCity', label: t('dialogs.profile.fields.addressCity') },
    { id: 'addressState', label: t('dialogs.profile.fields.addressState') },
    { id: 'addressZip', label: t('dialogs.profile.fields.addressZip') },
    { id: 'email', label: t('dialogs.profile.fields.email') },
    { id: 'telephone', label: t('dialogs.profile.fields.telephone') },
    { id: 'linkedin', label: t('dialogs.profile.fields.linkedin') },
    { id: 'github', label: t('dialogs.profile.fields.github') },
    {
      id: 'personalWebsite',
      label: t('dialogs.profile.fields.personalWebsite'),
    },
  ];

  const initialFormData = () =>
    fields.reduce((acc, field) => {
      acc[field.id] = '';
      return acc;
    }, {});

  const [formData, setFormData] = useState(initialFormData);

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (profile) {
      setFormData({
        ...profile,
      });
    }
  }, [profile, open]);

  const [updateProfile] = useMutation(UPDATE_PROFILE, {
    refetchQueries: [{ query: GET_PROFILE, variables: { id } }],
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateProfile = event => {
    event.preventDefault();
    updateProfile({
      variables: {
        id: 1,
        ...formData,
      },
    });
    showSnackbar(t('dialogs.profile.success'), 'success');
  };

  return (
    <CustomDialog
      open={open}
      maxWidth="sm"
      onClose={handleClose}
      onCancel={handleClose}
      onSave={handleUpdateProfile}
      title={t('dialogs.profile.title')}
    >
      <DialogContent dividers>
        <Grid container spacing={2} alignItems="center">
          {fields.map(field => (
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
