import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
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
import dayjs from 'dayjs';

export default function InterviewsForm({handleClose}) {
    const [interviews, setInterviews] = useState([]);
    const handleAddInterview = () => {
        setInterviews([...interviews, { id: Date.now(), date: '', type: '', notes: '' }]);
    };

    const handleEdit = (id, field, value) => {
        const updatedInterviews = interviews.map((interview) =>
            interview.id === id ? { ...interview, [field]: value } : interview
        );
        setInterviews(updatedInterviews);
    };

    const handleDelete = (id) => {
        const updatedInterviews = interviews.filter((interview) => interview.id !== id);
        setInterviews(updatedInterviews);
    };

    return (
        <>
            <DialogContent>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Notes</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {interviews.map((interview) => (
                        <TableRow key={interview.id}>
                            <TableCell>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker
                                        inputFormat="MM/DD/YYYY"
                                        value={interview.date}
                                        onChange={(date) =>
                                            handleEdit(interview.id, 'date', dayjs(date).format('YYYY-MM-DD'))
                                        }
                                        renderInput={(params) => (
                                            <TextField {...params} />
                                        )}
                                    />
                                </LocalizationProvider>
                            </TableCell>
                            <TableCell>
                                <TextField
                                    value={interview.type}
                                    onChange={(e) => handleEdit(interview.id, 'type', e.target.value)}
                                    variant="outlined"
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    value={interview.notes}
                                    onChange={(e) => handleEdit(interview.id, 'notes', e.target.value)}
                                    variant="outlined"
                                    multiline
                                    rows={2}
                                />
                            </TableCell>
                            <TableCell>
                                <IconButton color="error" onClick={() => handleDelete(interview.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button onClick={handleAddInterview} variant="contained" sx={{ marginTop: 2 }}>
                Add Interview
            </Button>
            </DialogContent>
            <DialogActions>
                <Button
                    color="info"
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleClose}
                >
                    Cancel
                </Button>
                <Button
                    color="info"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    type="submit"
                >
                    Save
                </Button>
            </DialogActions>
        </>
    );
}
