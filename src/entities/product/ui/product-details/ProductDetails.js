'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  Link as MuiLink,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useFavoritesStore } from '@/entities/favorites';
import { useCompareStore } from '@/entities/compare';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PhoneIcon from '@mui/icons-material/Phone';
import CloseIcon from '@mui/icons-material/Close';
import MaskedPhoneInput from '@/shared/ui/input-mask/InputMask';
import ProductImageGallery from '@/entities/product/ui/product-image-gallery/ProductImageGallery';
import ProductReviews from '@/entities/product/ui/product-reviews/ProductReviews';
import ProductEducationalCopy from '@/entities/product/ui/product-educational-copy/ProductEducationalCopy';
import CatalogProductCard from '@/entities/product/ui/catalog-product-card/CatalogProductCard';
import { VALIDATION } from '@/shared/config/constants';
import {
  DEFAULT_INSTALLMENT_TERM,
  INSTALLMENT_TERMS,
  formatByn,
  getFullPrice,
  getMonthlyPayment,
} from '@/entities/product/lib/pricing';
import { useCity } from '@/entities/city';
import { cityCall, describeDelivery, showCityField } from '@/entities/city/lib/city-content';
import { trackCityEvent } from '@/shared/ui/analytics/CityAnalytics';

const SECTION_LINKS = [
  { href: '#description', label: 'Описание' },
  { href: '#specs', label: 'Характеристики' },
  { href: '#delivery', label: 'Доставка и возврат' },
];

const specificationTranslations = {
  brand: 'Бренд',
  model: 'Модель',
  year: 'Год выпуска',
  color: 'Цвет',
  memory: 'Память',
  ram: 'Оперативная память',
  processor: 'Процессор',
  display: 'Дисплей',
  camera: 'Камера',
  battery: 'Аккумулятор',
  os: 'Операционная система',
};

function translateSpecification(key) {
  return specificationTranslations[key] || key;
}

