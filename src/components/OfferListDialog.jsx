import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import CancelIcon from '@mui/icons-material/Cancel';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { GET_ALL_OFFERS } from '../graphql/query';
import useJobApplicationDialog from './hooks/useJobApplicationDialog';
import JobApplicationDialog from './JobApplicationDialog';
import DialogTitleBar from './DialogTitleBar';

export default function OfferListDialog({ handleClose, open }) {
  const [offers, setOffers] = useState([]);
  const { loading, error, data, refetch } = useQuery(GET_ALL_OFFERS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => setOffers(data.allOffer),
  });
  const { 
    open: jobDialogOpen, 
    jobApplication, 
    handleOpen: handleJobDialogOpen, 
    handleClose: handleJobDialogClose 
  } = useJobApplicationDialog(() => {
    refetch().then(({ data }) => setOffers(data.allOffer));
  });

  useEffect(() => {
    if (open) {
      refetch()
        .then(({ data }) => {
          if (data) setOffers(data.allOffer);
        })
        .catch((err) => console.error('Refetch error:', err));
    }
  }, [open, refetch]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      fullWidth
      maxWidth="md"
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(8px)',
          },
        },
      }}
    >
      <DialogTitleBar title="Offer List" />

      <DialogContent dividers>
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Typography variant="body1" color="error" align="center">
            Something went wrong. Please try again later.
          </Typography>
        )}

        {!loading && !error && offers.length === 0 && (
          <Box textAlign="center" p={4}>
            <Typography variant="h6" color="textSecondary">
              No offers available yet!
            </Typography>
            <Button color="primary" variant="contained" onClick={handleClose}>
              Add an Offer
            </Button>
          </Box>
        )}

        {!loading && !error && offers.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Company</TableCell>
                  <TableCell align="left">Offer Date</TableCell>
                  <TableCell align="left">Salary Offered</TableCell>
                  <TableCell align="left">Note</TableCell>
                  <TableCell align="center">Job Application</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {offers.map((offer, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">{offer.jobApplication.companyName}</TableCell>
                    <TableCell align="left">{offer.offerDate}</TableCell>
                    <TableCell align="left">{offer.salaryOffered}</TableCell>
                    <TableCell align="left">{offer.description}</TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        color="info"
                        variant="outlined"
                        onClick={() => handleJobDialogOpen(offer.jobApplication)}
                      >
                        Job Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      <DialogActions>
        <Button color="info" variant="outlined" startIcon={<CancelIcon />} onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
      <JobApplicationDialog
        jobApplication={jobApplication}
        open={jobDialogOpen}
        handleClose={handleJobDialogClose}
      />
    </Dialog>
  );
}
