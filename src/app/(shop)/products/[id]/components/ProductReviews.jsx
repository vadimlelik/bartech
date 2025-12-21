'use client';

import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  Typography,
  Rating,
  Divider,
} from '@mui/material';

/**
 * Компонент отзывов о товаре
 * TODO: Заменить хардкод на данные из API/базы данных
 */
export default function ProductReviews() {
  // Временные данные - должны быть из API
  const reviews = [
    {
      id: 1,
      author: 'Александр',
      rating: 5,
      date: '15.12.2023',
      text: 'Отличный телефон, всем рекомендую!',
    },
    {
      id: 2,
      author: 'Мария',
      rating: 4,
      date: '10.12.2023',
      text: 'Хороший телефон, но дороговато',
    },
    {
      id: 3,
      author: 'Дмитрий',
      rating: 5,
      date: '05.12.2023',
      text: 'Камера супер, батарея держит долго',
    },
  ];

  return (
    <List>
      {reviews.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Пока нет отзывов. Будьте первым!
          </Typography>
        </Box>
      ) : (
        reviews.map((review, index) => (
          <div key={review.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar>{review.author[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography component="span" variant="subtitle1">
                      {review.author}
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {review.date}
                    </Typography>
                  </Box>
                }
                secondary={
                  <>
                    <Rating
                      value={review.rating}
                      readOnly
                      size="small"
                      sx={{ mt: 1 }}
                    />
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      {review.text}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            {index < reviews.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </div>
        ))
      )}
    </List>
  );
}
