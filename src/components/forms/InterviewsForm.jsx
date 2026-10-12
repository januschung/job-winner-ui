import React, { useRef, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useQuery, useMutation } from '@apollo/client';
import ConfirmDialog from '../common/ConfirmDialog';
import { useSnackbar } from '../common/SnackbarContext';
import {
  ADD_INTERVIEW,
  UPDATE_INTERVIEW,
  DELETE_INTERVIEW,
} from '../../graphql/mutation';
import {
  GET_INTERVIEWS_BY_JOB_APPLICATION_ID,
  GET_ALL_INTERVIEWS,
} from '../../graphql/query';
import dayjs from 'dayjs';
import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function InterviewsForm({ jobApplicationId }) {
  const [interviews, setInterviews] = useState([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [interviewToDelete, setInterviewToDelete] = useState(null);
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslation();

  // Last values the server confirmed, per interview id, so leaving a field
  // without changing anything does not trigger a save.
  const savedRef = useRef({});
  const remember = list =>
    list.forEach(item => {
      savedRef.current[item.id] = item;
    });

  const { loading, error } = useQuery(GET_INTERVIEWS_BY_JOB_APPLICATION_ID, {
    variables: { jobApplicationId },
    onCompleted: data => {
      remember(data.allInterviewByJobApplicationId);
      setInterviews(data.allInterviewByJobApplicationId);
    },
  });

  const [addInterview] = useMutation(ADD_INTERVIEW, {
    refetchQueries: [
      {
        query: GET_INTERVIEWS_BY_JOB_APPLICATION_ID,
        variables: { jobApplicationId },
      },
      { query: GET_ALL_INTERVIEWS },
    ],
  });

  const [updateInterview] = useMutation(UPDATE_INTERVIEW, {
    refetchQueries: [
      {
        query: GET_INTERVIEWS_BY_JOB_APPLICATION_ID,
        variables: { jobApplicationId },
      },
      { query: GET_ALL_INTERVIEWS },
    ],
  });

  const [deleteInterview] = useMutation(DELETE_INTERVIEW, {
    refetchQueries: [
      {
        query: GET_INTERVIEWS_BY_JOB_APPLICATION_ID,
        variables: { jobApplicationId },
      },
      { query: GET_ALL_INTERVIEWS },
    ],
  });

  const handleAddInterview = async () => {
    try {
      const { data } = await addInterview({
        variables: {
          interviewInput: {
            jobApplicationId,
            interviewDate: dayjs().format('YYYY-MM-DD'),
            interviewer: '',
            description: '',
            status: 'open',
          },
        },
      });
      if (data?.addInterview?.id) {
        remember([data.addInterview]);
        setInterviews([...interviews, data.addInterview]);
        showSnackbar(t('interviews.messages.addSuccess'), 'success');
      } else {
        console.warn(t('interviews.messages.addError'));
      }
    } catch (err) {
      console.error(t('interviews.messages.addError'), err.message);
      showSnackbar(t('interviews.messages.addError'), 'error');
    }
  };

  const handleEdit = (id, field, value) => {
    setInterviews(prev =>
      prev.map(interview =>
        interview.id === id ? { ...interview, [field]: value } : interview
      )
    );
  };

  // Saves one interview. `changes` carries values set in the same event,
  // which are not in `interviews` state yet.
  const handleSaveInline = async (id, changes = {}) => {
    try {
      const current = interviews.find(item => item.id === id);
      if (!current) return;
      const interview = { ...current, ...changes };
      // Skip half-typed dates; the field saves again once it is valid.
      if (!dayjs(interview.interviewDate, 'YYYY-MM-DD').isValid()) return;
      const saved = savedRef.current[id];
      const fields = ['interviewDate', 'interviewer', 'description', 'status'];
      if (saved && fields.every(f => saved[f] === interview[f])) return;

      await updateInterview({
        variables: {
          id,
          interview: {
            id: interview.id,
            jobApplicationId,
            interviewDate: interview.interviewDate,
            interviewer: interview.interviewer,
            description: interview.description,
            status: interview.status,
          },
        },
      });

      remember([interview]);
      showSnackbar(t('interviews.messages.saveSuccess'), 'success');
    } catch (err) {
      console.error(t('interviews.messages.saveError'), err.message);
      showSnackbar(t('interviews.messages.saveError'), 'error');
    }
  };

  const handleDelete = id => {
    setInterviewToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDeleteInterview = async () => {
    try {
      await deleteInterview({ variables: { id: interviewToDelete } });
      setInterviews(prev =>
        prev.filter(interview => interview.id !== interviewToDelete)
      );
      showSnackbar(t('interviews.messages.deleteSuccess'), 'success');
    } catch (err) {
      console.error(t('interviews.messages.deleteError'), err.message);
      showSnackbar(t('interviews.messages.deleteError'), 'error');
    } finally {
      setInterviewToDelete(null);
      setConfirmDeleteOpen(false);
    }
  };

  const cancelDeleteInterview = () => {
    setConfirmDeleteOpen(false);
    setInterviewToDelete(null);
  };

  if (loading) return <p>{t('common.loading')}</p>;
  if (error)
    return (
      <p>
        {t('common.error')}: {error.message}
      </p>
    );

  return (
    <>
      <DialogContent>
        <Grid container spacing={2}>
          {interviews.map((interview, index) => (
            <Grid
              key={interview.id}
              sx={{ marginBottom: index < interviews.length - 1 ? 2 : 0 }}
              size={12}
            >
              <Grid
                container
                spacing={2}
                sx={{
                  alignItems: 'center',
                  border: 1,
                  borderColor: 'divider',
                  padding: 2,
                  borderRadius: 2,
                }}
              >
                <Grid
                  size={{
                    xs: 12,
                    sm: 4,
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      label={t('interviews.date')}
                      format="MM/DD/YYYY"
                      value={
                        interview.interviewDate
                          ? dayjs(interview.interviewDate)
                          : null
                      }
                      onChange={date =>
                        handleEdit(
                          interview.id,
                          'interviewDate',
                          dayjs(date).format('YYYY-MM-DD')
                        )
                      }
                      // Picking from the calendar saves right away; typing
                      // saves when the field loses focus.
                      onAccept={(date, context) => {
                        // Only calendar picks save here. Typing also fires
                        // onAccept per valid keystroke (source 'unknown');
                        // typed dates save once, on blur.
                        if (context?.source !== 'view') return;
                        handleSaveInline(interview.id, {
                          interviewDate: dayjs(date).format('YYYY-MM-DD'),
                        });
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          onBlur: () => handleSaveInline(interview.id),
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 4,
                  }}
                >
                  <TextField
                    label={t('interviews.interviewer')}
                    value={interview.interviewer}
                    onChange={e =>
                      handleEdit(interview.id, 'interviewer', e.target.value)
                    }
                    onBlur={() => handleSaveInline(interview.id)}
                    fullWidth
                  />
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 4,
                  }}
                >
                  <FormControl fullWidth>
                    <InputLabel>{t('interviews.status')}</InputLabel>
                    <Select
                      label={t('interviews.status')}
                      value={interview.status}
                      onChange={e => {
                        handleEdit(interview.id, 'status', e.target.value);
                        handleSaveInline(interview.id, {
                          status: e.target.value,
                        });
                      }}
                    >
                      <MenuItem value="open">
                        {t('interviews.statuses.open')}
                      </MenuItem>
                      <MenuItem value="canceled">
                        {t('interviews.statuses.canceled')}
                      </MenuItem>
                      <MenuItem value="pending">
                        {t('interviews.statuses.pending')}
                      </MenuItem>
                      <MenuItem value="rejected">
                        {t('interviews.statuses.rejected')}
                      </MenuItem>
                      <MenuItem value="expired">
                        {t('interviews.statuses.expired')}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 8,
                  }}
                >
                  <TextField
                    label={t('interviews.description')}
                    value={interview.description}
                    onChange={e =>
                      handleEdit(interview.id, 'description', e.target.value)
                    }
                    multiline
                    onBlur={() => handleSaveInline(interview.id)}
                    fullWidth
                  />
                </Grid>
                <Grid
                  container
                  size={{
                    xs: 12,
                    sm: 4,
                  }}
                  sx={{
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={() => handleDelete(interview.id)}
                  >
                    {t('common.delete')}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>

        <Grid
          container
          sx={{
            justifyContent: 'center',
            marginTop: 3,
          }}
        >
          <Button
            variant="contained"
            onClick={handleAddInterview}
            disabled={loading}
          >
            {t('interviews.add')}
          </Button>
        </Grid>
      </DialogContent>

      <ConfirmDialog
        open={confirmDeleteOpen}
        onCancel={cancelDeleteInterview}
        onConfirm={confirmDeleteInterview}
        title={t('dialogs.confirmInterviewDeletion.title')}
        content={t('dialogs.confirmInterviewDeletion.content')}
      />
    </>
  );
}
