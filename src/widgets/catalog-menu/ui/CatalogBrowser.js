'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Box, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PercentIcon from '@mui/icons-material/Percent';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import TvIcon from '@mui/icons-material/Tv';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import KitchenIcon from '@mui/icons-material/Kitchen';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import CategoryIcon from '@mui/icons-material/Category';
import { getMonthlyPayment } from '@/entities/product/lib/pricing';
import { useCity } from '@/entities/city';
import { categoryPublicPath } from '@/shared/lib/category-path';
import { productPublicPath } from '@/shared/lib/product-path';

const GROUP_ICONS = {
  smartphones: SmartphoneIcon,
  tv: TvIcon,
  computers: LaptopMacIcon,
  kitchen: KitchenIcon,
  home: LocalLaundryServiceIcon,
  garden: AgricultureIcon,
  leisure: SportsEsportsIcon,
};

const INSTALLMENT_POINTS = [
  { title: '6, 10 или 12 месяцев', text: 'Срок выбирается на карточке товара' },
  { title: 'Без первого взноса', text: 'И без переплат по условиям на сайте' },
  { title: 'Одобрение за сутки', text: 'Заявка уходит консультанту, он перезванивает' },
];

function previewFromProduct(product) {
  const images = Array.isArray(product?.images) ? product.images.filter(Boolean) : [];
  return {
    id: product.id,
    name: product.name || product.title || 'Товар',
    image: product.image || images[0] || null,
    monthly: getMonthlyPayment(product),
  };
}

function Thumb({ src, alt }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'grid',
          placeItems: 'center',
          color: 'text.disabled',
          fontWeight: 700,
        }}
      >
        {alt?.slice(0, 1) || '•'}
      </Box>
    );
  }
  return (
    <Box
      component="img"
      src={src}
      alt=""
      onError={() => setFailed(true)}
      sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  );
}

function SectionLink({ href, title, text, onNavigate }) {
  return (
    <Box
      component={Link}
      href={href}
      onClick={onNavigate}
      sx={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        py: 0.75,
        '&:hover .catalog-link-title': { color: 'primary.main' },
      }}
    >
      <Typography className="catalog-link-title" sx={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.35 }}>
        {title}
      </Typography>
      {text ? (
        <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mt: 0.25 }}>{text}</Typography>
      ) : null}
    </Box>
  );
}

