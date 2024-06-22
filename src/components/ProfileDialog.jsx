import React, { useEffect, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import { UPDATE_PROFILE } from '../graphql/mutation';
import { GET_PROFILE } from '../graphql/query';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';


export default function ProfileDialog({profile, handleClose, open, setOpen}){
    
    const [firstName, setFirstName] = useState('')
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
        fetchPolicy: 'network-only'
      });

    useEffect(()=> {
        setFirstName(profile.firstName)
        setLastName(profile.lastName)
        setAddressStreet1(profile.addressStreet1)
        setAddressStreet2(profile.addressStreet2)
        setAddressCity(profile.addressCity)
        setAddressState(profile.addressState)
        setAddressZip(profile.addressZip)
        setLinkedin(profile.linkedin)
        setGithub(profile.github)
        setPersonalWebsite(profile.personalWebsite)
    }, [open])

    const [updateProfile] = useMutation(UPDATE_PROFILE, {
        refetchQueries: [
            {query: GET_PROFILE, variables: { id }}
        ]
    });

    function handleUpdateProfile(id) {

        console.log("update id: " + id)

        updateProfile({
            variables: {
                id: 1,
                firstName: firstName,
                lastName: lastName,
                addressStreet1: addressStreet1,
                addressStreet2: addressStreet2,
                addressCity: addressCity,
                addressState: addressState,
                addressZip: addressZip,
                linkedin: linkedin,
                github: github,
                personalWebsite: personalWebsite
            }
        })

        setOpen(false);

    }

    return (
            <>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <DialogTitle>Profile</DialogTitle>
                    <DialogContent dividers>
                        <TextField
                            required
                            id="firstName"
                            name="firstName"
                            label="First Name"
                            fullWidth
                            variant="standard"
                            onChange={(e) => {
                                setFirstName(e.target.value)
                                navigator.clipboard.writeText(e.target.value)
                            }}
                            onFocus={(e) => {navigator.clipboard.writeText(e.target.value)}}
                            defaultValue={profile.firstName}
                        />

                        <TextField
                            required
                            id="lastName"
                            name="lastName"
                            label="Last Namee"
                            fullWidth
                            variant="standard"
                            onChange={(e) => {
                                setLastName(e.target.value)
                                navigator.clipboard.writeText(e.target.value)
                            }}
                            onFocus={(e) => {navigator.clipboard.writeText(e.target.value)}}
                            defaultValue={profile.lastName}
                        />

                        <TextField
                            required
                            id="addressStreet1"
                            name="addressStreet1"
                            label="Address Street 1"
                            fullWidth
                            variant="standard"
                            onChange={(e) => {
                                setAddressStreet1(e.target.value)
                                navigator.clipboard.writeText(e.target.value)
                            }}
                            onFocus={(e) => {navigator.clipboard.writeText(e.target.value)}}
                            defaultValue={profile.addressStreet1}
                        />

                        <TextField
                            required
                            id="addressStreet2"
                            name="addressStreet2"
                            label="Address Street 2"
                            fullWidth
                            variant="standard"
                            onChange={(e) => {
                                setAddressStreet2(e.target.value)
                                navigator.clipboard.writeText(e.target.value)
                            }}
                            onFocus={(e) => {navigator.clipboard.writeText(e.target.value)}}
                            defaultValue={profile.addressStreet2}
                        />

                        <TextField
                            required
                            id="addressCity"
                            name="addressCity"
                            label="City"
                            fullWidth
                            variant="standard"
                            onChange={(e) => {
                                setAddressCity(e.target.value)
                                navigator.clipboard.writeText(e.target.value)
                            }}
                            onFocus={(e) => {navigator.clipboard.writeText(e.target.value)}}
                            defaultValue={profile.addressCity}
                        />

                        <TextField
                            required
                            id="addressState"
                            name="addressState"
                            label="State"
                            fullWidth
                            variant="standard"
                            onChange={(e) => {
                                setAddressState(e.target.value)
                                navigator.clipboard.writeText(e.target.value)
                            }}
                            onFocus={(e) => {navigator.clipboard.writeText(e.target.value)}}
                            defaultValue={profile.addressState}
                        />

                        <TextField
                            required
                            id="addressZip"
                            name="addressZip"
                            label="Zip Code"
                            fullWidth
                            variant="standard"
                            onChange={(e) => {
                                setAddressZip(e.target.value)
                                navigator.clipboard.writeText(e.target.value)
                            }}
                            onFocus={(e) => {navigator.clipboard.writeText(e.target.value)}}
                            defaultValue={profile.addressZip}
                        />

                        <TextField
                            required
                            id="linkedin"
                            name="linkedin"
                            label="LinkedIn"
                            fullWidth
                            variant="standard"
                            onChange={(e) => {
                                setLinkedin(e.target.value)
                                navigator.clipboard.writeText(e.target.value)
                            }}
                            onFocus={(e) => {navigator.clipboard.writeText(e.target.value)}}
                            defaultValue={profile.linkedin}
                        />

                        <TextField
                            required
                            id="github"
                            name="github"
                            label="Github"
                            fullWidth
                            variant="standard"
                            onChange={(e) => {
                                setGithub(e.target.value)
                                navigator.clipboard.writeText(e.target.value)
                            }}
                            onFocus={(e) => {navigator.clipboard.writeText(e.target.value)}}
                            defaultValue={profile.github}
                        />

                        <TextField
                            required
                            id="personalWebsite"
                            name="personalWebsite"
                            label="Personal Website"
                            fullWidth
                            variant="standard"
                            onChange={(e) => {
                                setPersonalWebsite(e.target.value)
                                navigator.clipboard.writeText(e.target.value)
                            }}
                            onFocus={(e) => {navigator.clipboard.writeText(e.target.value)}}
                            defaultValue={profile.personalWebsite}
                        />
                        <Typography variant="overline"  align="right" paragraph>
                            * copy to the clipboard by clicking on a field
                        </Typography>
                    </DialogContent>

                    <DialogActions>
                        <Button color="info" variant="outlined" startIcon={<CancelIcon />} onClick={handleClose}>Cancel</Button>
                        <Button color="info" variant="contained" startIcon={<SaveIcon />} onClick={() => handleUpdateProfile(profile.id)} >Save</Button>
                    </DialogActions>


                </Dialog>
            </>
    );
}