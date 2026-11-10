'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import MaskedPhoneInput from '@/shared/ui/input-mask/InputMask';
import { VALIDATION } from '@/shared/config/constants';
import { formatByn, getFullPrice, getMonthlyPayment } from '@/entities/product/lib/pricing';
import { useCity } from '@/entities/city';
import { showCityField } from '@/entities/city/lib/city-content';
import { trackCityEvent } from '@/shared/ui/analytics/CityAnalytics';

export default function InstallmentRequestDialog({ open, onClose, product }) {
  const { commerceCity } = useCity();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+375');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const monthly = getMonthlyPayment(product);
  const fullPrice = getFullPrice(product);
  const city = commerceCity;

  const close = () => {
    setName('');
    setPhone('+375');
    setNameError('');
    setPhoneError('');
    setSubmitError('');
    setSubmitSuccess(false);
    onClose();
  };

  const submit = async () => {
    const nextNameError = !name.trim()
      ? 'Пожалуйста, введите ваше имя'
      : name.trim().length < 2
        ? 'Имя должно содержать минимум 2 символа'
        : '';
    const nextPhoneError = !phone || phone === '+375'
      ? 'Пожалуйста, введите номер телефона'
      : !VALIDATION.PHONE_REGEX.test(phone)
        ? 'Введите корректный номер телефона'
        : '';
    setNameError(nextNameError);
    setPhoneError(nextPhoneError);
    if (nextNameError || nextPhoneError) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const productInfo = [
        `Город: ${city?.name || 'Минск'}`,
        `Товар: ${product.name}`,
        fullPrice > 0 ? `Цена: ${formatByn(fullPrice)}` : '',
        monthly > 0 ? `Платёж: от ${formatByn(monthly)} / мес` : '',
        showCityField(city, 'downPayment') &&
        city?.installmentTerms?.downPaymentPercent !== null &&
        city?.installmentTerms?.downPaymentPercent !== undefined
          ? `Первый платёж: от ${city.installmentTerms.downPaymentPercent}%`
          : '',
      ]
        .filter(Boolean)
        .join('\n');

      const response = await axios.post('/api/quiz', {
        citySlug: city?.slug || 'minsk',
        FIELDS: {
          TITLE: `Заявка на рассрочку - ${product.name}`,
          NAME: name.trim(),
          COMMENTS: `Заявка на оформление рассрочки\nГород: ${city?.name || 'Минск'}\n\n${productInfo}\n\nСогласие на обработку персональных данных: Да\nСогласие на рекламную рассылку каталога Вайбер: Да`,
          PHONE: [{ VALUE: phone.replace(/[^\d+]/g, ''), VALUE_TYPE: 'WORK' }],
          SOURCE_ID: 'WEB',
          SOURCE_DESCRIPTION: 'Оформление в рассрочку с карточки товара',
          STATUS_ID: 'NEW',
          OPENED: 'Y',
          TYPE_ID: 'CALLBACK',
        },
      });

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
      setTimeout(close, 1600);
    } catch (error) {
      if (error.response?.status === 429) {
        setSubmitError('Форма уже отправлена. Попробуйте через минуту.');
      } else {
        setSubmitError('Не удалось отправить заявку. Попробуйте ещё раз.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={close} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6">Оформить в рассрочку</Typography>
          <IconButton onClick={close} aria-label="Закрыть" disabled={isSubmitting}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <Typography sx={{ fontWeight: 700, mb: 0.5 }}>{product?.name}</Typography>
          {monthly > 0 && (
            <Typography color="primary" sx={{ fontWeight: 700, mb: 2 }}>
              от {formatByn(monthly)} в месяц
            </Typography>
          )}
          <TextField
            fullWidth
            label="Имя"
            placeholder="Ваше имя"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setNameError('');
            }}
            error={!!nameError}
            helperText={nameError}
            disabled={isSubmitting}
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" sx={{ mb: 1 }}>
            Телефон для связи
          </Typography>
          <MaskedPhoneInput
            value={phone}
            onChange={(value) => {
              setPhone(value);
              setPhoneError('');
            }}
            error={phoneError}
            disabled={isSubmitting}
          />
          <Stack spacing={1.25} sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Нажимая «Отправить заявку», вы даёте согласие на обработку{' '}
              <Link href="https://drive.google.com/file/d/1CnVnLe4imoDvch2mYWhJe4Mf7YhlcWbN/view" target="_blank">
                персональных данных
              </Link>{' '}
              и на{' '}
              <Link
                href="https://docs.google.com/document/d/1OoYWjNIqx8ACmgL5YKGZflAA0gD_CEZl/edit"
                target="_blank"
              >
                рекламную рассылку каталога в Viber
              </Link>
              .
            </Typography>
          </Stack>
          {submitSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Заявка отправлена. Мы скоро свяжемся с вами.
            </Alert>
          )}
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          <Button variant="contained" fullWidth onClick={submit} disabled={isSubmitting} sx={{ minHeight: 48 }}>
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Отправить заявку'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
