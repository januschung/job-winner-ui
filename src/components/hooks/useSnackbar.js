import { useState } from 'react';

export default function useSnackbar() {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const showSnackbar = (message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => setSnackbarOpen(false);

    return {
        snackbarOpen,
        snackbarMessage,
        snackbarSeverity,
        showSnackbar,
        handleSnackbarClose,
    };
}
