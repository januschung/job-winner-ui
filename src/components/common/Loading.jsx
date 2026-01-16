import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import CardActions from '@mui/material/CardActions';
import Skeleton from '@mui/material/Skeleton';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const LoadingCard = () => (
  <Card
    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    data-testid="loading-card"
  >
    <CardContent>
      <Skeleton variant="text" width="35%" />
      <Skeleton variant="text" width="30%" />
      <Skeleton variant="text" width="50%" />
      <Skeleton variant="rectangular" height={118} sx={{ my: 2 }} />
      <Skeleton variant="text" width="80%" />
    </CardContent>
    <CardActions sx={{ justifyContent: 'flex-end' }}>
      <Skeleton variant="rectangular" width={80} height={30} sx={{ mr: 1 }} />
      <Skeleton variant="rectangular" width={80} height={30} />
    </CardActions>
  </Card>
);

export default function Loading() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Mobile breakpoint
  const isSmallTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // Tablet breakpoint

  let numberOfCards;
  if (isMobile) {
    numberOfCards = 1; // Render 1 card on mobile
  } else if (isSmallTablet) {
    numberOfCards = 2; // Render 2 cards on tablets
  } else {
    numberOfCards = 3; // Render 3 cards on desktop
  }

  const cards = [];

  for (let i = 0; i < numberOfCards; i++) {
    cards.push(
      <Grid item xs={12} sm={6} md={4} key={i}>
        <LoadingCard />
      </Grid>
    );
  }

  return (
    <Grid container spacing={4}>
      {cards}
    </Grid>
  );
}
