'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Box, Typography } from '@mui/material';
import ImageField from './ImageField';

export default function ImagesSection() {
  const { control } = useFormContext();

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <Box>
        <Typography variant="h6">Изображения</Typography>
        <Typography variant="body2" color="text.secondary">
          Главное изображение стоит рядом с преимуществами, второстепенное — в блоке преимуществ магазина.
        </Typography>
      </Box>
      <Controller
        name="main_image"
        control={control}
        render={({ field }) => (
          <ImageField
            label="Главное изображение"
            value={field.value || ''}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="secondary_image"
        control={control}
        render={({ field }) => (
          <ImageField
            label="Второстепенное изображение"
            value={field.value || ''}
            onChange={field.onChange}
          />
        )}
      />
    </Box>
  );
}
