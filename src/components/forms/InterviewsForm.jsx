import { useEffect, useRef, useState } from 'react';
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
import { useQuery, useMutation } from '@apollo/client/react';
import ConfirmDialog from '../common/ConfirmDialog';
import useAsyncAction from '../../hooks/useAsyncAction';
import useConfirmedAction from '../../hooks/useConfirmedAction';
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
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { INTERVIEW_STATUSES, INTERVIEW_STATUS_TONE } from '../../config/status';
import { formatCalendarDate } from '../../utils/dateUtil';
import DialogFooter from '../common/DialogFooter';
import StatusBadge from '../common/StatusBadge';

export default function InterviewsForm({ jobApplicationId, handleClose }) {
  const [interviews, setInterviews] = useState([]);
  const { run } = useAsyncAction();
  const { t, i18n } = useTranslation();

  // Last values the server confirmed, per interview id, so leaving a field
  // without changing anything does not trigger a save.
  const savedRef = useRef({});
  const remember = list =>
    list.forEach(item => {
      savedRef.current[item.id] = item;
    });

  const { data, loading, error } = useQuery(
    GET_INTERVIEWS_BY_JOB_APPLICATION_ID,
    { variables: { jobApplicationId } }
  );

  // Copy the server list into editable local state whenever it (re)loads.
  useEffect(() => {
    const loaded = data?.allInterviewByJobApplicationId;
    if (!loaded) return;
    remember(loaded);
    setInterviews(loaded);
  }, [data]);

  // Every interview change refreshes this application's list and the global
  // upcoming-interviews list.
  const refetchQueries = [
    {
      query: GET_INTERVIEWS_BY_JOB_APPLICATION_ID,
      variables: { jobApplicationId },
    },
    { query: GET_ALL_INTERVIEWS },
  ];
  const [addInterview] = useMutation(ADD_INTERVIEW, { refetchQueries });
  const [updateInterview] = useMutation(UPDATE_INTERVIEW, { refetchQueries });
  const [deleteInterview] = useMutation(DELETE_INTERVIEW, { refetchQueries });

  const remove = useConfirmedAction({
    action: id => deleteInterview({ variables: { id } }),
    successMessage: t('interviews.messages.deleteSuccess'),
    errorMessage: t('interviews.messages.deleteError'),
    onSuccess: id =>
      setInterviews(prev => prev.filter(interview => interview.id !== id)),
  });

  const handleAddInterview = () =>
    run(
      () =>
        addInterview({
          variables: {
            interviewInput: {
              jobApplicationId,
              interviewDate: dayjs().format('YYYY-MM-DD'),
              interviewer: '',
              description: '',
              status: 'open',
            },
          },
        }),
      {
        successMessage: t('interviews.messages.addSuccess'),
        errorMessage: t('interviews.messages.addError'),
        onSuccess: ({ data }) => {
          if (!data?.addInterview) return;
          remember([data.addInterview]);
          setInterviews(prev => [...prev, data.addInterview]);
        },
      }
    );

  const handleEdit = (id, field, value) => {
    setInterviews(prev =>
      prev.map(interview =>
        interview.id === id ? { ...interview, [field]: value } : interview
      )
    );
  };

  // Saves one interview. `changes` carries values set in the same event,
  // which are not in `interviews` state yet.
  const handleSaveInline = (id, changes = {}) => {
    const current = interviews.find(item => item.id === id);
    if (!current) return;
    const interview = { ...current, ...changes };
    // Skip half-typed dates; the field saves again once it is valid.
    if (!dayjs(interview.interviewDate, 'YYYY-MM-DD').isValid()) return;
    const saved = savedRef.current[id];
    const fields = ['interviewDate', 'interviewer', 'description', 'status'];
    if (saved && fields.every(f => saved[f] === interview[f])) return;

    run(
      () =>
        updateInterview({
          variables: {
            id,
            interview: {
              id: interview.id,
              jobApplicationId,
              ...Object.fromEntries(fields.map(f => [f, interview[f]])),
            },
          },
        }),
      {
        successMessage: t('interviews.messages.saveSuccess'),
        errorMessage: t('interviews.messages.saveError'),
        onSuccess: () => remember([interview]),
      }
    );
  };

  if (loading)
    return (
      <DialogContent>
        <Typography color="text.secondary">{t('common.loading')}</Typography>
      </DialogContent>
    );
  if (error)
    return (
      <DialogContent>
        <Alert severity="error">{t('common.errorMessage')}</Alert>
      </DialogContent>
    );

  return (
    <>
      <DialogContent sx={{ pt: 2.5 }}>
        {interviews.map(interview => (
          <Box
            key={interview.id}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 3,
              p: 2,
              mb: 1.5,
              bgcolor: 'background.default',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1.25,
                mb: 1.75,
              }}
            >
              <Typography sx={{ fontWeight: 650 }}>
                {formatCalendarDate(
                  interview.interviewDate,
                  i18n.resolvedLanguage
                )?.absolute ?? interview.interviewDate}
              </Typography>
              {interview.interviewer && (
                <Typography variant="body2" color="text.secondary">
                  · {interview.interviewer}
                </Typography>
              )}
              <StatusBadge
                tone={INTERVIEW_STATUS_TONE[interview.status]}
                label={t(`interviews.statuses.${interview.status}`, {
                  defaultValue: interview.status,
                })}
              />
              <Tooltip title={t('common.delete')}>
                <IconButton
                  aria-label={t('common.delete')}
                  onClick={() => remove.request(interview.id)}
                  sx={{
                    ml: 'auto',
                    borderRadius: 2,
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'error.main',
                      bgcolor: theme =>
                        `rgba(${theme.vars.palette.error.mainChannel} / 0.1)`,
                    },
                  }}
                >
                  <DeleteOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 4 }}>
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
              <Grid size={{ xs: 12, sm: 4 }}>
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
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth>
                  <InputLabel id={`interview-${interview.id}-status-label`}>
                    {t('interviews.status')}
                  </InputLabel>
                  <Select
                    labelId={`interview-${interview.id}-status-label`}
                    label={t('interviews.status')}
                    value={interview.status}
                    onChange={e => {
                      handleEdit(interview.id, 'status', e.target.value);
                      handleSaveInline(interview.id, {
                        status: e.target.value,
                      });
                    }}
                  >
                    {INTERVIEW_STATUSES.map(status => (
                      <MenuItem key={status} value={status}>
                        {t(`interviews.statuses.${status}`)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={12}>
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
            </Grid>
          </Box>
        ))}

        <Button
          fullWidth
          variant="outlined"
          startIcon={<AddRoundedIcon />}
          onClick={handleAddInterview}
          disabled={loading}
          sx={{ height: 44, borderStyle: 'dashed', borderWidth: 1.5 }}
        >
          {t('interviews.add')}
        </Button>
      </DialogContent>
      <DialogFooter
        note={
          <>
            <CheckCircleOutlineRoundedIcon sx={{ fontSize: 16 }} />
            {t('interviews.autosave')}
          </>
        }
      >
        <Button color="inherit" onClick={handleClose}>
          {t('common.done')}
        </Button>
      </DialogFooter>

      <ConfirmDialog
        {...remove.dialogProps}
        title={t('dialogs.confirmInterviewDeletion.title')}
        content={t('dialogs.confirmInterviewDeletion.content')}
      />
    </>
  );
}
