import { useMutation, useQuery } from '@apollo/client/react';
import DialogContent from '@mui/material/DialogContent';
import Skeleton from '@mui/material/Skeleton';
import {
  Typography,
  Grid,
  Card,
  Avatar,
  CardContent,
  Link,
  Box,
} from '@mui/material';
import useDialog from '../hooks/useDialog';
import { stringAvatar } from '../utils/avatarUtil';
import ConfirmDialog from './common/ConfirmDialog';
import useConfirmedAction from '../hooks/useConfirmedAction';
import ActionIcons from './common/ActionIcons';
import { DELETE_FREQUENT_URL } from '../graphql/mutation';
import { GET_FREQUENT_URLS } from '../graphql/query';
import AddOrEditFrequentUrlDialog from './AddOrEditFrequentUrlDialog';
import { useTranslation } from 'react-i18next';

export default function FrequentUrlContent() {
  const edit = useDialog();
  const { data, loading, error } = useQuery(GET_FREQUENT_URLS, {
    fetchPolicy: 'network-only',
  });
  const { t } = useTranslation();

  const [deleteFrequentUrl] = useMutation(DELETE_FREQUENT_URL, {
    refetchQueries: [{ query: GET_FREQUENT_URLS }],
  });
  const remove = useConfirmedAction({
    action: item => deleteFrequentUrl({ variables: { id: item.id } }),
    successMessage: t('dialogs.addBookmark.success'),
    errorMessage: t('dialogs.addBookmark.error'),
  });

  return (
    <DialogContent>
      <AddOrEditFrequentUrlDialog
        open={edit.open}
        handleClose={edit.handleClose}
        frequentUrl={edit.item}
      />
      <Grid
        container
        spacing={2}
        sx={{
          alignItems: 'center',
        }}
      >
        {loading &&
          Array.from(new Array(6)).map((_, index) => (
            <Grid
              key={index}
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent
                  sx={{ flexGrow: 1, height: '20%', '&:last-child': { pb: 2 } }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      flexGrow: 1,
                    }}
                  >
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" width="80%" height={12} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}

        {!loading && !error && data?.allFrequentUrl?.length === 0 && (
          <Typography variant="body1">
            {t('dialogs.addBookmark.noUrls')}
          </Typography>
        )}
        {!loading && !error && data?.allFrequentUrl?.length > 0 && (
          <>
            {data.allFrequentUrl.map(frequentUrl => (
              <Grid
                key={frequentUrl.id}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
              >
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
                      sx={{
                        color: 'text.secondary',
                        mb: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        width: '100%',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          flexGrow: 1,
                        }}
                      >
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
                        onEdit={() => edit.handleOpen(frequentUrl)}
                        onDelete={() => remove.request(frequentUrl)}
                        name={frequentUrl.title}
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
        {...remove.dialogProps}
        title={
          remove.item
            ? t('common.deleteNamed', { name: remove.item.title })
            : t('dialogs.confirmDeletion.title')
        }
        content={t('dialogs.confirmDeletion.content')}
      />
    </DialogContent>
  );
}
