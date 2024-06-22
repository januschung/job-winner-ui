import React from 'react';
import { Grid, TextField } from '@mui/material';
import CopyButton from './CopyButton';

const ProfileForm = ({
  firstName, setFirstName,
  lastName, setLastName,
  addressStreet1, setAddressStreet1,
  addressStreet2, setAddressStreet2,
  addressCity, setAddressCity,
  addressState, setAddressState,
  addressZip, setAddressZip,
  linkedin, setLinkedin,
  github, setGithub,
  personalWebsite, setPersonalWebsite
}) => {
  return (
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
  );
};

export default ProfileForm;
