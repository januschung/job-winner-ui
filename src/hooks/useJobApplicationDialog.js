import { useState } from 'react';

const useJobApplicationDialog = (refetch) => {
  const [open, setOpen] = useState(false);
  const [jobApplication, setJobApplication] = useState(null);

  const handleOpen = (jobApplication) => {
    if (refetch) {
      refetch();
    }
    setJobApplication(jobApplication);
    setOpen(true);
  };

  const handleClose = () => {
    if (refetch) {
      refetch();
    }
    setOpen(false);
    setJobApplication(null);
  };

  return {
    open,
    jobApplication,
    handleOpen,
    handleClose,
  };
};

export default useJobApplicationDialog;
