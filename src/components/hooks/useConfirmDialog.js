import useDialog from './useDialog';

export default function useConfirmDialog() {
    const { dialogOpen, handleOpen, handleClose } = useDialog();

    return { 
        confirmDialogOpen: dialogOpen, 
        handleConfirmDialogOpen: handleOpen,
        handleConfirmDialogClose: handleClose,
    };
}
