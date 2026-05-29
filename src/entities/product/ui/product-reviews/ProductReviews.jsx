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
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { YANDEX_REVIEWS } from '@/shared/config/yandex-reviews';

export default function ProductReviews() {
  const reviews = YANDEX_REVIEWS;

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
                <Avatar>{review.name[0]}</Avatar>
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
                      {review.name}
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {format(new Date(review.date), 'd MMMM yyyy', {
                        locale: ru,
                      })}
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
