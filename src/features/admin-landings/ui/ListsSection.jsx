'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Box, TextField, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import RepeaterList from './RepeaterList';
import { ADVANTAGE_PRESETS, BENEFIT_PRESETS } from '../model/presets';

function BenefitFields({ index }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={`benefits.${index}.text`}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          value={field.value || ''}
          fullWidth
          multiline
          rows={3}
          size="small"
          label="Текст преимущества"
          helperText="Можно переносить строки"
        />
      )}
    />
  );
}

function AdvantageFields({ index }) {
  const { control } = useFormContext();
  return (
    <Box sx={{ display: 'grid', gap: 1.5 }}>
      <Controller
        name={`advantages.${index}.title`}
        control={control}
        render={({ field }) => (
          <TextField {...field} value={field.value || ''} fullWidth size="small" label="Заголовок" />
        )}
      />
      <Controller
        name={`advantages.${index}.description`}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            value={field.value || ''}
            fullWidth
            size="small"
            multiline
            rows={2}
            label="Описание"
          />
        )}
      />
    </Box>
  );
}

export default function ListsSection() {
  return (
    <Box sx={{ display: 'grid', gap: 4 }}>
      <Box>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          Преимущества
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Короткий список с галочками на первом экране. Шаблон добавляется одним нажатием.
        </Typography>
        <RepeaterList
          name="benefits"
          listLabel="Преимущества"
          addLabel="Добавить преимущество"
          emptyTitle="Пока нет преимуществ"
          emptyDescription="Добавьте пункт вручную или выберите готовый шаблон."
          createItem={() => ({ text: '' })}
          isItemEmpty={(item) => !String(item?.text || '').trim()}
          itemTitle={(item, index) => String(item?.text || '').trim() || `Преимущество ${index + 1}`}
          itemIcon={<CheckCircleOutlineIcon fontSize="small" color="success" />}
          presets={BENEFIT_PRESETS.map((text) => ({ label: text, value: { text } }))}
          renderFields={(index) => <BenefitFields index={index} />}
        />
      </Box>
      <Box>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          Преимущества магазина
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Блок с номером, заголовком и описанием.
        </Typography>
        <RepeaterList
          name="advantages"
          listLabel="Преимущества магазина"
          addLabel="Добавить преимущество магазина"
          emptyTitle="Пока нет преимуществ магазина"
          emptyDescription="Расскажите, почему покупают именно здесь."
          createItem={() => ({ title: '', description: '' })}
          isItemEmpty={(item) => !String(item?.title || '').trim() && !String(item?.description || '').trim()}
          itemTitle={(item, index) => String(item?.title || '').trim() || `Преимущество ${index + 1}`}
          itemIcon={<StorefrontOutlinedIcon fontSize="small" color="primary" />}
          presets={ADVANTAGE_PRESETS.map((preset) => ({ label: preset.title, value: preset }))}
          renderFields={(index) => <AdvantageFields index={index} />}
        />
      </Box>
    </Box>
  );
}
