'use client';

import { useEffect, useState } from 'react';
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
} from '@mui/material';
import Image from 'next/image';
import { useCartStore } from '@/store/cart';
import { useRouter } from 'next/navigation';

// Регулярные выражения для валидации
const PHONE_REGEX = /^(\+375|375|80)?(29|25|44|33)(\d{3})(\d{2})(\d{2})$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const NAME_REGEX = /^[A-Za-zА-Яа-яЁё\s-]{2,50}$/;

const BITRIX24_WEBHOOK_URL =
  'https://technobar.bitrix24.by/rest/25/7fjyayckv4fkh0c2/crm.lead.add.json';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getCartTotal, clearCart } = useCartStore();
  const [activeStep, setActiveStep] = useState(0);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
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
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/');
    }
  }, [cartItems, router]);

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

  const sendToBitrix24 = async (orderData) => {
    try {
      const response = await fetch(BITRIX24_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            TITLE: `Заказ от ${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
            NAME: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
            EMAIL: [
              { VALUE: orderData.customerInfo.email, VALUE_TYPE: 'WORK' },
            ],
            PHONE: [
              { VALUE: orderData.customerInfo.phone, VALUE_TYPE: 'WORK' },
            ],
            ADDRESS: orderData.customerInfo.address,
            COMMENTS: `
                            Город: ${orderData.customerInfo.city}
                            Индекс: ${orderData.customerInfo.zipCode}
                            Товары:
                            ${orderData.items
                              .map(
                                (item) => `
                                ${item.name} - ${item.quantity} шт. x ${item.price} BYN
                            `
                              )
                              .join('')}
                            Итого: ${orderData.totalPrice} BYN
                        `,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при отправке заказа');
      }

      return await response.json();
    } catch (error) {
      throw new Error(
        'Не удалось отправить заказ. Пожалуйста, попробуйте позже.'
      );
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitError('');
      const orderData = {
        items: cartItems,
        totalPrice: getCartTotal(),
        customerInfo: data,
      };

      await sendToBitrix24(orderData).finally(() => {
        clearCart();
        router.push('/thank-you');
      });
    } catch (error) {
      setSubmitError(error.message);
    }
  };

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
                unoptimized
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
            label="Город"
            error={!!errors.city}
            helperText={errors.city?.message}
            {...register('city', {
              required: 'Город обязателен',
              minLength: {
                value: 2,
                message: 'Название города должно быть не менее 2 символов',
              },
            })}
          />
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
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
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
