import useDialog from './useDialog';

export default function useOfferListDialog(refetch) {
  const { dialogOpen, handleOpen, handleClose } = useDialog(refetch);

  return { 
    offerListingDialogOpen: dialogOpen, 
    handleOfferListDialogOpen: handleOpen,
    handleOfferListDialogClose: handleClose,
  };
}
