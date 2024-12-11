import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ADD_OFFER, UPDATE_OFFER, DELETE_OFFER } from '../../graphql/mutation';
import { GET_OFFER } from '../../graphql/query';
import dayjs from 'dayjs';

export default function OfferForm({ jobApplicationId, handleClose }) {
    const [offerData, setOfferData] = useState({
        salaryOffered: '',
        description: '',
        offerDate: dayjs().format('YYYY-MM-DD'),
    });
    const [errors, setErrors] = useState({});
    const [isFormVisible, setIsFormVisible] = useState(false);

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

    const [deleteOffer] = useMutation(DELETE_OFFER, {
        refetchQueries: [{ query: GET_OFFER, variables: { jobApplicationId } }],
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
            } else {
                await addOffer({
                    variables: {
                        jobApplicationId,
                        salaryOffered: offerData.salaryOffered,
                        description: offerData.description,
                        offerDate: offerData.offerDate,
                    },
                });
            }
            handleClose();
        } catch (err) {
            console.error('Error saving offer:', err);
        }
    };

    const handleDelete = async () => {
        try {
            if (data && data.offerByJobApplicationId) {
                const { id } = data.offerByJobApplicationId;
                await deleteOffer({
                    variables: { id },
                });
                setOfferData({
                    salaryOffered: '',
                    description: '',
                    offerDate: dayjs().format('YYYY-MM-DD'),
                });
                setIsFormVisible(false);
            } else {
                console.warn('No offer to delete.');
            }
        } catch (err) {
            console.error('Error deleting offer:', err);
        }
    };

    const handleAddOfferClick = () => {
        setIsFormVisible(true);
    };

    const isLoading = queryLoading || addOfferLoading || updateOfferLoading;

    return (
        <>
            <DialogContent>
                <Table>
                    <TableBody>
                        {!isFormVisible && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleAddOfferClick}
                                    >
                                        Add Offer
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                        {isFormVisible && (
                            <TableRow>
                                <TableCell>
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
                                                {...params}
                                                error={!!errors.offerDate}
                                                helperText={errors.offerDate}
                                            />
                                        )}
                                    />
                                    </LocalizationProvider>
                                </TableCell>
                                <TableCell>
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
                                    />
                                </TableCell>
                                <TableCell>
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
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton color="error" onClick={handleDelete}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
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
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : 'Save'}
                </Button>
            </DialogActions>
        </>
    );
}
