import { Box, Container, Typography, Button } from '@mui/material'

export default function PhoneFree() {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: 'black',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                py: 4
            }}
        >
            <Container maxWidth="md">
                <Typography variant="h2" component="h1" gutterBottom>
                    Получите iPhone бесплатно!
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Специальное предложение только сегодня
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    sx={{
                        mt: 4,
                        bgcolor: '#ffd700',
                        color: 'black',
                        '&:hover': {
                            bgcolor: '#ffc800'
                        }
                    }}
                >
                    Получить сейчас
                </Button>
            </Container>
        </Box>
    )
}
