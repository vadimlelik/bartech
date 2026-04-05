'use client';

import React from 'react';
import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import { LocalShipping, CheckCircle, Payment, Timeline } from '@mui/icons-material';

const features = [
    {
        icon: <LocalShipping sx={{ fontSize: 48, color: 'primary.main' }} />,
        title: 'Доставка по всей РБ',
        description: 'Доставка по Беларуси от 15 руб.',
    },
    {
        icon: <CheckCircle sx={{ fontSize: 48, color: 'primary.main' }} />,
        title: 'Одобрим рассрочку',
        description: '97% одобренных рассрочек в течение суток',
    },
    {
        icon: <Payment sx={{ fontSize: 48, color: 'primary.main' }} />,
        title: 'Без переплат',
        description: 'Без первого платежа',
    },
    {
        icon: <Timeline sx={{ fontSize: 48, color: 'primary.main' }} />,
        title: 'Доступные платежи',
        description: 'Ежемесячный платеж от 29,99 руб.',
    },
];

export default function Features() {
    return (
        <Box
            sx={{
                py: 6,
                backgroundColor: 'background.default',
            }}
        >
            <Container>
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    backgroundColor: 'transparent',
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        mb: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        backgroundColor: 'background.paper',
                                        boxShadow: 1,
                                    }}
                                >
                                    {feature.icon}
                                </Box>
                                <Typography
                                    variant="h6"
                                    component="h3"
                                    sx={{
                                        mb: 1,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {feature.title}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{
                                        lineHeight: 1.5,
                                    }}
                                >
                                    {feature.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
