import useDialog from '../../hooks/useDialog';
import CustomDialog from './CustomDialog';

// A dialog listing a collection (bookmarks, Q&A) with an "Add" action that
// opens `FormDialog` for a new item. `children` renders the list itself.
export default function CollectionDialog({
  open,
  handleClose,
  title,
  FormDialog,
  children,
}) {
  const add = useDialog();

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      onCancel={handleClose}
      title={title}
      onAdd={add.handleOpen}
    >
      <FormDialog open={add.dialogOpen} handleClose={add.handleClose} />
      {children}
    </CustomDialog>
  );
}