export default function CatalogBrowser({ groups = [], onNavigate, compact = false }) {
  const { href } = useCity();
  const [activeKey, setActiveKey] = useState('sales');
  const [showDetail, setShowDetail] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const cache = useRef({});
  const activeGroup = groups.find((group) => group.slug === activeKey) || null;

  useEffect(() => {
    if (!activeGroup) return undefined;
    const cached = cache.current[activeGroup.slug];
    if (cached) {
      setProducts(cached);
      setLoadingProducts(false);
      return undefined;
    }

    let cancelled = false;
    setLoadingProducts(true);
    setProducts([]);

    (async () => {
      const lists = await Promise.all(
        activeGroup.categories.slice(0, 4).map(async (category) => {
          try {
            const response = await fetch(
              `/api/products?categoryId=${encodeURIComponent(category.id)}&limit=3&sortBy=name&sort=asc`
            );
            if (!response.ok) return [];
            const data = await response.json();
            return Array.isArray(data.products) ? data.products : [];
          } catch {
            return [];
          }
        })
      );
      const next = lists.flat().slice(0, 8).map(previewFromProduct).filter((item) => item.id);
      if (cancelled) return;
      cache.current[activeGroup.slug] = next;
      setProducts(next);
      setLoadingProducts(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [activeGroup]);

  const select = (key) => {
    setActiveKey(key);
    setShowDetail(true);
  };

  const entries = [
    { key: 'sales', name: 'Акции', href: '/sales' },
    ...groups.map((group) => ({
      key: group.slug,
      name: group.name,
      href: `/catalog/${group.slug}`,
    })),
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        bgcolor: '#fff',
        borderRadius: '12px',
        border: '1px solid #E1E5EB',
        minHeight: { xs: 'auto', md: compact ? 420 : 560 },
        overflow: 'hidden',
        boxShadow: compact ? 'none' : '0 8px 24px rgba(31, 41, 51, 0.08)',
        color: 'text.primary',
      }}
    >
      <Box
        component="nav"
        aria-label="Разделы каталога"
        sx={{
          width: { xs: '100%', md: 300 },
          flexShrink: 0,
          borderRight: { md: '1px solid rgba(15, 23, 42, 0.06)' },
          py: 1,
          display: { xs: showDetail ? 'none' : 'block', md: 'block' },
          maxHeight: { md: compact ? 'min(70vh, 640px)' : 'none' },
          overflowY: 'auto',
        }}
      >
        {entries.map((entry) => {
          const selected = entry.key === activeKey;
          const Icon = entry.key === 'sales' ? PercentIcon : GROUP_ICONS[entry.key] || CategoryIcon;
          return (
            <Box
              key={entry.key}
              component="button"
              type="button"
              onMouseEnter={() => select(entry.key)}
              onFocus={() => select(entry.key)}
              onClick={() => select(entry.key)}
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                px: 1.5,
                py: 1.15,
                border: 0,
                cursor: 'pointer',
                textAlign: 'left',
                bgcolor: selected ? '#f3f5f8' : 'transparent',
                color: 'inherit',
                font: 'inherit',
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                  bgcolor: entry.key === 'sales' ? '#e53935' : '#eef2f6',
                  color: entry.key === 'sales' ? '#fff' : '#334155',
                }}
              >
                <Icon sx={{ fontSize: 20 }} />
              </Box>
              <Typography sx={{ flex: 1, fontWeight: selected ? 700 : 600, fontSize: '0.98rem' }}>
                {entry.name}
              </Typography>
              <ChevronRightIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
            </Box>
          );
        })}
      </Box>

      <Box
        sx={{
          flex: 1,
          p: { xs: 2, md: 3 },
          minWidth: 0,
          display: { xs: showDetail ? 'block' : 'none', md: 'block' },
          maxHeight: { md: compact ? 'min(70vh, 640px)' : 'none' },
          overflowY: 'auto',
          bgcolor: '#fff',
        }}
      >
        <Box
          component="button"
          type="button"
          onClick={() => setShowDetail(false)}
          sx={{
            display: { xs: 'inline-flex', md: 'none' },
            mb: 1.5,
            border: 0,
            background: 'none',
            color: 'primary.main',
            font: 'inherit',
            fontWeight: 700,
            cursor: 'pointer',
            p: 0,
          }}
        >
          Все разделы
        </Box>

        {activeKey === 'sales' ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
              gap: { xs: 3, md: 4 },
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>Акции</Typography>
              <SectionLink
                href="/sales"
                onNavigate={onNavigate}
                title="Текущие предложения магазина"
                text="Подарки к смартфонам, ноутбукам, телевизорам и стиральным машинам — на странице акций."
              />
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontWeight: 700, mb: 1 }}>Разделы</Typography>
                {groups.map((group) => (
                  <SectionLink
                    key={group.slug}
                    href={href(`/catalog/${group.slug}`)}
                    onNavigate={onNavigate}
                    title={group.name}
                    text={group.categories.map((category) => category.name).join(', ')}
                  />
                ))}
              </Box>
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>Рассрочка</Typography>
              {INSTALLMENT_POINTS.map((point) => (
                <SectionLink
                  key={point.title}
                  href="/payment_delivery"
                  onNavigate={onNavigate}
                  title={point.title}
                  text={point.text}
                />
              ))}
            </Box>
          </Box>
        ) : (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2, mb: 2 }}>
              <Typography component="h2" sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
                {activeGroup?.name}
              </Typography>
              <Typography
                component={Link}
                href={href(`/catalog/${activeGroup?.slug}`)}
                onClick={onNavigate}
                sx={{ color: 'primary.main', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}
              >
                Смотреть все
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr 1fr',
                  sm: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: 1.5,
              }}
            >
              {(activeGroup?.categories || []).map((category) => (
                <Box
                  key={category.id}
                  component={Link}
                  href={href(categoryPublicPath(category.id))}
                  onClick={onNavigate}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    p: 1.5,
                    borderRadius: 2,
                    textDecoration: 'none',
                    color: 'inherit',
                    bgcolor: '#f7f9fc',
                    minHeight: 132,
                    '&:hover': { bgcolor: '#eef3f9' },
                  }}
                >
                  <Box sx={{ width: 72, height: 56 }}>
                    <Thumb src={category.image} alt={category.name} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', textAlign: 'center', lineHeight: 1.3 }}>
                    {category.name}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Typography sx={{ fontWeight: 700, mt: 3, mb: 1.5 }}>Товары в разделе</Typography>
            {loadingProducts ? (
              <Typography color="text.secondary">Загружаем товары…</Typography>
            ) : products.length === 0 ? (
              <Typography color="text.secondary">
                Модели этого раздела открываются в категориях выше.
              </Typography>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
                  gap: 1.5,
                }}
              >
                {products.map((product) => (
                  <Box
                    key={product.id}
                    component={Link}
                    href={href(productPublicPath(product))}
                    onClick={onNavigate}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      p: 1.25,
                      borderRadius: 2,
                      textDecoration: 'none',
                      color: 'inherit',
                      border: '1px solid rgba(15, 23, 42, 0.06)',
                      '&:hover': { borderColor: 'primary.main' },
                    }}
                  >
                    <Box sx={{ height: 92, bgcolor: '#f4f7fb', borderRadius: 1.5 }}>
                      <Thumb src={product.image} alt={product.name} />
                    </Box>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.3, minHeight: 34 }}>
                      {product.name}
                    </Typography>
                    <Typography sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.9rem' }}>
                      {product.monthly > 0 ? `от ${product.monthly} BYN / мес` : 'Цена по запросу'}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
