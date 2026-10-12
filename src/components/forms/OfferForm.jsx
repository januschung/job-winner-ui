import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import ConfirmDialog from '../common/ConfirmDialog';
import useAsyncAction from '../../hooks/useAsyncAction';
import useConfirmedAction from '../../hooks/useConfirmedAction';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ADD_OFFER, UPDATE_OFFER, DELETE_OFFER } from '../../graphql/mutation';
import { GET_OFFER, GET_ALL_OFFERS } from '../../graphql/query';
import dayjs from 'dayjs';
import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function OfferForm({ jobApplicationId, handleClose }) {
  const [offerData, setOfferData] = useState({
    salaryOffered: '',
    description: '',
    offerDate: dayjs().format('YYYY-MM-DD'),
  });
  const [errors, setErrors] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { run, pending: saving } = useAsyncAction();
  const { t } = useTranslation();

  const {
    data,
    loading: queryLoading,
    error,
  } = useQuery(GET_OFFER, {
    variables: { jobApplicationId },
    fetchPolicy: 'network-only',
  });

  // Every offer change refreshes this application's offer and the offer list.
  const refetchQueries = [
    { query: GET_OFFER, variables: { jobApplicationId } },
    { query: GET_ALL_OFFERS },
  ];
  const [addOffer] = useMutation(ADD_OFFER, { refetchQueries });
  const [updateOffer] = useMutation(UPDATE_OFFER, { refetchQueries });
  const [deleteOffer] = useMutation(DELETE_OFFER, { refetchQueries });

  useEffect(() => {
    if (data && data.offerByJobApplicationId) {
      const { salaryOffered, description, offerDate } =
        data.offerByJobApplicationId;
      setOfferData({
        salaryOffered: salaryOffered || '',
        description: description || '',
        offerDate: offerDate
          ? dayjs(offerDate).format('YYYY-MM-DD')
          : dayjs().format('YYYY-MM-DD'),
      });
      setIsFormVisible(true);
    } else {
      setIsFormVisible(false);
    }
  }, [data]);

  const validateFields = () => {
    const newErrors = {};
    if (!offerData.salaryOffered)
      newErrors.salaryOffered = t(
        'forms.offerForm.errors.salaryOfferedRequired'
      );
    if (!offerData.offerDate || !dayjs(offerData.offerDate).isValid()) {
      newErrors.offerDate = t('forms.offerForm.errors.offerDateRequired');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormChange = e => {
    const { name, value } = e.target;
    setOfferData(prev => ({
      ...prev,
      [name]: value,
    }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Clear error when user types
  };

  const savedOffer = data?.offerByJobApplicationId;

  const handleSave = () => {
    if (!validateFields()) return;
    const fields = {
      jobApplicationId,
      salaryOffered: offerData.salaryOffered,
      description: offerData.description,
      offerDate: offerData.offerDate,
    };
    run(
      () =>
        savedOffer
          ? updateOffer({ variables: { id: savedOffer.id, ...fields } })
          : addOffer({ variables: fields }),
      {
        successMessage: t(
          savedOffer
            ? 'forms.offerForm.messages.updateSuccess'
            : 'forms.offerForm.messages.addSuccess'
        ),
        errorMessage: t('forms.offerForm.messages.error'),
        onSuccess: handleClose,
      }
    );
  };

  const resetForm = () => {
    setOfferData({
      salaryOffered: '',
      description: '',
      offerDate: dayjs().format('YYYY-MM-DD'),
    });
    setErrors({});
    setIsFormVisible(false);
  };

  const remove = useConfirmedAction({
    action: id => deleteOffer({ variables: { id } }),
    successMessage: t('forms.offerForm.messages.deleteSuccess'),
    errorMessage: t('forms.offerForm.messages.deleteError'),
    onSuccess: resetForm,
  });

  // A saved offer needs confirming; an unsaved draft is just discarded.
  const handleDelete = () =>
    savedOffer ? remove.request(savedOffer.id) : resetForm();

  const isLoading = queryLoading || saving || remove.pending;

  // Until the saved offer has loaded, "Add Offer" would race the query: the
  // form opens, then the arriving result hides it again.
  if (queryLoading && !data) return <p>{t('common.loading')}</p>;

  // Without the saved offer we cannot tell "none yet" from "failed to load",
  // so do not offer to add one (it could create a duplicate).
  if (error) {
    return (
      <DialogContent>
        <Alert severity="error">{t('common.errorMessage')}</Alert>
      </DialogContent>
    );
  }

  return (
    <>
      <DialogContent>
        <Grid container spacing={2}>
          {!isFormVisible && (
            <Grid
              container
              sx={{
                justifyContent: 'center',
                marginTop: 3,
              }}
            >
              <Button
                variant="contained"
                onClick={() => setIsFormVisible(true)}
              >
                {t('forms.offerForm.buttons.addOffer')}
              </Button>
            </Grid>
          )}
          {isFormVisible && (
            <>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label={t('forms.offerForm.fields.offerDate')}
                    format="MM/DD/YYYY"
                    disablePast
                    value={
                      offerData.offerDate ? dayjs(offerData.offerDate) : null
                    }
                    onChange={date =>
                      setOfferData(prev => ({
                        ...prev,
                        offerDate: date ? dayjs(date).format('YYYY-MM-DD') : '',
                      }))
                    }
                    slotProps={{
                      textField: {
                        id: 'offerDate',
                        fullWidth: true,
                        error: !!errors.offerDate,
                        helperText: errors.offerDate,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  required
                  id="salaryOffered"
                  name="salaryOffered"
                  label={t('forms.offerForm.fields.salaryOffered')}
                  value={offerData.salaryOffered}
                  onChange={handleFormChange}
                  variant="outlined"
                  error={!!errors.salaryOffered}
                  helperText={errors.salaryOffered}
                  fullWidth
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 10,
                }}
              >
                <TextField
                  required
                  id="description"
                  name="description"
                  label={t('forms.offerForm.fields.description')}
                  value={offerData.description}
                  onChange={handleFormChange}
                  variant="outlined"
                  multiline
                  error={!!errors.description}
                  helperText={errors.description}
                  fullWidth
                />
              </Grid>
              <Grid
                container
                size={{
                  xs: 12,
                  sm: 2,
                }}
                sx={{
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
              >
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  {t('forms.offerForm.buttons.delete')}
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          startIcon={<CancelIcon />}
          onClick={handleClose}
          disabled={isLoading}
        >
          {t('common.cancel')}
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={isLoading || !isFormVisible}
        >
          {t('common.save')}
        </Button>
      </DialogActions>
      <ConfirmDialog
        {...remove.dialogProps}
        confirmText={t('forms.offerForm.buttons.confirmDelete')}
        confirmColor="error"
        title={t('forms.offerForm.dialogs.confirmDelete.title')}
        content={t('forms.offerForm.dialogs.confirmDelete.content')}
      />
    </>
  );
}
