import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  DialogActions,
  DialogContent,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useSnackbar } from '../common/SnackbarContext';
import {
  ADD_JOB_APPLICATION,
  UPDATE_JOB_APPLICATION,
} from '../../graphql/mutation';
import { GET_JOB_APPLICATIONS } from '../../graphql/query';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

export default function ApplicationForm({
  jobApplication,
  isNew,
  handleClose,
}) {
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    salaryRange: '',
    description: '',
    note: '',
    jobUrl: '',
    status: 'open',
    appliedDate: dayjs().format('YYYY-MM-DD'),
  });
  const [errors, setErrors] = useState({});
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [newJobApplication] = useMutation(ADD_JOB_APPLICATION, {
    refetchQueries: [{ query: GET_JOB_APPLICATIONS }],
  });
  const [updateJobApplication] = useMutation(UPDATE_JOB_APPLICATION, {
    refetchQueries: [{ query: GET_JOB_APPLICATIONS }],
  });

  useEffect(() => {
    if (isNew) {
      setFormData({
        ...formData,
        appliedDate: dayjs().format('YYYY-MM-DD'),
      });
    } else if (jobApplication) {
      setFormData({
        companyName: jobApplication.companyName || '',
        jobTitle: jobApplication.jobTitle || '',
        salaryRange: jobApplication.salaryRange || '',
        description: jobApplication.description || '',
        note: jobApplication.note || '',
        jobUrl: jobApplication.jobUrl || '',
        status: jobApplication.status || 'open',
        appliedDate: jobApplication.appliedDate || dayjs().format('YYYY-MM-DD'),
      });
    }
  }, [jobApplication, isNew]);

  const validateFields = () => {
    const newErrors = {};
    if (!formData.companyName)
      newErrors.companyName = t(
        'forms.applicationForm.errors.companyNameRequired'
      );
    if (!formData.jobTitle)
      newErrors.jobTitle = t('forms.applicationForm.errors.jobTitleRequired');
    if (!formData.salaryRange)
      newErrors.salaryRange = t(
        'forms.applicationForm.errors.salaryRangeRequired'
      );
    if (!formData.appliedDate || !dayjs(formData.appliedDate).isValid()) {
      newErrors.appliedDate = t(
        'forms.applicationForm.errors.appliedDateRequired'
      );
    }
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

  const handleSubmit = event => {
    if (!validateFields()) return;
    try {
      event.preventDefault();
      const mutationFn = isNew ? newJobApplication : updateJobApplication;
      const variables = {
        ...formData,
        ...(jobApplication && { id: jobApplication.id }),
      };
      mutationFn({ variables });
      showSnackbar(t('forms.applicationForm.success'), 'success');
      setTimeout(() => handleClose(), 500);
    } catch (err) {
      showSnackbar(t('forms.applicationForm.error'), 'error');
    }
  };

  return (
    <>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="companyName"
              name="companyName"
              label={t('forms.applicationForm.fields.companyName')}
              fullWidth
              variant="outlined"
              onChange={handleFormChange}
              value={formData.companyName}
              error={!!errors.companyName}
              helperText={errors.companyName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="jobTitle"
              name="jobTitle"
              label={t('forms.applicationForm.fields.jobTitle')}
              fullWidth
              variant="outlined"
              onChange={handleFormChange}
              value={formData.jobTitle}
              error={!!errors.jobTitle}
              helperText={errors.jobTitle}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              id="salaryRange"
              name="salaryRange"
              label={t('forms.applicationForm.fields.salaryRange')}
              fullWidth
              variant="outlined"
              onChange={handleFormChange}
              value={formData.salaryRange}
              error={!!errors.salaryRange}
              helperText={errors.salaryRange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                id="appliedDate"
                label={t('forms.applicationForm.fields.appliedDate')}
                inputFormat="MM/DD/YYYY"
                disablePast
                value={formData.appliedDate}
                onChange={date =>
                  setFormData({
                    ...formData,
                    appliedDate: dayjs(date).format('YYYY-MM-DD'),
                  })
                }
                renderInput={params => (
                  <TextField
                    {...params}
                    fullWidth
                    error={!!errors.appliedDate}
                    helperText={errors.appliedDate}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          {!isNew && (
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>
                  {t('forms.applicationForm.fields.status')}
                </InputLabel>
                <Select
                  name="status"
                  label={t('forms.applicationForm.fields.status')}
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <MenuItem value="open">
                    {t('forms.applicationForm.status.open')}
                  </MenuItem>
                  <MenuItem value="active">
                    {t('forms.applicationForm.status.active')}
                  </MenuItem>
                  <MenuItem value="ghosted">
                    {t('forms.applicationForm.status.ghosted')}
                  </MenuItem>
                  <MenuItem value="rejected">
                    {t('forms.applicationForm.status.rejected')}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              id="description"
              name="description"
              label={t('forms.applicationForm.fields.description')}
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              onChange={handleFormChange}
              value={formData.description}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="jobUrl"
              name="jobUrl"
              label={t('forms.applicationForm.fields.jobUrl')}
              multiline
              rows={2}
              fullWidth
              variant="outlined"
              onChange={handleFormChange}
              value={formData.jobUrl}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="note"
              name="note"
              label={t('forms.applicationForm.fields.note')}
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              onChange={handleFormChange}
              value={formData.note}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          color="info"
          variant="outlined"
          startIcon={<CancelIcon />}
          onClick={handleClose}
        >
          {t('common.cancel')}
        </Button>
        <Button
          color="info"
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
        >
          {t('common.save')}
        </Button>
      </DialogActions>
    </>
  );
}
