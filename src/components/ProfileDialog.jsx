import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client/react';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { UPDATE_PROFILE } from '../graphql/mutation';
import { GET_PROFILE } from '../graphql/query';
import useAsyncAction from '../hooks/useAsyncAction';
import ProfileTextField from './ProfileTextField';
import CustomDialog from './common/CustomDialog';
import { useTranslation } from 'react-i18next';

// Profile form layout. Each section lists [field, grid width on sm+].
const sections = [
  {
    key: 'name',
    fields: [
      ['firstName', 6],
      ['lastName', 6],
    ],
  },
  {
    key: 'contact',
    fields: [
      ['email', 6],
      ['telephone', 6],
    ],
  },
  {
    key: 'address',
    fields: [
      ['addressStreet1', 12],
      ['addressStreet2', 12],
      ['addressCity', 6],
      ['addressState', 3],
      ['addressZip', 3],
    ],
  },
  {
    key: 'links',
    fields: [
      ['linkedin', 6],
      ['github', 6],
      ['personalWebsite', 12],
    ],
  },
];

export default function ProfileDialog({ profile, handleClose, open }) {
  const id = 1;
  const { t } = useTranslation();

  const initialFormData = () =>
    Object.fromEntries(
      sections.flatMap(section => section.fields.map(([id]) => [id, '']))
    );

  const [formData, setFormData] = useState(initialFormData);
  const { run, pending: saving } = useAsyncAction();

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
    event?.preventDefault();
    run(() => updateProfile({ variables: { id: 1, ...formData } }), {
      successMessage: t('dialogs.profile.success'),
      errorMessage: t('dialogs.profile.error'),
    });
  };

  return (
    <CustomDialog
      open={open}
      maxWidth="sm"
      onClose={handleClose}
      onCancel={handleClose}
      onSave={handleUpdateProfile}
      saveLabel={t('dialogs.profile.saveButton')}
      subtitle={t('dialogs.profile.subtitle')}
      saving={saving}
      title={t('dialogs.profile.title')}
    >
      <DialogContent>
        {sections.map(section => (
          <Box key={section.key} sx={{ '& + &': { mt: 3 } }}>
            <Typography
              component="h3"
              sx={{
                mb: 1.5,
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'text.secondary',
              }}
            >
              {t(`dialogs.profile.sections.${section.key}`)}
            </Typography>
            <Grid container spacing={2}>
              {section.fields.map(([fieldId, width]) => (
                <Grid key={fieldId} size={{ xs: 12, sm: width }}>
                  <ProfileTextField
                    id={fieldId}
                    label={t(`dialogs.profile.fields.${fieldId}`)}
                    value={formData[fieldId] ?? ''}
                    onChange={handleChange}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </DialogContent>
    </CustomDialog>
  );
}
