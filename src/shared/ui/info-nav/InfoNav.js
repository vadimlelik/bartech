'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box } from '@mui/material';
import { useCity } from '@/entities/city';

const LINKS = [
  { href: '/payment_delivery', label: 'Оплата и доставка' },
  { href: '/installment', label: 'Рассрочка' },
  { href: '/return', label: 'Условия возврата' },
  { href: '/guarantee', label: 'Возврат товара' },
  { href: '/contacts', label: 'Контакты' },
  { href: '/sales', label: 'Акции' },
  { href: '/service', label: 'Сервисные центры' },
  { href: '/po', label: 'Публичная оферта' },
  { href: '/pk', label: 'Персональные данные' },
  { href: '/privacy', label: 'Конфиденциальность' },
];

export default function InfoNav() {
  const pathname = usePathname() || '/';
  const { href } = useCity();
  const current = pathname.replace(/^\/(grodno|brest|vitebsk|gomel|mogilev)(?=\/|$)/, '') || '/';

  return (
    <Box
      component="nav"
      aria-label="Информация для покупателей"
      sx={{
        display: 'flex',
        gap: 1,
        overflowX: 'auto',
        pb: 2,
        mb: 2,
        scrollbarWidth: 'thin',
      }}
    >
      {LINKS.map((item) => {
        const active = current === item.href || current.startsWith(`${item.href}/`);
        return (
          <Box
            key={item.href}
            component={Link}
            href={href(item.href)}
            aria-current={active ? 'page' : undefined}
            sx={{
              flex: '0 0 auto',
              minHeight: 36,
              display: 'inline-flex',
              alignItems: 'center',
              px: 1.5,
              borderRadius: '18px',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
              color: active ? '#1D6FE8' : '#1F2933',
              bgcolor: active ? '#E8F0FE' : '#FFFFFF',
              border: '1px solid',
              borderColor: active ? '#1D6FE8' : '#E1E5EB',
            }}
          >
            {item.label}
          </Box>
        );
      })}
    </Box>
  );
}
