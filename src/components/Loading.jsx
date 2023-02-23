import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import ReactLoading from 'react-loading';


export default function Loading(){
    return (
        <div>
            <main>
                <Container sx={{ py: 8 }} maxWidth="md">
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6} md={4} />
                        <Grid item xs={12} sm={6} md={4}>
                            <Card/>
                            <Card
                                sx={{ justifyContent: 'center' }}
                            >
                                <CardContent>
                                    <ReactLoading
                                        type="spin"
                                        color="inherit"
                                        height={100}
                                        width={50}
                                        />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </div>
    );
}
