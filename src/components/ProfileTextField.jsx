import React from 'react';
import { Grid, TextField } from '@mui/material';
import CopyButton from './CopyButton';

const ProfileTextField = ({ id, label, value, onChange }) => (
  <>
    <Grid item xs={11}>
      <TextField
        id={id}
        name={id}
        label={label}
        fullWidth
        variant="standard"
        value={value}
        onChange={onChange}
      />
    </Grid>
    <Grid item xs={1}>
      <CopyButton text={value} />
    </Grid>
  </>
);

export default ProfileTextField;