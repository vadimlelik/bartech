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
    <Box sx={{ py: 6, backgroundColor: 'background.default' }}>
      <Container>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            mb: 4,
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: { xs: '2rem', md: '2.5rem' },
          }}
        >
          Отзывы наших клиентов
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            mb: 6,
            textAlign: 'center',
            maxWidth: 800,
            mx: 'auto',
          }}
        >
          Мы ценим каждого клиента и стремимся предоставить лучший сервис.
          Ознакомьтесь с отзывами покупателей о нашем магазине.
        </Typography>

        <Box sx={{ mt: 8 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              mb: 2,
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: { xs: '1.6rem', md: '2rem' },
            }}
          >
            Отзывы с Яндекс Карт
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: 'center', mb: 4 }}
          >
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
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                  elevation={0}
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
