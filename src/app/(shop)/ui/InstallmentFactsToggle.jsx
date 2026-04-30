'use client';

import { useState } from 'react';
import { Box, Button, Collapse, Typography } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

export default function InstallmentFactsToggle() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box sx={{ maxWidth: 950, mx: 'auto', mb: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setIsOpen((prev) => !prev)}
          endIcon={isOpen ? <ExpandLess /> : <ExpandMore />}
        >
          {isOpen
            ? 'Скрыть факты и условия покупки в рассрочку'
            : 'Показать факты и условия покупки в рассрочку'}
        </Button>
      </Box>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Box
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            backgroundColor: 'background.paper',
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
            Факты и условия покупки в рассрочку
          </Typography>
          <Typography variant="body1" color="text.secondary">
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
        </Box>
      </Collapse>
    </Box>
  );
}
