import { useEffect, useState } from 'react';
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
import { JOB_STATUSES } from '../../config/status';
import useAsyncAction from '../../hooks/useAsyncAction';
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
  const { run, pending: saving } = useAsyncAction();
  const { t } = useTranslation();

  const [newJobApplication] = useMutation(ADD_JOB_APPLICATION, {
    refetchQueries: [{ query: GET_JOB_APPLICATIONS }],
  });
  const [updateJobApplication] = useMutation(UPDATE_JOB_APPLICATION, {
    refetchQueries: [{ query: GET_JOB_APPLICATIONS }],
  });

  useEffect(() => {
    if (isNew) {
      setFormData(prev => ({
        ...prev,
        appliedDate: dayjs().format('YYYY-MM-DD'),
      }));
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
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = event => {
    event?.preventDefault();
    if (!validateFields()) return;
    const mutationFn = isNew ? newJobApplication : updateJobApplication;
    const variables = {
      ...formData,
      ...(jobApplication && { id: jobApplication.id }),
    };
    // On failure the dialog stays open so nothing typed is lost.
    run(() => mutationFn({ variables }), {
      successMessage: t('forms.applicationForm.success'),
      errorMessage: t('forms.applicationForm.error'),
      onSuccess: handleClose,
    });
  };

  return (
    <>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
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
          <Grid
            size={{
              xs: 12,
              sm: 6,
            }}
          >
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
          <Grid
            size={{
              xs: 12,
              sm: 4,
            }}
          >
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
          <Grid
            size={{
              xs: 12,
              sm: 4,
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label={t('forms.applicationForm.fields.appliedDate')}
                format="MM/DD/YYYY"
                disablePast
                value={
                  formData.appliedDate ? dayjs(formData.appliedDate) : null
                }
                onChange={date =>
                  setFormData(prev => ({
                    ...prev,
                    appliedDate: dayjs(date).format('YYYY-MM-DD'),
                  }))
                }
                slotProps={{
                  textField: {
                    id: 'appliedDate',
                    fullWidth: true,
                    error: !!errors.appliedDate,
                    helperText: errors.appliedDate,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          {!isNew && (
            <Grid
              size={{
                xs: 12,
                sm: 4,
              }}
            >
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
                  {JOB_STATUSES.map(status => (
                    <MenuItem key={status} value={status}>
                      {t(`forms.applicationForm.status.${status}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          <Grid size={12}>
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
          <Grid size={12}>
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
          <Grid size={12}>
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
          variant="outlined"
          startIcon={<CancelIcon />}
          onClick={handleClose}
        >
          {t('common.cancel')}
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={saving}
        >
          {t('common.save')}
        </Button>
      </DialogActions>
    </>
  );
}
