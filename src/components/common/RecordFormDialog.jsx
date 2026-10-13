import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client/react';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import useAsyncAction from '../../hooks/useAsyncAction';
import CustomDialog from './CustomDialog';

const blankForm = fields =>
  Object.fromEntries(fields.map(({ name }) => [name, '']));

// Add/edit dialog for simple records made of required text fields
// (bookmarks, Q&A). Adds when `record` is empty, updates otherwise.
//
// fields: [{ name, label, requiredMessage, multiline? }]
export default function RecordFormDialog({
  open,
  handleClose,
  record,
  fields,
  addMutation,
  updateMutation,
  refetchQueries,
  title,
  successMessage,
  errorMessage,
  saveLabel,
}) {
  const [formData, setFormData] = useState(() => blankForm(fields));
  const [errors, setErrors] = useState({});
  const { run, pending } = useAsyncAction();
  const [add] = useMutation(addMutation, { refetchQueries });
  const [update] = useMutation(updateMutation);

  // Editing loads the record; adding always starts blank.
  useEffect(() => {
    setFormData(
      record
        ? Object.fromEntries(
            fields.map(({ name }) => [name, record[name] || ''])
          )
        : blankForm(fields)
    );
    setErrors({});
    // Not `fields`: callers pass a new array every render, and resetting on
    // each one would wipe what the user is typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record, open]);

  const validate = () => {
    const newErrors = Object.fromEntries(
      fields
        .filter(({ name }) => !formData[name])
        .map(({ name, requiredMessage }) => [name, requiredMessage])
    );
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = event => {
    event?.preventDefault();
    if (!validate()) return;
    const mutate = record ? update : add;
    const variables = { ...formData, ...(record && { id: record.id }) };
    run(() => mutate({ variables }), {
      successMessage,
      errorMessage,
      onSuccess: handleClose,
    });
  };

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      onCancel={handleClose}
      onSave={handleSubmit}
      saving={pending}
      saveLabel={saveLabel}
      title={title}
    >
      <DialogContent>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          {fields.map(({ name, label, multiline }) => (
            <Grid key={name} size={12}>
              <TextField
                id={name}
                name={name}
                label={label}
                fullWidth
                variant="outlined"
                multiline={multiline}
                onChange={handleChange}
                value={formData[name]}
                error={!!errors[name]}
                helperText={errors[name]}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </CustomDialog>
  );
}
