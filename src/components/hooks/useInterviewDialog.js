import useDialog from './useDialog';

export default function useInterviewListDialog(refetch) {
  const { dialogOpen, handleOpen, handleClose } = useDialog(refetch);

  return { 
    interviewListingDialogOpen: dialogOpen, 
    handleInterviewListDialogOpen: handleOpen,
    handleInterviewListDialogClose: handleClose,
  };
}
