import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { Typography, Grid } from '@mui/material';
import { UPDATE_PROFILE } from '../graphql/mutation';
import { GET_PROFILE } from '../graphql/query';
import CopyButton from './CopyButton';


export default function ProfileDialog({ profile, handleClose, open, setOpen }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [addressStreet1, setAddressStreet1] = useState('');
  const [addressStreet2, setAddressStreet2] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [addressZip, setAddressZip] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [personalWebsite, setPersonalWebsite] = useState('');

  const id = 1;

  const { error, data, loading } = useQuery(GET_PROFILE, {
    variables: { id },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setAddressStreet1(profile.addressStreet1);
    setAddressStreet2(profile.addressStreet2);
    setAddressCity(profile.addressCity);
    setAddressState(profile.addressState);
    setAddressZip(profile.addressZip);
    setLinkedin(profile.linkedin);
    setGithub(profile.github);
    setPersonalWebsite(profile.personalWebsite);
  }, [open]);

  const [updateProfile] = useMutation(UPDATE_PROFILE, {
    refetchQueries: [{ query: GET_PROFILE, variables: { id } }],
  });

  function handleUpdateProfile(id) {
    updateProfile({
      variables: {
        id: 1,
        firstName,
        lastName,
        addressStreet1,
        addressStreet2,
        addressCity,
        addressState,
        addressZip,
        linkedin,
        github,
        personalWebsite,
      },
    });

    setOpen(false);
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" fullWidth maxWidth="sm">
      <DialogTitle>Profile</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={11}>
            <TextField
              required
              id="firstName"
              name="firstName"
              label="First Name"
              fullWidth
              variant="standard"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <CopyButton text={firstName} />
          </Grid>

          <Grid item xs={11}>
            <TextField
              required
              id="lastName"
              name="lastName"
              label="Last Name"
              fullWidth
              variant="standard"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <CopyButton text={lastName} />
          </Grid>

          <Grid item xs={11}>
            <TextField
              required
              id="addressStreet1"
              name="addressStreet1"
              label="Address Street 1"
              fullWidth
              variant="standard"
              value={addressStreet1}
              onChange={(e) => setAddressStreet1(e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <CopyButton text={addressStreet1} />
          </Grid>

          <Grid item xs={11}>
            <TextField
              required
              id="addressStreet2"
              name="addressStreet2"
              label="Address Street 2"
              fullWidth
              variant="standard"
              value={addressStreet2}
              onChange={(e) => setAddressStreet2(e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <CopyButton text={addressStreet2} />
          </Grid>

          <Grid item xs={11}>
            <TextField
              required
              id="addressCity"
              name="addressCity"
              label="City"
              fullWidth
              variant="standard"
              value={addressCity}
              onChange={(e) => setAddressCity(e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <CopyButton text={addressCity} />
          </Grid>

          <Grid item xs={11}>
            <TextField
              required
              id="addressState"
              name="addressState"
              label="State"
              fullWidth
              variant="standard"
              value={addressState}
              onChange={(e) => setAddressState(e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <CopyButton text={addressState} />
          </Grid>

          <Grid item xs={11}>
            <TextField
              required
              id="addressZip"
              name="addressZip"
              label="Zip Code"
              fullWidth
              variant="standard"
              value={addressZip}
              onChange={(e) => setAddressZip(e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <CopyButton text={addressZip} />
          </Grid>

          <Grid item xs={11}>
            <TextField
              required
              id="linkedin"
              name="linkedin"
              label="LinkedIn"
              fullWidth
              variant="standard"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <CopyButton text={linkedin} />
          </Grid>

          <Grid item xs={11}>
            <TextField
              required
              id="github"
              name="github"
              label="Github"
              fullWidth
              variant="standard"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <CopyButton text={github} />
          </Grid>

          <Grid item xs={11}>
            <TextField
              required
              id="personalWebsite"
              name="personalWebsite"
              label="Personal Website"
              fullWidth
              variant="standard"
              value={personalWebsite}
              onChange={(e) => setPersonalWebsite(e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <CopyButton text={personalWebsite} />
          </Grid>
        </Grid>
        <Typography variant="overline" align="right" paragraph>
          * Click the copy icon to copy to clipboard
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button color="info" variant="outlined" startIcon={<CancelIcon />} onClick={handleClose}>
          Cancel
        </Button>
        <Button color="info" variant="contained" startIcon={<SaveIcon />} onClick={() => handleUpdateProfile(profile.id)}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
