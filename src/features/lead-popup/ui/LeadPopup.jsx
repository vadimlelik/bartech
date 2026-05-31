'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useLeadPopupTrigger } from '../lib/useLeadPopupTrigger';
import { PHONE_REGEX } from '../lib/constants';
import {
  PopupOverlay,
  PopupContainer,
  CloseButton,
  PopupTitle,
  PopupText,
  PopupHighlight,
  PhoneInput,
  ErrorText,
  SubmitButton,
  PrivacyNote,
  SuccessMessage,
} from './LeadPopupStyles';

const NON_DIGIT_PLUS = /[^\d+]/g;

const phoneFieldRules = {
  required: 'Укажите номер телефона',
  validate: (value) => {
    if (!value || value === '+375') {
      return 'Укажите номер телефона';
    }
    if (!PHONE_REGEX.test(value)) {
      return 'Формат: +375XXXXXXXXX';
    }
    return true;
  },
};

export default function LeadPopup() {
  const { isOpen, dismiss, markSubmitted } = useLeadPopupTrigger();
  const params = useSearchParams();
  const phoneInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { control, handleSubmit } = useForm({
    defaultValues: { phone: '+375' },
    mode: 'onTouched',
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !isSuccess) {
      const timer = window.setTimeout(() => {
        phoneInputRef.current?.focus();
        try {
          phoneInputRef.current?.setSelectionRange(4, 4);
        } catch {
          // ignore
        }
      }, 150);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [isOpen, isSuccess]);

  const handlePhoneChange = useCallback((onChange, value) => {
    const digits = value.replace(NON_DIGIT_PLUS, '');

    if (!digits.startsWith('+375')) {
      onChange('+375');
      return;
    }

    if (digits.length <= 13) {
      onChange(digits);
    }
  }, []);

  const handlePhoneKeyDown = useCallback((e) => {
    const cursorPosition = e.target.selectionStart;
    if (e.key === 'Backspace' && cursorPosition <= 4) {
      e.preventDefault();
    }
    if (e.key === 'Delete' && cursorPosition < 4) {
      e.preventDefault();
    }
  }, []);

  const onSubmit = async ({ phone }) => {
    setIsLoading(true);
    setSubmitError('');

    const formattedPhone = phone.replace(NON_DIGIT_PLUS, '');
    const pagePath =
      typeof window !== 'undefined' ? window.location.pathname : '';

    try {
      const response = await axios.post('/api/quiz', {
        FIELDS: {
          TITLE: 'Заявка — не нашли модель (всплывающее окно)',
          COMMENTS: `Пользователь оставил номер через всплывающее окно на странице: ${pagePath}`,
          PHONE: [{ VALUE: formattedPhone, VALUE_TYPE: 'WORK' }],
          SOURCE_ID: 'WEB',
          SOURCE_DESCRIPTION: 'Lead Popup — callback request',
          STATUS_ID: 'NEW',
          OPENED: 'Y',
          TYPE_ID: 'CALLBACK',
          UTM_SOURCE: params.get('utm_source') || '',
          UTM_MEDIUM: params.get('utm_medium') || '',
          UTM_CAMPAIGN: params.get('utm_campaign') || '',
          UTM_CONTENT: params.get('utm_content') || '',
          UTM_TERM: (params.get('ad') || '') + (params.get('ttclid') || ''),
        },
      });

      if (response.data?.success) {
        markSubmitted();
        setIsSuccess(true);
        window.setTimeout(() => dismiss(), 3000);
      } else {
        setSubmitError('Попробуйте отправить заявку через минуту.');
      }
    } catch (error) {
      if (error.response?.status === 429) {
        setSubmitError('Заявка уже отправлена. Попробуйте через минуту.');
      } else {
        setSubmitError('Не удалось отправить заявку. Попробуйте ещё раз.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      dismiss();
    }
  };

  if (!isOpen) return null;

  return (
    <PopupOverlay onClick={handleOverlayClick}>
      <PopupContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton type="button" onClick={dismiss} aria-label="Закрыть">
          ✕
        </CloseButton>

        {isSuccess ? (
          <SuccessMessage>
            <h3>Заявка принята!</h3>
            <p>Менеджер свяжется с вами в течение 15 минут.</p>
          </SuccessMessage>
        ) : (
          <>
            <PopupTitle>Не нашли нужную модель?</PopupTitle>
            <PopupText>
              В нашем каталоге более 10&nbsp;000 товаров — подберём нужную
              технику и поможем оформить рассрочку без переплат.
            </PopupText>
            <PopupHighlight>
              Оставьте номер — перезвоним в течение 15 минут
            </PopupHighlight>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Controller
                name="phone"
                control={control}
                rules={phoneFieldRules}
                render={({ field, fieldState }) => (
                  <>
                    <PhoneInput
                      {...field}
                      ref={phoneInputRef}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+375 XX XXX-XX-XX"
                      onChange={(e) =>
                        handlePhoneChange(field.onChange, e.target.value)
                      }
                      onKeyDown={handlePhoneKeyDown}
                      aria-invalid={!!fieldState.error}
                    />
                    {fieldState.error && (
                      <ErrorText>{fieldState.error.message}</ErrorText>
                    )}
                  </>
                )}
              />

              {submitError && <ErrorText>{submitError}</ErrorText>}

              <SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? 'Отправка…' : 'Перезвоните мне'}
              </SubmitButton>

              <PrivacyNote>
                Нажимая кнопку, вы соглашаетесь с{' '}
                <Link href="/privacy" onClick={dismiss}>
                  политикой конфиденциальности
                </Link>
              </PrivacyNote>
            </form>
          </>
        )}
      </PopupContainer>
    </PopupOverlay>
  );
}
