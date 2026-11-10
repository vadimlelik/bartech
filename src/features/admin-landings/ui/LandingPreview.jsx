'use client';

import { Box, Typography } from '@mui/material';

/**
 * @param {unknown} value
 * @returns {string}
 */
function textOf(value) {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'text' in value && typeof value.text === 'string') {
    return value.text;
  }
  return '';
}

/**
 * Упрощённый макет публичной страницы. Обновляется от текущих значений формы.
 * @param {{ values: import('../model/types').LandingFormValues }} props
 */
export default function LandingPreview({ values }) {
  const colors = values?.colors || {};
  const headerBg = colors.header || '#1a1a1a';
  const buttonBg = colors.button || '#4caf50';
  const background = colors.background || '#ffffff';
  const textColor = colors.textColor || '#1a1a1a';
  const benefits = (values?.benefits || []).map(textOf).filter(Boolean);
  const advantages = values?.advantages || [];
  const reviews = values?.reviews || [];
  const title = values?.main_title || values?.title || 'Заголовок лендинга';

  return (
    <Box>
      <Typography variant="overline" color="text.secondary">
        Предпросмотр
      </Typography>
      <Box
        sx={{
          mt: 1,
          borderRadius: 2,
          overflow: 'hidden',
          border: 1,
          borderColor: 'divider',
          bgcolor: background,
          color: textColor,
        }}
      >
        <Box sx={{ bgcolor: headerBg, color: '#fff', px: 2, py: 2.5 }}>
          <Typography variant="h6" sx={{ color: 'inherit', fontWeight: 700 }}>
            {title}
          </Typography>
          {values?.description ? (
            <Typography variant="body2" sx={{ color: 'inherit', opacity: 0.85, mt: 1 }}>
              {values.description}
            </Typography>
          ) : null}
        </Box>

        <Box sx={{ display: 'grid', gap: 2, p: 2 }}>
          <Box>
            {benefits.length > 0 ? (
              <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                {benefits.map((benefit, index) => (
                  <Typography component="li" variant="body2" key={`${benefit}-${index}`} sx={{ whiteSpace: 'pre-wrap' }}>
                    {benefit}
                  </Typography>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Преимущества появятся здесь
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
              До конца акции осталось
            </Typography>
            {values?.survey_text ? (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {values.survey_text}
              </Typography>
            ) : null}
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                mt: 1.5,
                px: 2,
                py: 1,
                borderRadius: 1,
                bgcolor: buttonBg,
                color: '#fff',
                fontWeight: 600,
              }}
            >
              {values?.button_text || 'Узнать цену'}
            </Box>
          </Box>

          {values?.main_image ? (
            <Box
              component="img"
              src={values.main_image}
              alt=""
              sx={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 1, bgcolor: 'action.hover' }}
            />
          ) : (
            <Box sx={{ height: 96, borderRadius: 1, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Главное изображение
              </Typography>
            </Box>
          )}
        </Box>

        {(advantages.length > 0 || values?.secondary_image) && (
          <Box sx={{ px: 2, pb: 2, display: 'grid', gap: 1.5 }}>
            <Typography variant="subtitle2">Преимущества нашего магазина</Typography>
            {values?.secondary_image ? (
              <Box
                component="img"
                src={values.secondary_image}
                alt=""
                sx={{ width: '100%', maxHeight: 140, objectFit: 'cover', borderRadius: 1 }}
              />
            ) : null}
            {advantages.map((advantage, index) => (
              <Box key={`${advantage?.title || 'advantage'}-${index}`}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {index + 1}. {advantage?.title || advantage?.name || 'Без заголовка'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {advantage?.description || advantage?.desc || ''}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {reviews.length > 0 && (
          <Box sx={{ px: 2, pb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Отзывы
            </Typography>
            <Box sx={{ display: 'grid', gap: 1 }}>
              {reviews.map((review, index) => {
                const rating = Number(review?.rating) || 0;
                return (
                  <Box key={`${review?.author || 'review'}-${index}`} sx={{ p: 1.5, borderRadius: 1, bgcolor: 'action.hover' }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.5 }}>
                      {review?.avatar ? (
                        <Box
                          component="img"
                          src={review.avatar}
                          alt=""
                          sx={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : null}
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {review?.author || 'Покупатель'}
                        </Typography>
                        {rating > 0 ? (
                          <Typography variant="caption" aria-label={`Оценка ${rating} из 5`}>
                            {'★'.repeat(rating)}
                            {'☆'.repeat(5 - rating)}
                          </Typography>
                        ) : null}
                      </Box>
                    </Box>
                    {review?.image ? (
                      <Box
                        component="img"
                        src={review.image}
                        alt=""
                        sx={{ width: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 1, mb: 0.5 }}
                      />
                    ) : null}
                    <Typography variant="body2">{review?.text || review?.comment || 'Текст отзыва'}</Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
