'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import RepeaterList from './RepeaterList';
import ImageField from './ImageField';

/**
 * @param {{ value: number, onChange: (value: number) => void }} props
 */
function StarRating({ value, onChange }) {
  const current = Number(value) || 0;

  const changeBy = (delta) => {
    onChange(Math.min(5, Math.max(0, current + delta)));
  };

  return (
    <Box
      role="radiogroup"
      aria-label="Рейтинг"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
          event.preventDefault();
          changeBy(1);
        }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
          event.preventDefault();
          changeBy(-1);
        }
      }}
      sx={{ display: 'flex', alignItems: 'center', gap: 0.5, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' } }}
    >
      <Typography variant="body2" sx={{ mr: 0.5 }}>
        Рейтинг
      </Typography>
      {[1, 2, 3, 4, 5].map((score) => (
        <IconButton
          key={score}
          type="button"
          size="small"
          role="radio"
          aria-checked={current === score}
          aria-label={`${score} из 5`}
          onClick={() => onChange(current === score ? 0 : score)}
        >
          {score <= current ? <StarIcon sx={{ color: 'warning.main' }} /> : <StarBorderIcon />}
        </IconButton>
      ))}
    </Box>
  );
}

function ReviewFields({ index }) {
  const { control } = useFormContext();

  return (
    <Box sx={{ display: 'grid', gap: 1.5 }}>
      <Controller
        name={`reviews.${index}.author`}
        control={control}
        render={({ field }) => (
          <TextField {...field} value={field.value || ''} fullWidth size="small" label="Автор" placeholder="Имя покупателя" />
        )}
      />
      <Controller
        name={`reviews.${index}.text`}
        control={control}
        render={({ field }) => (
          <TextField {...field} value={field.value || ''} fullWidth size="small" multiline rows={3} label="Текст" />
        )}
      />
      <Controller
        name={`reviews.${index}.rating`}
        control={control}
        render={({ field }) => (
          <StarRating value={Number(field.value) || 0} onChange={field.onChange} />
        )}
      />
      <Controller
        name={`reviews.${index}.avatar`}
        control={control}
        render={({ field }) => (
          <ImageField
            compact
            label="Аватар"
            value={field.value || ''}
            onChange={field.onChange}
            helperText="Небольшое фото автора. На сайте показывается, если оно заполнено."
          />
        )}
      />
      <Controller
        name={`reviews.${index}.image`}
        control={control}
        render={({ field }) => (
          <ImageField
            compact
            label="Фото отзыва"
            value={field.value || ''}
            onChange={field.onChange}
            helperText="Крупное фото в карточке отзыва на странице."
          />
        )}
      />
    </Box>
  );
}

export default function ReviewsSection() {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 0.5 }}>
        Отзывы
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Автор, текст, оценка и фотографии. Старые отзывы с текстом и фото открываются как раньше.
      </Typography>
      <RepeaterList
        name="reviews"
        listLabel="Отзывы"
        addLabel="Добавить отзыв"
        emptyTitle="Пока нет отзывов"
        emptyDescription="Добавьте отзыв покупателя: его увидят на странице лендинга."
        createItem={() => ({ text: '', image: '', author: '', avatar: '', rating: 0 })}
        isItemEmpty={(item) => {
          const rating = Number(item?.rating) || 0;
          return !String(item?.text || '').trim()
            && !String(item?.image || '').trim()
            && !String(item?.author || '').trim()
            && !String(item?.avatar || '').trim()
            && rating === 0;
        }}
        itemTitle={(item, index) => String(item?.author || '').trim() || String(item?.text || '').trim() || `Отзыв ${index + 1}`}
        itemIcon={<RateReviewOutlinedIcon fontSize="small" color="primary" />}
        renderFields={(index) => <ReviewFields index={index} />}
      />
    </Box>
  );
}
