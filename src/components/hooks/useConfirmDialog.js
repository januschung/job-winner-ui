import { useState } from 'react';

export default function useConfirmDialog() {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const openConfirmDialog = () => setConfirmOpen(true);
    const confirm = () => setConfirmOpen(false);
    const cancel = () => setConfirmOpen(false);

    return { confirmOpen, openConfirmDialog, confirm, cancel };
}
