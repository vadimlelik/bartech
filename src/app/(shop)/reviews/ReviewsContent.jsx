'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Rating,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { YANDEX_REVIEWS, YANDEX_REVIEWS_URL } from '@/shared/config/yandex-reviews';

export default function ReviewsContent() {
  return (
    <Box component="main" sx={{ py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Typography
          component="h1"
          sx={{
            mb: 1,
            fontWeight: 700,
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            letterSpacing: '-0.02em',
          }}
        >
          Отзывы наших клиентов
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mb: 4,
            maxWidth: 760,
          }}
        >
          Мы ценим каждого клиента и стремимся предоставить лучший сервис.
          Ознакомьтесь с отзывами покупателей о нашем магазине.
        </Typography>

        <Box sx={{ mt: 5 }}>
          <Typography
            component="h2"
            sx={{
              mb: 1,
              fontWeight: 700,
              fontSize: { xs: '1.35rem', md: '1.6rem' },
            }}
          >
            Отзывы с Яндекс Карт
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Рейтинг на Яндекс Картах: 5.0 на основе 50+ оценок.{' '}
            <Box
              component="a"
              href={YANDEX_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Смотреть все отзывы
            </Box>
          </Typography>

          <Grid container spacing={3}>
            {YANDEX_REVIEWS.map((review) => (
              <Grid size={{ xs: 12, md: 6 }} key={review.id}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6" component="div">
                        {review.name}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        {format(new Date(review.date), 'd MMMM yyyy', {
                          locale: ru,
                        })}
                      </Typography>
                    </Box>
                    <Rating value={review.rating} readOnly sx={{ mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      {review.text}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
