import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Skeleton shaped like JobApplicationCard.
const LoadingCard = () => (
  <Card
    data-testid="loading-card"
    aria-hidden
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 1.25,
      p: 2.25,
      pb: 1.5,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Skeleton variant="rounded" width="55%" height={20} />
      <Box sx={{ flex: 1 }} />
      <Skeleton
        variant="rounded"
        width={70}
        height={24}
        sx={{ borderRadius: 999 }}
      />
    </Box>
    <Skeleton variant="rounded" width="40%" height={14} />
    <Skeleton variant="rounded" width="70%" height={13} />
    <Skeleton variant="rounded" width="95%" height={13} />
    <Skeleton variant="rounded" width="80%" height={13} />
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
      <Skeleton variant="rounded" width={64} height={28} />
    </Box>
  </Card>
);

export default function Loading() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  // One row of placeholders: as many cards as fit side by side.
  const numberOfCards = isMobile ? 1 : isSmallTablet ? 2 : 3;

  return (
    <Grid container spacing={2.5} role="status" aria-busy="true">
      {Array.from({ length: numberOfCards }, (_, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
          <LoadingCard />
        </Grid>
      ))}
    </Grid>
  );
}
