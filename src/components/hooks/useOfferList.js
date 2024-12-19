import { useState } from 'react';

export default function useOfferListDialog(refetch) {
  const [offerListingDialogOpen, setOfferListDialogOpen] = useState(false);
  const handleOfferListDialogOpen = () => {
    setOfferListDialogOpen(true);
    if (refetch) {
      refetch();
    }
  }
  const handleOfferListDialogClose = () => {
    setOfferListDialogOpen(false);
    if (refetch) {
      refetch();
    }
  }

  return { 
    offerListingDialogOpen, 
    handleOfferListDialogOpen,
    handleOfferListDialogClose,
  };
}