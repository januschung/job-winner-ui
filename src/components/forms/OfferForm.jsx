import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import ConfirmDialog from '../common/ConfirmDialog';
import SnackbarComponent from '../common/SnackbarComponent';
import useSnackbar from '../hooks/useSnackbar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ADD_OFFER, UPDATE_OFFER, DELETE_OFFER } from '../../graphql/mutation';
import { GET_OFFER, GET_ALL_OFFERS } from '../../graphql/query';
import dayjs from 'dayjs';
import { Grid } from '@mui/material';

export default function OfferForm({ jobApplicationId, handleClose }) {
    const [offerData, setOfferData] = useState({
        salaryOffered: '',
        description: '',
        offerDate: dayjs().format('YYYY-MM-DD'),
    });
    const [errors, setErrors] = useState({});
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    const { snackbarOpen, snackbarMessage, snackbarSeverity, showSnackbar, handleSnackbarClose } = useSnackbar();

    const { data, loading: queryLoading, error } = useQuery(GET_OFFER, {
        variables: { jobApplicationId },
        fetchPolicy: 'network-only',
    });

    const [addOffer, { loading: addOfferLoading }] = useMutation(ADD_OFFER, {
        refetchQueries: [{ query: GET_OFFER, variables: { jobApplicationId } }],
    });

    const [updateOffer, { loading: updateOfferLoading }] = useMutation(UPDATE_OFFER, {
        refetchQueries: [{ query: GET_OFFER, variables: { jobApplicationId } }],
    });

    const [deleteOffer, { loading: deleteOfferLoading }] = useMutation(DELETE_OFFER, {
        refetchQueries: [
            { query: GET_OFFER, variables: { jobApplicationId } }, 
            { query: GET_ALL_OFFERS },
        ],
    });

    useEffect(() => {
        if (data && data.offerByJobApplicationId) {
            const { salaryOffered, description, offerDate } = data.offerByJobApplicationId;
            setOfferData({
                salaryOffered: salaryOffered || '',
                description: description || '',
                offerDate: offerDate ? dayjs(offerDate).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
            });
            setIsFormVisible(true);
        } else {
            setIsFormVisible(false);
        }
    }, [data]);

    const validateFields = () => {
        const newErrors = {};
        if (!offerData.salaryOffered) newErrors.salaryOffered = 'Salary is required.';
        if (!offerData.description) newErrors.description = 'Notes are required.';
        if (!offerData.offerDate || !dayjs(offerData.offerDate).isValid()) {
            newErrors.offerDate = 'Valid offer date is required.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleOfferChange = (e) => {
        const { name, value } = e.target;
        setOfferData({ ...offerData, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Clear error when user types
    };

    const handleSave = async () => {
        if (!validateFields()) return;

        try {
            if (data && data.offerByJobApplicationId) {
                await updateOffer({
                    variables: {
                        id: data.offerByJobApplicationId.id,
                        jobApplicationId,
                        salaryOffered: offerData.salaryOffered,
                        description: offerData.description,
                        offerDate: offerData.offerDate,
                    },
                });
                showSnackbar('Offer updated successfully!', 'success');
            } else {
                await addOffer({
                    variables: {
                        jobApplicationId,
                        salaryOffered: offerData.salaryOffered,
                        description: offerData.description,
                        offerDate: offerData.offerDate,
                    },
                    refetchQueries: [{ query: GET_ALL_OFFERS }],
                });
                showSnackbar('Offer added successfully!', 'success');
            }
            setTimeout(() => handleClose(), 500); 
        } catch (err) {
            showSnackbar('Error saving offer. Please try again.', 'error');
        }
    };

    const handleDelete = () => {
        if (data && data.offerByJobApplicationId) {
            // If an existing offer is saved, show the confirmation dialog
            setConfirmDeleteOpen(true);
        } else {
            // If no saved offer exists, reset the form and hide it
            resetForm();
        }
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

    const confirmDeleteOffer = async () => {
        try {
            if (data && data.offerByJobApplicationId) {
                const { id } = data.offerByJobApplicationId;
                await deleteOffer({ variables: { id } });
                resetForm();
                showSnackbar('Offer deleted successfully!', 'success');
            }
        } catch (err) {
            console.error('Error deleting offer:', err.message);
            showSnackbar('Error deleting offer. Please try again.', 'error');
        } finally {
            setConfirmDeleteOpen(false);
        }
    };

    const cancelDeleteOffer = () => {
        setConfirmDeleteOpen(false);
    };

    const isLoading = queryLoading || addOfferLoading || updateOfferLoading || deleteOfferLoading;

    return (
        <>
            <DialogContent>
                <Grid container spacing={2}>
                    {!isFormVisible && (
                        <Grid container justifyContent="center" sx={{ marginTop: 3 }}>
                            <Button variant="contained" onClick={() => setIsFormVisible(true)}>
                                Add Offer
                            </Button>
                        </Grid>
                    )}
                    {isFormVisible && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker
                                        id="offerDate"
                                        label="Offer Date"
                                        inputFormat="MM/DD/YYYY"
                                        disablePast
                                        value={offerData.offerDate}
                                        onChange={(date) =>
                                            setOfferData({ ...offerData, offerDate: date ? dayjs(date).format('YYYY-MM-DD') : '' })
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                sx={{ width: '100%' }}
                                                {...params}
                                                error={!!errors.offerDate}
                                                helperText={errors.offerDate}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    id="salaryOffered"
                                    name="salaryOffered"
                                    label="Salary Offered"
                                    value={offerData.salaryOffered}
                                    onChange={handleOfferChange}
                                    variant="outlined"
                                    error={!!errors.salaryOffered}
                                    helperText={errors.salaryOffered}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={10}>
                                <TextField
                                    required
                                    id="description"
                                    name="description"
                                    label="Notes"
                                    value={offerData.description}
                                    onChange={handleOfferChange}
                                    variant="outlined"
                                    multiline
                                    error={!!errors.description}
                                    helperText={errors.description}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={2} container justifyContent="flex-end" alignItems="center">
                                <Button
                                    variant="outlined"
                                    color="warning"
                                    onClick={handleDelete}
                                    disabled={isLoading}
                                >
                                    Delete
                                </Button>
                            </Grid>
                        </>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    color="info"
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleClose}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    color="info"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={isLoading || !isFormVisible}
                >
                    Save
                </Button>
            </DialogActions>
            <ConfirmDialog
                open={confirmDeleteOpen}
                onCancel={cancelDeleteOffer}
                onConfirm={confirmDeleteOffer}
                confirmText="Delete"
                confirmColor="error"
                title="Confirm Deletion"
                content="Are you sure you want to delete this offer? This action cannot be undone."
            />
            <SnackbarComponent
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={handleSnackbarClose}
            />
        </>
    );
}
