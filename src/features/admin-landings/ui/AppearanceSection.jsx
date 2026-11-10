'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Box, TextField, Typography } from '@mui/material';
import RepeaterList from './RepeaterList';

const COLOR_FIELDS = [
  { key: 'header', label: 'Цвет заголовка' },
  { key: 'button', label: 'Цвет кнопки' },
  { key: 'buttonHover', label: 'Цвет кнопки при наведении' },
  { key: 'background', label: 'Цвет фона страницы' },
  { key: 'textColor', label: 'Цвет текста' },
  { key: 'bodyBackground', label: 'Фон за лендингом' },
];

function ColorField({ colorKey, label }) {
  const { control } = useFormContext();
  const name = `colors.${colorKey}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            component="input"
            type="color"
            aria-label={label}
            value={field.value || '#000000'}
            onChange={(event) => field.onChange(event.target.value)}
            sx={{ width: 48, height: 40, p: 0, border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper', cursor: 'pointer' }}
          />
          <TextField
            fullWidth
            size="small"
            label={label}
            value={field.value || ''}
            onChange={(event) => field.onChange(event.target.value)}
            onBlur={field.onBlur}
          />
        </Box>
      )}
    />
  );
}

function PixelFields({ index }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={`pixels.${index}.value`}
      control={control}
      render={({ field }) => (
        <TextField {...field} value={field.value || ''} fullWidth size="small" label="ID пикселя" placeholder="Введите ID пикселя" />
      )}
    />
  );
}

export default function AppearanceSection() {
  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <Box>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          Цвета
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Эти цвета уже используются на странице лендинга.
        </Typography>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          {COLOR_FIELDS.map((field) => (
            <ColorField key={field.key} colorKey={field.key} label={field.label} />
          ))}
        </Box>
      </Box>
      <Box>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          TikTok пиксели
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Идентификаторы подключаются на опубликованной странице.
        </Typography>
        <RepeaterList
          name="pixels"
          collapsible={false}
          listLabel="Пиксели"
          addLabel="Добавить пиксель"
          emptyTitle="Пиксели не добавлены"
          emptyDescription="Если аналитика не нужна, этот блок можно оставить пустым."
          createItem={() => ({ value: '' })}
          isItemEmpty={(item) => !String(item?.value || '').trim()}
          itemTitle={(item, index) => String(item?.value || '').trim() || `Пиксель ${index + 1}`}
          renderFields={(index) => <PixelFields index={index} />}
        />
      </Box>
    </Box>
  );
}
