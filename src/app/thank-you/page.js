'use client'

import { Container, Typography, Button, Box, Paper } from '@mui/material'
import { useRouter } from 'next/navigation'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

export default function ThankYouPage() {
    const router = useRouter()

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 3,
                    }}
                >
                    <CheckCircleOutlineIcon
                        color="success"
                        sx={{ fontSize: 64 }}
                    />
                    <Typography variant="h4" component="h1">
                        Спасибо за заказ!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Ваш заказ успешно оформлен. Мы свяжемся с вами в ближайшее
                        время для подтверждения заказа.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => router.push('/')}
                        sx={{ mt: 2 }}
                    >
                        Вернуться на главную
                    </Button>
                </Box>
            </Paper>
        </Container>
    )
}
