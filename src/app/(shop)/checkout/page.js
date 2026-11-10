'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Alert,
  MenuItem,
} from '@mui/material';
import Image from 'next/image';
import { useCartStore } from '@/entities/cart';
import { useCity } from '@/entities/city';
import { deliveryFee, isLocalityServed, minOrderShortfall, orderGoodsTotal } from '@/entities/city/lib/delivery-rules';
import { useLocality } from '@/entities/locality/ui/LocalityProvider';
import { formatLocalityLabel } from '@/entities/locality/lib/selection';
import { resolveServiceCity } from '@/entities/locality/lib/service-city';
import { showCityField } from '@/entities/city/lib/city-content';
import { trackCityEvent } from '@/shared/ui/analytics/CityAnalytics';
import { useRouter } from 'next/navigation';

import { VALIDATION, CURRENCY } from '@/shared/config/constants';
import { shopTitleSx } from '@/shared/ui/shop-page/ShopPage';

const PHONE_REGEX = VALIDATION.PHONE_SIMPLE_REGEX;
const EMAIL_REGEX = VALIDATION.EMAIL_REGEX;
const NAME_REGEX = VALIDATION.NAME_REGEX;

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getCartTotal, clearCart, citySlug } = useCartStore();
  const { commerceCity, cities } = useCity();
  const { locality } = useLocality();
  const catalogCity = cities.find((city) => city.slug === (citySlug || commerceCity?.slug)) || commerceCity;
  const orderCity = resolveServiceCity(locality, cities, catalogCity);
  const [activeStep, setActiveStep] = useState(0);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    setValue,
    watch,
    trigger,
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      zipCode: '',
      deliveryMethodId: '',
      pickupPointId: '',
      paymentMethodId: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/');
    }
  }, [cartItems, router]);

  useEffect(() => {
    if (!orderCity?.slug) return;
    setValue('city', orderCity.name);
    trackCityEvent('begin_checkout', {
      city: orderCity.slug,
      value: orderGoodsTotal(cartItems),
      currency: 'BYN',
    });
    // Город заказа фиксируется при входе на страницу и при смене города, а не при правке корзины.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderCity?.slug, setValue]);

  const deliveryMethodId = watch('deliveryMethodId');
  const selectedDelivery = orderCity?.deliveryMethods?.find((method) => method.id === deliveryMethodId);
  const goodsTotal = orderGoodsTotal(cartItems);
  const shippingFee = deliveryFee(
    selectedDelivery,
    goodsTotal,
    showCityField(orderCity, 'freeDelivery') ? orderCity?.freeDeliveryFrom : null,
  );
  const shortfall = showCityField(orderCity, 'minOrder') ? minOrderShortfall(orderCity, goodsTotal) : 0;

  const steps = ['Корзина', 'Данные доставки', 'Подтверждение'];

  const handleNext = async () => {
    if (activeStep === 1) {
      const isFormValid = await trigger();
      if (!isFormValid) {
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setSubmitError('');
  };

  const sendOrder = async (orderData) => {
    const response = await fetch('/api/quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        citySlug: orderData.citySlug,
        FIELDS: {
          TITLE: `Заказ от ${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
          NAME: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
          EMAIL: [
            { VALUE: orderData.customerInfo.email, VALUE_TYPE: 'WORK' },
          ],
          PHONE: [
            { VALUE: orderData.customerInfo.phone, VALUE_TYPE: 'WORK' },
          ],
          ADDRESS: orderData.customerInfo.address,
          SOURCE_ID: 'WEB',
          SOURCE_DESCRIPTION: 'Оформление заказа в магазине',
          STATUS_ID: 'NEW',
          OPENED: 'Y',
          TYPE_ID: 'SALE',
          COMMENTS: [
            `Email: ${orderData.customerInfo.email}`,
            `Адрес: ${orderData.customerInfo.address}`,
            `Город заказа: ${orderData.cityName} (${orderData.citySlug})`,
            `Населённый пункт: ${orderData.customerInfo.city}`,
            orderData.selectedLocality ? `Выбранный населённый пункт: ${orderData.selectedLocality}` : '',
            `Получение: ${orderData.deliveryTitle || 'не выбрано'}`,
            orderData.pickupAddress ? `Пункт выдачи: ${orderData.pickupAddress}` : '',
            `Оплата: ${orderData.paymentTitle || 'не выбрано'}`,
            `Доставка: ${orderData.shippingFee} BYN`,
            `Индекс: ${orderData.customerInfo.zipCode}`,
            'Товары:',
            ...orderData.items.map(
              (item) => `${item.name} - ${item.quantity} шт. x ${item.price} BYN`,
            ),
            `Итого: ${orderData.totalPrice} BYN`,
            `Сумма товаров: ${orderData.goodsTotal} BYN`,
          ].filter(Boolean).join('\n'),
        },
      }),
    });

    if (response.status === 429) {
      throw new Error('Заказ уже отправлен. Попробуйте через минуту.');
    }

    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result?.success) {
      throw new Error('Не удалось отправить заказ. Пожалуйста, попробуйте позже.');
    }

    return result;
  };

  // Мемоизируем итоговую сумму
  const cartTotal = useMemo(() => getCartTotal(), [ getCartTotal]);

  const onSubmit = useCallback(async (data) => {
    try {
      setSubmitError('');
      setIsSubmitting(true);
      if (shortfall > 0) {
        setSubmitError(`Минимальная сумма заказа для ${orderCity?.name || 'города'} — ${orderCity.minOrderAmount} BYN. Не хватает ${shortfall} BYN.`);
        return;
      }
      if (!selectedDelivery) {
        setSubmitError('Выберите способ получения');
        return;
      }
      if (selectedDelivery.code === 'pickup' && !data.pickupPointId) {
        setSubmitError('Выберите пункт выдачи');
        return;
      }
      if (!isLocalityServed(orderCity, data.city)) {
        setSubmitError(`Адрес должен относиться к городу ${orderCity?.name} или к населённым пунктам, которые указаны для доставки этого города.`);
        return;
      }
      const pickup = orderCity?.pickupPoints?.find((point) => point.id === data.pickupPointId);
      const payment = orderCity?.paymentMethods?.find((method) => method.id === data.paymentMethodId);
      const orderData = {
        items: cartItems,
        totalPrice: cartTotal,
        goodsTotal,
        shippingFee,
        citySlug: orderCity?.slug || 'minsk',
        cityName: orderCity?.name || 'Минск',
        selectedLocality: locality?.id ? formatLocalityLabel(locality) : '',
        deliveryTitle: selectedDelivery?.title,
        pickupAddress: pickup?.address || '',
        paymentTitle: payment?.title || '',
        customerInfo: data,
      };

      await sendOrder(orderData);
      clearCart();
      router.push('/thank-you');
    } catch (error) {
      setSubmitError(error.message || 'Произошла ошибка при оформлении заказа');
    } finally {
      setIsSubmitting(false);
    }
  }, [cartItems, cartTotal, clearCart, goodsTotal, locality, orderCity, router, selectedDelivery, shippingFee, shortfall]);

  const renderCartItems = () => (
    <List>
      {cartItems.map((item) => (
        <ListItem key={item.id}>
          <ListItemAvatar>
            <Avatar>
                <Image
                  src={item.image}
                  alt={item.name}
                  width={40}
                  height={40}
                  style={{ objectFit: 'contain' }}
                  sizes="40px"
                  loading="lazy"
                />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={item.name}
            secondary={`${item.quantity} x ${item.price.toFixed(2)} BYN`}
          />
        </ListItem>
      ))}
    </List>
  );

  const renderDeliveryForm = () => (
    <Box component="form" noValidate sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Имя"
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            {...register('firstName', {
              required: 'Имя обязательно',
              pattern: {
                value: NAME_REGEX,
                message: 'Введите корректное имя',
              },
            })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Фамилия"
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            {...register('lastName', {
              required: 'Фамилия обязательна',
              pattern: {
                value: NAME_REGEX,
                message: 'Введите корректную фамилию',
              },
            })}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Email"
            type="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={isSubmitting}
            {...register('email', {
              required: 'Email обязателен',
              pattern: {
                value: EMAIL_REGEX,
                message: 'Введите корректный email',
              },
            })}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Телефон"
            error={!!errors.phone}
            helperText={errors.phone?.message}
            {...register('phone', {
              required: 'Телефон обязателен',
              pattern: {
                value: PHONE_REGEX,
                message: 'Введите корректный номер телефона',
              },
            })}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Адрес"
            error={!!errors.address}
            helperText={errors.address?.message}
            {...register('address', {
              required: 'Адрес обязателен',
              minLength: {
                value: 5,
                message: 'Адрес должен быть не менее 5 символов',
              },
            })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Населённый пункт"
            error={!!errors.city}
            helperText={errors.city?.message || `Доставка: ${orderCity?.name || 'Минск'}${showCityField(orderCity, 'localities') && orderCity?.deliveryLocalities?.length ? `, также ${orderCity.deliveryLocalities.join(', ')}` : ''}`}
            {...register('city', {
              required: 'Укажите населённый пункт',
              validate: (value) =>
                isLocalityServed(orderCity, value) ||
                `Пункт должен относиться к ${orderCity?.name || 'выбранному городу'} или его зоне доставки`,
            })}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            select
            required
            fullWidth
            label="Способ получения"
            defaultValue=""
            error={!!errors.deliveryMethodId}
            helperText={errors.deliveryMethodId?.message || (selectedDelivery ? `Стоимость доставки: ${shippingFee} BYN` : '')}
            {...register('deliveryMethodId', { required: 'Выберите способ получения' })}
          >
            {(orderCity?.deliveryMethods || []).map((method) => (
              <MenuItem key={method.id} value={method.id}>
                {method.title} — {method.eta}{method.price ? `, ${method.price} BYN` : ''}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {selectedDelivery?.code === 'pickup' && (
          <Grid item xs={12}>
            <TextField
              select
              required
              fullWidth
              label="Пункт выдачи"
              defaultValue=""
              {...register('pickupPointId', { required: 'Выберите пункт выдачи' })}
            >
              {(orderCity?.pickupPoints || []).map((point) => (
                <MenuItem key={point.id} value={point.id}>
                  {point.title}: {point.address}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Способ оплаты"
            defaultValue=""
            {...register('paymentMethodId')}
          >
            {(orderCity?.paymentMethods || []).map((method) => (
              <MenuItem key={method.id} value={method.id}>
                {method.title}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Индекс"
            error={!!errors.zipCode}
            helperText={errors.zipCode?.message}
            {...register('zipCode', {
              required: 'Индекс обязателен',
              pattern: {
                value: /^\d{6}$/,
                message: 'Введите корректный индекс (6 цифр)',
              },
            })}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderConfirmation = () => {
    const formData = getValues();
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Подтверждение заказа
        </Typography>
        <Typography variant="body1" paragraph>
          Пожалуйста, проверьте данные заказа:
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Данные доставки:
          </Typography>
          <Typography>
            {formData.firstName} {formData.lastName}
          </Typography>
          <Typography>{formData.email}</Typography>
          <Typography>{formData.phone}</Typography>
          <Typography>
            {formData.address}, {formData.city}, {formData.zipCode}
          </Typography>
          <Typography>
            {orderCity?.name}. {selectedDelivery?.title || 'Способ получения не выбран'}
            {shippingFee ? `, доставка ${shippingFee} BYN` : ''}
          </Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Товары:
          </Typography>
          {renderCartItems()}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">
            Итого: {getCartTotal().toFixed(2)} BYN
          </Typography>
        </Paper>
      </Box>
    );
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            {renderCartItems()}
            <Typography variant="h6" align="right">
              Итого: {getCartTotal().toFixed(2)} BYN
            </Typography>
          </>
        );
      case 1:
        return renderDeliveryForm();
      case 2:
        return renderConfirmation();
      default:
        return 'Неизвестный шаг';
    }
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <>
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
        <Typography component="h1" sx={shopTitleSx}>
          Оформление заказа
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Paper sx={{ p: 3 }}>
          {shortfall > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Минимальная сумма заказа для {orderCity?.name} — {orderCity.minOrderAmount} BYN. Сейчас {goodsTotal} BYN.
            </Alert>
          )}
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          {getStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Назад
              </Button>
            )}
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit(onSubmit)}
                disabled={!isValid}
              >
                Оформить заказ
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleNext}>
                Далее
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
}
