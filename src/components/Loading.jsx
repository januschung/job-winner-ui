import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const LoadingCard = ({ maxHeight = '33vh' }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} data-testid="loading-card" >
        <CardContent
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: maxHeight
            }}
        >
            <CircularProgress />
        </CardContent>
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
        <div>
            <main>
                <Container sx={{ py: 8 }} maxWidth="md">
                    <Grid container spacing={4}>
                        {cards}
                    </Grid>
                </Container>
            </main>
        </div>
    );
}
