import { Grid, TextField } from '@mui/material';
import CopyButton from './CopyButton';

const ProfileTextField = ({ id, label, value, onChange }) => (
  <>
    <Grid size={11}>
      <TextField
        id={id}
        name={id}
        label={label}
        fullWidth
        variant="outlined"
        value={value}
        onChange={onChange}
      />
    </Grid>
    <Grid size={1}>
      <CopyButton text={value} />
    </Grid>
  </>
);

export default ProfileTextField;
