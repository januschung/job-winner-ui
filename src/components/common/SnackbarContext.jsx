import React, { createContext, useState, useContext } from 'react';
import SnackbarComponent from './SnackbarComponent';

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'info', // Options: 'success', 'error', 'warning', 'info'
  });

  const showSnackbar = (message, severity = 'info') => {
    setSnackbarState({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbarState({ ...snackbarState, open: false });
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <SnackbarComponent
        open={snackbarState.open}
        message={snackbarState.message}
        severity={snackbarState.severity}
        onClose={handleCloseSnackbar}
      />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);
