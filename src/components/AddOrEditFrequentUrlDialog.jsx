import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Grid, TextField } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import { useSnackbar } from './common/SnackbarContext';
import { ADD_FREQUENT_URL, UPDATE_FREQUENT_URL } from '../graphql/mutation';
import { GET_FREQUENT_URLS } from '../graphql/query';
import CustomDialog from './common/CustomDialog';
import { useTranslation } from 'react-i18next';

export default function AddOrEditFrequentUrlDialog({
  handleClose,
  open,
  frequentUrl,
}) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [addFrequentUrl] = useMutation(ADD_FREQUENT_URL, {
    refetchQueries: [{ query: GET_FREQUENT_URLS }],
  });

  const [updateFrequentUrl] = useMutation(UPDATE_FREQUENT_URL);

  const validateFields = () => {
    const newErrors = {};
    if (!formData.title)
      newErrors.title = t('dialogs.addBookmark.errors.titleRequired');
    if (!formData.url)
      newErrors.url = t('dialogs.addBookmark.errors.urlRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async event => {
    event?.preventDefault();
    if (!validateFields()) return;
    const mutationFn = frequentUrl ? updateFrequentUrl : addFrequentUrl;
    const variables = {
      ...formData,
      ...(frequentUrl && { id: frequentUrl.id }),
    };
    setSaving(true);
    try {
      await mutationFn({ variables });
      showSnackbar(t('dialogs.addBookmark.saveSuccess'), 'success');
      handleClose();
    } catch (err) {
      showSnackbar(t('dialogs.addBookmark.saveError'), 'error');
    } finally {
      setSaving(false);
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
      saving={saving}
      title={t(
        frequentUrl
          ? 'dialogs.addBookmark.editTitle'
          : 'dialogs.addBookmark.addTitle'
      )}
    >
      <DialogContent dividers>
        <Grid
          container
          spacing={2}
          sx={{
            alignItems: 'center',
          }}
        >
          <Grid size={12}>
            <TextField
              id="title"
              name="title"
              label={t('dialogs.addBookmark.fields.title')}
              fullWidth
              variant="outlined"
              onChange={handleFormChange}
              value={formData.title}
              error={!!errors.title}
              helperText={
                errors.title && t('dialogs.addBookmark.errors.titleRequired')
              }
            />
          </Grid>
          <Grid size={12}>
            <TextField
              id="url"
              name="url"
              label={t('dialogs.addBookmark.fields.url')}
              fullWidth
              variant="outlined"
              onChange={handleFormChange}
              value={formData.url}
              error={!!errors.url}
              helperText={
                errors.url && t('dialogs.addBookmark.errors.urlRequired')
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
    </CustomDialog>
  );
}
