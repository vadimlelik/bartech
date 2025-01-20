'use client';
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import MaskedPhoneInput from '@/app/(shop)/components/InputMask/InputMask';
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

const Quiz = ({ isOpen, onClose, questions, onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useForm();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const watchedFields = watch();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleFieldInteraction = () => {
    setValidationError('');
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
      setCurrentQuestion(currentQuestion + 1);
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
      setIsSubmitting(true);
      setValidationError('');

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

        const pageUrl = window.location.pathname;
        const pageName = pageUrl.split('/').filter(Boolean).pop();

        const formData = {
          fields: {
            TITLE: `Заявка на телефон (${pageName})`,
            COMMENTS: formattedComments,
            PHONE: [{ VALUE: formattedPhone, VALUE_TYPE: 'WORK' }],
            SOURCE_ID: 'WEB',
            SOURCE_DESCRIPTION: `Quiz Form - ${pageName}`,
            STATUS_ID: 'NEW',
            OPENED: 'Y',
            TYPE_ID: 'CALLBACK',
            UF_CRM_1705470523: pageUrl,
          },
        };

        await onSubmit(formData);
      } catch (error) {
        setValidationError(
          'Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.'
        );
      } finally {
        setIsSubmitting(false);
      }
    })(e);
  };

  if (!isOpen) return null;

  return (
    <QuizOverlay>
      <QuizContainer>
        <CloseButton onClick={onClose}>✕</CloseButton>

        <ProgressBarContainer>
          <ProgressBar $progress={progress} />
        </ProgressBarContainer>

        <form onSubmit={handleFormSubmit}>
          <QuestionContainer>
            <h3>{questions[currentQuestion].question}</h3>
            <InputContainer>
              {questions[currentQuestion].type === 'radio' ? (
                questions[currentQuestion].options.map((option) => (
                  <RadioContainer key={option.value}>
                    <Controller
                      name={`question${questions[currentQuestion].id}`}
                      control={control}
                      defaultValue=""
                      rules={{ required: 'Это поле обязательно' }}
                      render={({ field }) => (
                        <RadioLabel
                          $isChecked={field.value === option.value}
                          onClick={() => {
                            handleFieldInteraction();
                            field.onChange(option.value);
                          }}
                        >
                          {option.label}
                        </RadioLabel>
                      )}
                    />
                  </RadioContainer>
                ))
              ) : questions[currentQuestion].type === 'checkbox' ? (
                questions[currentQuestion].options.map((option) => (
                  <CheckboxContainer key={option.value}>
                    <Controller
                      name={`question${questions[currentQuestion].id}`}
                      control={control}
                      defaultValue={[]}
                      rules={{ required: 'Это поле обязательно' }}
                      render={({ field }) => {
                        const isChecked = field.value.includes(option.value);
                        return (
                          <CheckboxLabel
                            $isChecked={isChecked}
                            onClick={() => {
                              handleFieldInteraction();
                              const newValue = isChecked
                                ? field.value.filter((v) => v !== option.value)
                                : [...field.value, option.value];
                              field.onChange(newValue);
                            }}
                          >
                            {option.label}
                          </CheckboxLabel>
                        );
                      }}
                    />
                  </CheckboxContainer>
                ))
              ) : (
                <Controller
                  name={`question${questions[currentQuestion].id}`}
                  control={control}
                  defaultValue=""
                  rules={{
                    validate: (value) => {
                      if (!value || value === '+375')
                        return 'Пожалуйста, ответьте на все вопрос.';
                      if (
                        !/^\+375\s\(\d{2}\)\s\d{3}-\d{2}-\d{2}$/.test(value)
                      ) {
                        return 'Введите корректный номер телефона';
                      }
                      return true;
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <MaskedPhoneInput
                      mask="+375 (99) 999-99-99"
                      placeholder="+375 (__) ___-__-__"
                      value={field.value || '+375'}
                      onChange={(e) => {
                        handleFieldInteraction();
                        field.onChange(e);
                        if (/^\+375\s\(\d{2}\)\s\d{3}-\d{2}-\d{2}$/.test(e)) {
                          setValidationError('');
                        }
                      }}
                      onBlur={(e) => {
                        field.onBlur();
                        if (!e.target.value || e.target.value === '+375') {
                          setValidationError(
                            'Пожалуйста, ответьте на все вопрос.'
                          );
                        } else if (
                          /^\+375\s\(\d{2}\)\s\d{3}-\d{2}-\d{2}$/.test(
                            e.target.value
                          )
                        ) {
                          setValidationError('');
                        }
                      }}
                      error={
                        validationError ||
                        (fieldState.error?.message &&
                          !/^\+375\s\(\d{2}\)\s\d{3}-\d{2}-\d{2}$/.test(
                            field.value
                          ))
                      }
                      disabled={isSubmitting}
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
                  render={({ field: { value } }) => (
                    <>
                      <input
                        type="checkbox"
                        checked={true}
                        readOnly
                        style={{
                          marginTop: '4px',
                          cursor: 'default',
                        }}
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
          <Navigation>
            {currentQuestion < questions.length - 1 ? (
              <NavButton
                type="button"
                onClick={nextQuestion}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Подождите...' : 'Далее'}
              </NavButton>
            ) : (
              <NavButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Отправка...' : 'Отправить'}
              </NavButton>
            )}
          </Navigation>
        </form>
      </QuizContainer>
    </QuizOverlay>
  );
};

export default Quiz;
