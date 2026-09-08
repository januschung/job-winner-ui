import { useRef, useState } from 'react';

const REFETCH_THROTTLE_MS = 1000;

const useJobApplicationDialog = refetch => {
  const [open, setOpen] = useState(false);
  const [jobApplication, setJobApplication] = useState(null);
  const lastRefetchAt = useRef(0);

  const throttledRefetch = () => {
    const now = Date.now();
    if (refetch && now - lastRefetchAt.current > REFETCH_THROTTLE_MS) {
      lastRefetchAt.current = now;
      refetch();
    }
  };

  const handleOpen = jobApplication => {
    throttledRefetch();
    setJobApplication(jobApplication);
    setOpen(true);
  };

  const handleClose = () => {
    throttledRefetch();
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
