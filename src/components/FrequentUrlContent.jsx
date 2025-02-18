import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import DialogContent from '@mui/material/DialogContent';
import { Typography, Grid, Card, Avatar, CardContent, Link, Box } from '@mui/material';
import useFrequentUrls from '../hooks/useFrequentUrls';
import useDialog from '../hooks/useDialog';
import Loading from './common/Loading';
import { stringAvatar } from '../utils/avatarUtil';
import ConfirmDialog from './common/ConfirmDialog';
import { useSnackbar } from './common/SnackbarContext';
import ActionIcons from './common/ActionIcons';
import { DELETE_FREQUENT_URL } from '../graphql/mutation';
import { GET_FREQUENT_URLS } from '../graphql/query';
import AddOrEditFrequentUrlDialog from './AddOrEditFrequentUrlDialog';


export default function FrequentUrlContent({ }) {
  const [frequentUrl, setFrequentUrl] = useState(null);
  const { dialogOpen: confirmDialogOpen, 
          handleOpen: handleConfirmDialogOpen, 
          handleClose: handleConfirmDialogClose } = useDialog();

  const { dialogOpen, handleOpen, handleClose } = useDialog();

  const { data, loading, error } = useFrequentUrls();
  const { showSnackbar } = useSnackbar();
  const [deleteFrequentUrl] = useMutation(DELETE_FREQUENT_URL, {
    refetchQueries: [{ query: GET_FREQUENT_URLS }],
  });

  const confirmDeleteFrequentUrl = () => {
    deleteFrequentUrl({
      variables: { id: frequentUrl.id }
    })
      .then(() => {
        showSnackbar("Bookmark deleted successfully!");
    })
      .catch(() => {
        showSnackbar("Failed to delete the bookmark.");
    });
    handleConfirmDialogClose();
  }

  const handleDeleteFrequentUrl = (frequentUrl) => {
    setFrequentUrl(frequentUrl)
    handleConfirmDialogOpen();    
  };

  const handleOpenEditDialog = (frequentUrl) => {
    setFrequentUrl(frequentUrl)
    handleOpen();
  }

  return (
    <DialogContent dividers>
      <AddOrEditFrequentUrlDialog open={dialogOpen} handleClose={handleClose} frequentUrl={frequentUrl} />
      <Grid container spacing={2} alignItems="center">
        {loading && <Loading />}
        {!loading && !error && data?.allFrequentUrl?.length === 0 && (
          <Typography variant="body1">No URLs</Typography>
        )}
        {!loading && !error && data?.allFrequentUrl?.length > 0 && (
          <>
            {data.allFrequentUrl.map((frequentUrl) => (
              <Grid item key={frequentUrl.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      height: '20%',
                      '&:last-child': { pb: 0 },
                    }}
                  >
                    <Grid 
                      item 
                      sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, width: "100%",  }}
                      color="text.secondary"
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                        <Avatar {...stringAvatar(frequentUrl.title)} />
                        <Link
                          href={frequentUrl.url}
                          underline="hover"
                          color="inherit"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          {frequentUrl.title}
                        </Link>
                      </Box>
                      <ActionIcons 
                        onEdit={() => handleOpenEditDialog(frequentUrl)}
                        onDelete={() => handleDeleteFrequentUrl(frequentUrl)}
                        stopPropagation 
                      />
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              ))}
            </>
          )}
        </Grid>
        <ConfirmDialog
            open={confirmDialogOpen}
            onCancel={handleConfirmDialogClose}
            onConfirm={confirmDeleteFrequentUrl}
            title="Confirm Deletion"
            content="Are you sure you want to delete this bookmark? This action cannot be undone."
        />
      </DialogContent>
    );
  }
