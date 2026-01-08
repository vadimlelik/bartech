'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField } from '@mui/material';
import {
  QuizOverlay,
  QuizContainer,
  CloseButton,
  ProgressBarContainer,
  ProgressBar,
  QuestionContainer,
  InputContainer,
  RadioContainer,
  RadioLabel,
  CheckboxContainer,
  CheckboxLabel,
  ErrorText,
  Navigation,
  NavButton,
} from './QuizStyles';

const Quiz = ({
  isOpen,
  onClose,
  questions,
  onSubmit,
  title = '',
  isLoading,
}) => {
  const { control, handleSubmit, trigger, getValues, clearErrors } = useForm({
    shouldUnregister: false,
    mode: 'onTouched',
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [validationError, setValidationError] = useState('');
  const phoneInputRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Автофокус на поле телефона при переходе на вопрос с телефоном
  useEffect(() => {
    if (isOpen && questions[currentQuestion]?.type === 'text') {
      // Небольшая задержка для корректной установки фокуса после рендера
      const timer = setTimeout(() => {
        if (phoneInputRef.current) {
          phoneInputRef.current.focus();
          // Устанавливаем курсор после "+375"
          const cursorPosition = 4; // Позиция после "+375"
          try {
            phoneInputRef.current.setSelectionRange(cursorPosition, cursorPosition);
          } catch (e) {
            // Игнорируем ошибки установки курсора (может не поддерживаться в некоторых браузерах)
          }
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentQuestion, isOpen, questions]);

  // Обработчик изменения телефона
  const handlePhoneChange = (onChange, value) => {
    // Удаляем все символы кроме цифр и +
    const digits = value.replace(/[^\d+]/g, '');

    // Если начинается не с +375, устанавливаем +375
    if (!digits.startsWith('+375')) {
      onChange('+375');
      return;
    }

    // Ограничиваем длину до +375 + 9 цифр (всего 13 символов)
    if (digits.length <= 13) {
      onChange(digits);
    }
  };

  // Обработчик нажатия клавиш для защиты префикса +375
  const handlePhoneKeyDown = (e) => {
    // Запрещаем удаление префикса +375
    const cursorPosition = e.target.selectionStart;
    if (e.key === 'Backspace' && cursorPosition <= 4) {
      e.preventDefault();
    }
    // Запрещаем удаление в начале
    if (e.key === 'Delete' && cursorPosition < 4) {
      e.preventDefault();
    }
  };

  const goToQuestion = (index) => {
    setValidationError('');
    clearErrors();
    setCurrentQuestion(index);
  };

  const nextQuestion = async () => {
    const currentFieldName = `question${questions[currentQuestion].id}`;
    const isValid = await trigger(currentFieldName);

    if (!isValid) {
      setValidationError('Пожалуйста, ответьте на текущий вопрос.');
      return;
    }

    setValidationError('');
    if (currentQuestion < questions.length - 1) {
      goToQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      goToQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const allValid = await trigger();
    if (!allValid) {
      setValidationError('Пожалуйста, ответьте на все вопросы.');
      return;
    }

    handleSubmit(async (data) => {
      try {
        const formattedComments = questions
          .map((question) => {
            const answer = data[`question${question.id}`];
            if (!answer) return `${question.question}: Не указан`;

            if (question.type === 'checkbox') {
              const answers = Array.isArray(answer) ? answer : [answer];
              return `${question.question}: ${answers.join(', ')}`;
            }

            return `${question.question}: ${answer}`;
          })
          .join('\n');

        const phoneQuestion = questions.find((q) => q.type === 'text');
        const phoneNumber = phoneQuestion
          ? data[`question${phoneQuestion.id}`]
          : null;

        const formattedPhone = phoneNumber
          ? phoneNumber.replace(/[^\d+]/g, '')
          : '';

        const formData = {
          FIELDS: {
            TITLE: `Заявка на ПРОДАЖУ $$$ ${title}`,
            COMMENTS: formattedComments,
            PHONE: [{ VALUE: formattedPhone, VALUE_TYPE: 'WORK' }],
            SOURCE_ID: 'WEB',
            SOURCE_DESCRIPTION: `Quiz Form - ${title}`,
            STATUS_ID: 'NEW',
            OPENED: 'Y',
            TYPE_ID: 'CALLBACK',
            UF_CRM_1705470523: title,
          },
        };

        await onSubmit(formData);
      } catch {
        setValidationError(
          'Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.'
        );
      }
    })(e);
  };

  if (!isOpen) return null;

  const q = questions[currentQuestion];
  const fieldName = `question${q.id}`;

  return (
    <QuizOverlay>
      <QuizContainer>
        <CloseButton onClick={onClose}>✕</CloseButton>

        <ProgressBarContainer>
          <ProgressBar $progress={progress} />
        </ProgressBarContainer>

        <form onSubmit={handleFormSubmit}>
          <QuestionContainer>
            <h3>{q.question}</h3>

            <InputContainer>
              {/* ------ RADIO ------ */}
              {q.type === 'radio' && (
                <Controller
                  name={fieldName}
                  control={control}
                  defaultValue={getValues(fieldName) ?? ''}
                  rules={{ required: 'Это поле обязательно' }}
                  render={({ field }) => (
                    <>
                      {q.options.map((option) => (
                        <RadioContainer key={option.value}>
                          <RadioLabel
                            $isChecked={field.value === option.value}
                            onClick={() => {
                              field.onChange(option.value);
                              clearErrors(fieldName);
                              setValidationError('');
                              if (currentQuestion < questions.length - 1) {
                                goToQuestion(currentQuestion + 1);
                              }
                            }}
                          >
                            {option.label}
                          </RadioLabel>
                        </RadioContainer>
                      ))}
                    </>
                  )}
                />
              )}

              {/* ------ CHECKBOX ------ */}
              {q.type === 'checkbox' && (
                <Controller
                  name={fieldName}
                  control={control}
                  defaultValue={getValues(fieldName) ?? []}
                  rules={{ required: 'Это поле обязательно' }}
                  render={({ field }) => (
                    <>
                      {q.options.map((option) => {
                        const valueArray = Array.isArray(field.value)
                          ? field.value
                          : [];
                        const isChecked = valueArray.includes(option.value);

                        return (
                          <CheckboxContainer key={option.value}>
                            <CheckboxLabel
                              $isChecked={isChecked}
                              onClick={() => {
                                const newValue = isChecked
                                  ? valueArray.filter((v) => v !== option.value)
                                  : [...valueArray, option.value];
                                field.onChange(newValue);
                                clearErrors(fieldName);
                                setValidationError('');
                              }}
                            >
                              {option.label}
                            </CheckboxLabel>
                          </CheckboxContainer>
                        );
                      })}
                    </>
                  )}
                />
              )}

              {/* ------ PHONE ------ */}
              {q.type === 'text' && (
                <Controller
                  name={fieldName}
                  control={control}
                  defaultValue={getValues(fieldName) || '+375'}
                  rules={{
                    required: 'Пожалуйста, ответьте на вопрос.',
                    pattern: {
                      value: /^\+375\d{9}$/,
                      message: 'Телефон должен быть в формате +375XXXXXXXXX',
                    },
                    validate: (value) => {
                      if (!value || value === '+375')
                        return 'Пожалуйста, ответьте на вопрос.';
                      if (!/^\+375\d{9}$/.test(value)) {
                        return 'Телефон должен быть в формате +375XXXXXXXXX';
                      }
                      return true;
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      inputRef={phoneInputRef}
                      variant="outlined"
                      type="tel"
                      slotProps={{
                        input: {
                          inputMode: 'numeric',
                          pattern: '[0-9+]*',
                        },
                      }}
                      placeholder="+375XXXXXXXXX"
                      value={field.value || '+375'}
                      onChange={(e) => {
                        handlePhoneChange(field.onChange, e.target.value);
                        clearErrors(fieldName);
                        setValidationError('');
                      }}
                      onKeyDown={handlePhoneKeyDown}
                      error={
                        !!(
                          validationError ||
                          (fieldState.error?.message &&
                            !/^\+375\d{9}$/.test(field.value))
                        )
                      }
                      helperText={
                        validationError ||
                        (fieldState.error?.message &&
                          !/^\+375\d{9}$/.test(field.value) &&
                          fieldState.error.message)
                      }
                      disabled={isLoading}
                      sx={{ width: '100%' }}
                    />
                  )}
                />
              )}
            </InputContainer>

            {validationError && currentQuestion < questions.length - 1 && (
              <ErrorText>{validationError}</ErrorText>
            )}

            {currentQuestion === questions.length - 1 && (
              <div
                style={{
                  marginTop: '15px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                }}
              >
                <Controller
                  name="consent"
                  control={control}
                  defaultValue={true}
                  render={() => (
                    <>
                      <input
                        type="checkbox"
                        checked={true}
                        readOnly
                        style={{ marginTop: '4px', cursor: 'default' }}
                      />
                      <span
                        style={{
                          fontSize: '14px',
                          color: '#666',
                          lineHeight: '1.4',
                        }}
                      >
                        Даю согласие на обработку персональных данных
                      </span>
                    </>
                  )}
                />
              </div>
            )}
          </QuestionContainer>

          <Navigation
            style={{
              display: 'flex',
              gap: '12px',
            }}
          >
            {currentQuestion > 0 && (
              <NavButton
                type="button"
                onClick={prevQuestion}
                disabled={isLoading}
              >
                Назад
              </NavButton>
            )}
            {currentQuestion < questions.length - 1 ? (
              <NavButton
                type="button"
                onClick={nextQuestion}
                disabled={isLoading}
              >
                Далее
              </NavButton>
            ) : (
              <NavButton type="submit" disabled={isLoading}>
                {isLoading ? 'Отправка...' : 'Отправить'}
              </NavButton>
            )}
          </Navigation>
        </form>
      </QuizContainer>
    </QuizOverlay>
  );
};

export default Quiz;
