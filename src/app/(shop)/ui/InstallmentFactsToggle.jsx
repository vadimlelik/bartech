'use client';

import { useState } from 'react';
import { Box, Button, Collapse, Paper, Typography } from '@mui/material';
import { ArticleOutlined, ExpandLess, ExpandMore } from '@mui/icons-material';

export default function InstallmentFactsToggle() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mb: 4, mt: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
        <Button
          variant="text"
          color="inherit"
          onClick={() => setIsOpen((prev) => !prev)}
          endIcon={isOpen ? <ExpandLess /> : <ExpandMore />}
          sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 500 }}
        >
          {isOpen
            ? 'Скрыть подробные условия рассрочки'
            : 'Подробные условия и факты о рассрочке'}
        </Button>
      </Box>

      <Collapse in={isOpen} timeout="auto">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 2.5 },
            borderRadius: 3,
            border: '1px dashed',
            borderColor: 'divider',
            bgcolor: 'grey.50',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 1.5 }}>
            <ArticleOutlined color="action" fontSize="small" />
            <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700, m: 0 }}>
              Факты и условия покупки в рассрочку
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.75, fontSize: '0.9375rem' }}
          >
            Texnobar работает как интернет-магазин техники для покупателей из
            Минска и других городов Беларуси: на сайте доступен каталог с
            актуальными карточками телефонов, телевизоров, ноутбуков и другой
            электроники. Для заявки на рассрочку клиент выбирает товар, оставляет
            контакты и получает предварительное решение, как правило, в течение
            суток. В блоке преимуществ на этой странице зафиксированы конкретные
            ориентиры по условиям: доставка по РБ от 15 руб., ежемесячный платеж
            от 29,99 руб., а также программы без первого платежа. Формулировка
            «97% одобренных рассрочек» относится к внутренней статистике заявок
            магазина, поэтому итоговое решение по каждому клиенту зависит от
            параметров выбранной программы финансирования и проверки данных при
            оформлении.
          </Typography>
        </Paper>
      </Collapse>
    </Box>
  );
}
