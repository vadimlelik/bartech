'use client';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Box, FormControlLabel, Switch, TextField, Typography } from '@mui/material';
import SlugField from './SlugField';

const MAIN_TITLE_HINT = 90;
const DESCRIPTION_HINT = 240;

/**
 * @param {{
 *   name: 'main_title' | 'description',
 *   label: string,
 *   hint: string,
 *   limit: number,
 *   rows: number,
 * }} props
 */
function CountedField({ name, label, hint, limit, rows }) {
  const { control } = useFormContext();
  const value = useWatch({ control, name }) || '';
  const over = value.length > limit;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          value={field.value || ''}
          fullWidth
          multiline
          rows={rows}
          label={label}
          helperText={(
            <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, width: '100%' }}>
              <span>{hint}</span>
              <Box component="span" sx={{ color: over ? 'warning.main' : 'text.secondary', whiteSpace: 'nowrap' }}>
                {value.length}/{limit}
              </Box>
            </Box>
          )}
        />
      )}
    />
  );
}

/**
 * @param {{
 *   excludeId: number | null,
 *   editWarning: string,
 *   onSlugManualEdit: () => void,
 * }} props
 */
export default function BasicsSection({ excludeId, editWarning, onSlugManualEdit }) {
  const { control } = useFormContext();

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Typography variant="h6">Основное</Typography>
      <Controller
        name="title"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            id="landing-title"
            value={field.value || ''}
            required
            fullWidth
            autoFocus
            autoComplete="off"
            label="Название"
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message || 'Название в списке лендингов'}
          />
        )}
      />
      <Controller
        name="slug"
        control={control}
        render={({ field, fieldState }) => (
          <SlugField
            value={field.value || ''}
            inputId="landing-slug"
            excludeId={excludeId}
            editWarning={editWarning}
            error={fieldState.error?.message}
            onBlur={field.onBlur}
            onChange={(next, meta) => {
              if (meta?.manual) onSlugManualEdit();
              field.onChange(next);
            }}
          />
        )}
      />
      <CountedField
        name="main_title"
        label="Главный заголовок"
        hint="Короткий заголовок первого экрана. Лучше уложиться в 90 символов."
        limit={MAIN_TITLE_HINT}
        rows={2}
      />
      <CountedField
        name="description"
        label="Описание"
        hint="Кратко, о чём страница. Лучше уложиться в 240 символов."
        limit={DESCRIPTION_HINT}
        rows={4}
      />
      <Controller
        name="button_text"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            value={field.value || ''}
            fullWidth
            label="Текст кнопки"
            helperText="Текст на кнопке «узнать цену» на странице"
          />
        )}
      />
      <Controller
        name="survey_text"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            value={field.value || ''}
            fullWidth
            multiline
            rows={2}
            label="Текст перед кнопкой"
          />
        )}
      />
      <Controller
        name="is_active"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={(
              <Switch
                checked={Boolean(field.value)}
                onChange={(_, checked) => field.onChange(checked)}
                inputProps={{ 'aria-label': field.value ? 'Снять с публикации' : 'Опубликовать' }}
              />
            )}
            label={field.value ? 'Опубликован' : 'Черновик'}
          />
        )}
      />
    </Box>
  );
}