function SpecTable({ rows }) {
  if (!rows.length) return null;

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
    >
      <Table size="small">
        <TableBody>
          {rows.map(([key, value]) => (
            <TableRow key={key}>
              <TableCell
                component="th"
                scope="row"
                sx={{ width: '46%', color: 'text.secondary', bgcolor: '#f8fafc' }}
              >
                {translateSpecification(key)}
              </TableCell>
              <TableCell>{value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function ProductDetails({ product, breadcrumbs = [], similarProducts = [], cityIntro = '' }) {
  const [isInstallmentModalOpen, setIsInstallmentModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [phone, setPhone] = useState('+375');
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const addToCompare = useCompareStore((state) => state.addToCompare);
  const removeFromCompare = useCompareStore((state) => state.removeFromCompare);
  const isCompared = useCompareStore((state) => state.compareItems.some((item) => item.id === product.id));
  const [actionsMounted, setActionsMounted] = useState(false);
  const addToFavorites = useFavoritesStore((state) => state.addToFavorites);
  const removeFromFavorites = useFavoritesStore((state) => state.removeFromFavorites);
  const isFavorite = useFavoritesStore(
    (state) => state.initialized && state.favorites.includes(String(product.id))
  );
  const { commerceCity, pageCity } = useCity();
  const city = pageCity || commerceCity;
  const installmentMonths = city?.installmentTerms?.months?.length
    ? city.installmentTerms.months
    : INSTALLMENT_TERMS;
  const defaultTerm = installmentMonths.includes(city?.installmentTerms?.defaultMonths)
    ? city.installmentTerms.defaultMonths
    : installmentMonths[installmentMonths.length - 1] || DEFAULT_INSTALLMENT_TERM;
  const params = useSearchParams();

  const utm_source = params.get('utm_source');
  const utm_medium = params.get('utm_medium');
  const utm_content = params.get('utm_content');
  const utm_campaign = params.get('utm_campaign');
  const ad = params.get('ad');
  const ttclid = params.get('ttclid');
  // TODO: наличие пока общее для магазина. Позже его можно считать от выбранного населённого пункта.
  const availabilityStatus =
    product.availabilityStatus || product.availability_status || 'in_stock';
  const isProductInStock = availabilityStatus !== 'on_order';
  const availabilityLabel = isProductInStock ? 'В наличии' : 'Нет в наличии, под заказ';
  const requestActionLabel = isProductInStock ? 'Оформить рассрочку' : 'Оставить заявку';
  const requestDialogTitle = isProductInStock ? 'Оформить рассрочку' : 'Заявка под заказ';
  // TODO: цена пока не зависит от населённого пункта. Точка расширения — locality.serviceCitySlug.
  const fullPrice = getFullPrice(product);
  const monthlyPayment = getMonthlyPayment(product, defaultTerm, installmentMonths);

  useEffect(() => {
    setActionsMounted(true);
  }, []);

  useEffect(() => {
    trackCityEvent('view_item', {
      city: city?.slug || 'minsk',
      page_city: city?.slug || 'minsk',
      item_id: String(product.id),
      item_name: product.name,
      price: fullPrice || Number(product.price) || 0,
      currency: 'BYN',
    });
  }, [city?.slug, fullPrice, product.id, product.name, product.price]);

  const productImages = (() => {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images.filter((img) => img && img.trim() !== '');
    }
    if (product.image && product.image.trim() !== '') {
      return [product.image];
    }
    return ['/logo_techno_bar.svg'];
  })();

  const specificationEntries =
    product.specifications &&
    typeof product.specifications === 'object' &&
    !Array.isArray(product.specifications)
      ? Object.entries(product.specifications).filter(([, value]) => {
          const strValue = String(value ?? '').trim();
          return strValue !== '' && value !== null && value !== undefined;
        })
      : [];

  const specMidpoint = Math.ceil(specificationEntries.length / 2);
  const specColumns = [
    specificationEntries.slice(0, specMidpoint),
    specificationEntries.slice(specMidpoint),
  ].filter((column) => column.length > 0);

  const article =
    product.specifications?.sku ||
    product.specifications?.article ||
    product.specifications?.vendorCode ||
    product.id;

  const handleOpenInstallmentModal = () => {
    setIsInstallmentModalOpen(true);
    setName('');
    setNameError('');
    setPhone('+375');
    setPhoneError('');
    setSubmitSuccess(false);
    setSubmitError('');
  };

  const handleCloseInstallmentModal = () => {
    setIsInstallmentModalOpen(false);
    setName('');
    setNameError('');
    setPhone('+375');
    setPhoneError('');
    setSubmitSuccess(false);
    setSubmitError('');
  };

  const validateName = (nameValue) => {
    if (!nameValue || nameValue.trim() === '') {
      return 'Пожалуйста, введите ваше имя';
    }
    if (nameValue.trim().length < 2) {
      return 'Имя должно содержать минимум 2 символа';
    }
    return '';
  };

  const validatePhone = (phoneNumber) => {
    if (!phoneNumber || phoneNumber === '+375') {
      return 'Пожалуйста, введите номер телефона';
    }
    if (!VALIDATION.PHONE_REGEX.test(phoneNumber)) {
      return 'Введите корректный номер телефона';
    }
    return '';
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    setNameError('');
    setSubmitError('');
  };

  const handlePhoneChange = (value) => {
    setPhone(value);
    setPhoneError('');
    setSubmitError('');
  };

  const handleSubmitInstallment = async () => {
    const nextNameError = validateName(name);
    const nextPhoneError = validatePhone(phone);

    if (nextNameError) setNameError(nextNameError);
    if (nextPhoneError) setPhoneError(nextPhoneError);
    if (nextNameError || nextPhoneError) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const formattedPhone = phone.replace(/[^\d+]/g, '');
      const productInfo = [
        `Город: ${city?.name || 'Минск'}`,
        `Товар: ${product.name}`,
        `Артикул: ${article}`,
        `Наличие: ${availabilityLabel}`,
        fullPrice > 0 ? `Цена: ${formatByn(fullPrice)}` : '',
        `Срок рассрочки: ${defaultTerm} мес.`,
        monthlyPayment > 0 ? `Платёж: от ${formatByn(monthlyPayment)} / мес` : '',
        showCityField(city, 'downPayment') &&
        city?.installmentTerms?.downPaymentPercent !== null &&
        city?.installmentTerms?.downPaymentPercent !== undefined
          ? `Первый платёж: от ${city.installmentTerms.downPaymentPercent}%`
          : '',
        product.description ? `Описание: ${product.description}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      const formData = {
        citySlug: city?.slug || 'minsk',
        FIELDS: {
          TITLE: `${isProductInStock ? 'Заявка на рассрочку' : 'Заявка под заказ'} - ${product.name}`,
          NAME: name.trim(),
          COMMENTS: `${isProductInStock ? 'Заявка на оформление рассрочки' : 'Заявка на товар под заказ'}\nГород: ${city?.name || 'Минск'}\n\n${productInfo}\n\nСогласие на обработку персональных данных: Да\nСогласие на рекламную рассылку каталога Вайбер: Да`,
          PHONE: [{ VALUE: formattedPhone, VALUE_TYPE: 'WORK' }],
          SOURCE_ID: 'WEB',
          SOURCE_DESCRIPTION: isProductInStock
            ? 'Оформление в рассрочку со страницы товара'
            : 'Заявка под заказ со страницы товара',
          STATUS_ID: 'NEW',
          OPENED: 'Y',
          TYPE_ID: 'CALLBACK',
          UTM_SOURCE: utm_source || '',
          UTM_MEDIUM: utm_medium || '',
          UTM_CAMPAIGN: utm_campaign || '',
          UTM_CONTENT: utm_content || '',
          UTM_TERM: (ad || '') + (ttclid || ''),
        },
      };

      const response = await axios.post('/api/quiz', formData);

      if (response.status === 429 || !response.data?.success) {
        setSubmitError('Форма уже отправлена. Попробуйте через минуту.');
        return;
      }

      trackCityEvent('installment_lead', {
        city: city?.slug || 'minsk',
        item_id: String(product.id),
        price: fullPrice || Number(product.price) || 0,
        currency: 'BYN',
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        handleCloseInstallmentModal();
      }, 2000);
    } catch (error) {
      console.error('Error submitting installment form:', error);
      if (error.response?.status === 429) {
        setSubmitError('Форма уже отправлена. Попробуйте через минуту.');
      } else {
        setSubmitError('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const cityPhone = cityCall(city);
  const showMinskDeliveryFallback = !city || city.isDefault || city.slug === 'minsk';
  const deliveryItems = (city?.deliveryMethods || []).map((method) => ({
    icon: <LocalShippingIcon color="primary" />,
    title: method.title,
    text: [
      method.eta,
      method.price > 0 ? `${method.price} BYN` : 'Бесплатно',
      showCityField(city, 'freeDelivery') && city?.freeDeliveryFrom ? `бесплатно от ${city.freeDeliveryFrom} BYN` : '',
    ].filter(Boolean).join('. '),
  }));
  const conditionItems = [
    ...(deliveryItems.length
      ? deliveryItems
      : showMinskDeliveryFallback
        ? [
            {
              icon: <LocalShippingIcon color="primary" />,
              title: 'Доставка по Минску',
              text: 'В день заказа или на следующий день, 10 BYN. Бесплатно от 1000 BYN.',
            },
          ]
        : []),
    {
      icon: <VerifiedUserIcon color="primary" />,
      title: 'Гарантия',
      text: 'Возврат в течение 14 дней.',
      href: '/guarantee',
    },
    {
      icon: <PaymentIcon color="primary" />,
      title: 'Оплата',
      text: (city?.paymentMethods || []).map((method) => method.title).join(', ') || 'Картой, наличными или в рассрочку.',
    },
  ];

  return (
    <Box sx={{ pb: { xs: 10, md: 0 } }}>
      <Box
        component="nav"
        aria-label="Хлебные крошки"
        sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 3, color: 'text.secondary' }}
      >
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <Box key={`${item.name}-${index}`} sx={{ display: 'flex', gap: 0.75 }}>
              {index > 0 && <Typography color="text.disabled">/</Typography>}
              {isLast || !item.url ? (
                <Typography color={isLast ? 'text.primary' : 'text.secondary'} sx={{ fontWeight: isLast ? 600 : 400 }}>
                  {item.name}
                </Typography>
              ) : (
                <Box
                  component={Link}
                  href={item.url}
                  sx={{ color: 'inherit', '&:hover': { color: 'primary.main' } }}
                >
                  {item.name}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <ProductImageGallery images={productImages} productName={product.name} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, lineHeight: 1.25, mb: 1.5 }}>
            {product.name}
          </Typography>
          {cityIntro ? (
            <Typography variant="body1" sx={{ mb: 1.5 }}>
              {cityIntro}
            </Typography>
          ) : describeDelivery(city) ? (
            <Typography variant="body1" sx={{ mb: 1.5 }}>
              {product.name} в рассрочку в {city?.nameIn || 'Минске'}. {describeDelivery(city)}
            </Typography>
          ) : null}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Артикул: {article}
          </Typography>
          <Chip
            label={availabilityLabel}
            color={isProductInStock ? 'success' : 'warning'}
            size="small"
            sx={{ mb: 2 }}
          />

          {fullPrice > 0 && (
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 0.5 }}>
              {formatByn(fullPrice)}
            </Typography>
          )}
          {monthlyPayment > 0 && (
            <Typography
              component="p"
              color="primary"
              sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', md: '2rem' }, lineHeight: 1.2, mb: 2 }}
            >
              от {formatByn(monthlyPayment)} / мес
            </Typography>
          )}

          <Stack spacing={1.25}>
            <Button
              variant="contained"
              size="large"
              onClick={handleOpenInstallmentModal}
              sx={{ height: 48, display: { xs: 'none', md: 'inline-flex' } }}
            >
              {requestActionLabel}
            </Button>
            {!isProductInStock && (
              <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
                Товара сейчас нет в наличии. Оставьте заявку — менеджер свяжется и согласует заказ.
              </Typography>
            )}
            <Stack direction="row" spacing={1}>
              <Button
                variant="text"
                color={isFavorite ? 'error' : 'primary'}
                startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                onClick={() => {
                  if (isFavorite) removeFromFavorites(product.id);
                  else addToFavorites(product.id);
                }}
                sx={{ height: 44 }}
              >
                В избранное
              </Button>
              <Button
                variant="text"
                startIcon={<CompareArrowsIcon />}
                onClick={() => {
                  if (isCompared) removeFromCompare(product.id);
                  else addToCompare(product);
                }}
                sx={{ height: 44 }}
              >
                {actionsMounted && isCompared ? 'В сравнении' : 'Сравнить'}
              </Button>
            </Stack>
            {cityPhone ? (
            <MuiLink
              href={`tel:${cityPhone.tel}`}
              underline="hover"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                mt: 0.5,
                minHeight: 32,
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              <PhoneIcon color="primary" fontSize="small" />
              {cityPhone.display}
              <Typography component="span" variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                консультация
              </Typography>
            </MuiLink>
            ) : null}
          </Stack>

          <Grid container spacing={1.5} sx={{ mt: 2 }}>
            {conditionItems.map((item) => (
              <Grid item xs={12} sm={6} key={item.title}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    height: '100%',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: '#fff',
                  }}
                >
                  <Stack direction="row" spacing={1.25} alignItems="flex-start">
                    {item.icon}
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {item.href ? (
                          <MuiLink component={Link} href={item.href} underline="hover" color="inherit">
                            {item.title}
                          </MuiLink>
                        ) : (
                          item.title
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.text}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
          {city?.name ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              Доставка для города {city.name}
            </Typography>
          ) : null}
          {city?.pickupPoints?.length > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Самовывоз: {city.pickupPoints.map((point) => point.address).join('; ')}
            </Typography>
          )}
        </Grid>
      </Grid>

      <Stack
        component="nav"
        aria-label="Разделы товара"
        direction="row"
        spacing={1}
        sx={{ mt: 5, mb: 2, flexWrap: 'wrap' }}
      >
        {SECTION_LINKS.map((section) => (
          <Button
            key={section.href}
            component="a"
            href={section.href}
            variant="text"
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            {section.label}
          </Button>
        ))}
      </Stack>

      <Box id="description" sx={{ scrollMarginTop: 96, mb: 4 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
          Описание
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
          {product.description || 'Описание товара скоро появится.'}
        </Typography>
        <ProductEducationalCopy product={product} />
      </Box>

      <Box id="specs" sx={{ scrollMarginTop: 96, mb: 4 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
          Характеристики
        </Typography>
        {specColumns.length > 0 ? (
          <Grid container spacing={2}>
            {specColumns.map((rows, index) => (
              <Grid item xs={12} md={6} key={index}>
                <SpecTable rows={rows} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary">Характеристики не указаны</Typography>
        )}
      </Box>

      <Box id="delivery" sx={{ scrollMarginTop: 96, mb: 5 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
          Доставка и возврат
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Доставка</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {(city?.deliveryMethods || []).map((method) => `${method.title} — ${method.eta}, ${method.price > 0 ? `${method.price} BYN` : 'бесплатно'}`).join('. ') || (showMinskDeliveryFallback ? 'По Минску — в день заказа или на следующий день, 10 BYN. По Беларуси — 1–3 рабочих дня, 15 BYN.' : '')}
              {showCityField(city, 'freeDelivery') && city?.freeDeliveryFrom ? ` Бесплатная доставка от ${city.freeDeliveryFrom} BYN.` : ''}
              {city?.pickupPoints?.length ? ` Самовывоз: ${city.pickupPoints.map((point) => point.address).join('; ')}.` : ''}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Возврат</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Товар можно вернуть в течение 14 дней. Условия обмена и гарантийного обслуживания — на странице{' '}
              <MuiLink component={Link} href="/guarantee" underline="hover">
                возврата товара
              </MuiLink>
              .
            </Typography>
          </Grid>
        </Grid>
        <ProductReviews />
      </Box>

      {similarProducts.length > 0 && (
        <Box component="section" aria-label="Похожие товары" sx={{ mb: 2 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
            Похожие товары
          </Typography>
          <Grid container spacing={2}>
            {similarProducts.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.id}>
                <CatalogProductCard product={item} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Dialog
        open={isInstallmentModalOpen}
        onClose={handleCloseInstallmentModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{requestDialogTitle}</Typography>
            <IconButton onClick={handleCloseInstallmentModal} aria-label="Закрыть">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Paper sx={{ p: 2, mb: 3, backgroundColor: 'grey.50' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <Box sx={{ position: 'relative', width: '100%', height: 100 }}>
                    <Image
                      src={productImages[0] || '/logo_techno_bar.svg'}
                      alt={product.name}
                      fill
                      style={{ objectFit: 'contain' }}
                      unoptimized
                    />
                  </Box>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  {monthlyPayment > 0 && (
                    <Typography variant="h6" color="primary">
                      от {formatByn(monthlyPayment)} / мес
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    Срок: {defaultTerm} мес.
                  </Typography>
                  {!isProductInStock && (
                    <Typography variant="body2" color="warning.main" sx={{ mt: 0.5 }}>
                      Нет в наличии, под заказ
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Paper>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                Введите ваше имя:
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ваше имя"
                value={name}
                onChange={handleNameChange}
                error={!!nameError}
                helperText={nameError}
                disabled={isSubmitting}
                sx={{ mb: 3 }}
              />

              <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                Введите ваш номер телефона для связи:
              </Typography>
              <MaskedPhoneInput
                value={phone}
                onChange={handlePhoneChange}
                error={phoneError}
                disabled={isSubmitting}
              />
            </Box>

            <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <input type="checkbox" checked readOnly style={{ marginTop: '4px', cursor: 'default' }} />
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                  Я даю согласие на обработку{' '}
                  <Link href="https://drive.google.com/file/d/1CnVnLe4imoDvch2mYWhJe4Mf7YhlcWbN/view">
                    персональных данных
                  </Link>{' '}
                  и согласие
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <input type="checkbox" checked readOnly style={{ marginTop: '4px', cursor: 'default' }} />
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                  <Link
                    href="https://docs.google.com/document/d/1OoYWjNIqx8ACmgL5YKGZflAA0gD_CEZl/edit"
                    target="_blank"
                  >
                    рекламную рассылку каталога Вайбер
                  </Link>
                </Typography>
              </Box>
            </Box>

            {submitSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Ваша заявка успешно отправлена! Мы скоро свяжемся с вами.
              </Alert>
            )}
            {submitError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {submitError}
              </Alert>
            )}

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button variant="outlined" onClick={handleCloseInstallmentModal} disabled={isSubmitting} fullWidth>
                Отмена
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmitInstallment}
                disabled={isSubmitting}
                fullWidth
                sx={{ minHeight: 48 }}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Отправить заявку'}
              </Button>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>

      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 'var(--shop-dock, 56px)',
          zIndex: 1100,
          bgcolor: '#fff',
          borderTop: '1px solid #E1E5EB',
          px: '20px',
          py: 1,
          gap: 1.5,
          alignItems: 'center',
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {fullPrice > 0 && (
            <Typography sx={{ fontWeight: 700, fontSize: 16 }}>{formatByn(fullPrice)}</Typography>
          )}
          {monthlyPayment > 0 && (
            <Typography sx={{ fontSize: 13, color: '#1D6FE8' }}>
              от {formatByn(monthlyPayment)} в месяц
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          onClick={handleOpenInstallmentModal}
          sx={{ minHeight: 44, flexShrink: 0 }}
        >
          {isProductInStock ? 'В рассрочку' : 'Оставить заявку'}
        </Button>
      </Box>
    </Box>
  );
}
