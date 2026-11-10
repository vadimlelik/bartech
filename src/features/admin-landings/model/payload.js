// @ts-check

/**
 * @param {Record<string, unknown>} item
 * @returns {Record<string, unknown>}
 */
function withoutInternal(item) {
  const copy = { ...item };
  delete copy.fieldId;
  return copy;
}

/**
 * Пустой слот не отправляем: на сайте он рисовался бы пустым пунктом.
 * Непустые значения и дополнительные ключи старых записей сохраняются.
 * @param {import('./types').LandingFormValues} values
 */
export function toApiPayload(values) {
  const benefits = (values.benefits || [])
    .map((item) => (typeof item === 'string' ? item : item?.text || ''))
    .map((text) => text.trim())
    .filter((text) => text.length > 0);

  const advantages = (values.advantages || [])
    .map((item) => {
      const source = item && typeof item === 'object' ? withoutInternal(item) : {};
      return {
        ...source,
        title: typeof source.title === 'string' ? source.title : '',
        description: typeof source.description === 'string' ? source.description : '',
      };
    })
    .filter((item) => item.title.trim() || item.description.trim());

  const reviews = (values.reviews || [])
    .map((item) => {
      const source = item && typeof item === 'object' ? withoutInternal(item) : {};
      /** @type {Record<string, unknown>} */
      const review = {
        ...source,
        text: typeof source.text === 'string' ? source.text : '',
        image: typeof source.image === 'string' ? source.image : '',
      };
      delete review.author;
      delete review.rating;
      delete review.avatar;

      const author = typeof source.author === 'string' ? source.author.trim() : '';
      const avatar = typeof source.avatar === 'string' ? source.avatar.trim() : '';
      const rating = Number(source.rating);
      if (author) review.author = author;
      if (avatar) review.avatar = avatar;
      if (Number.isFinite(rating) && rating > 0) review.rating = Math.min(5, rating);

      return review;
    })
    .filter((review) => {
      const text = typeof review.text === 'string' ? review.text.trim() : '';
      const image = typeof review.image === 'string' ? review.image.trim() : '';
      const author = typeof review.author === 'string' ? review.author : '';
      const avatar = typeof review.avatar === 'string' ? review.avatar : '';
      const rating = Number(review.rating) || 0;
      return Boolean(text || image || author || avatar || rating);
    });

  const pixels = (values.pixels || [])
    .map((item) => (typeof item === 'string' ? item : item?.value || ''))
    .map((pixel) => pixel.trim())
    .filter((pixel) => pixel.length > 0);

  return {
    slug: values.slug.trim(),
    title: values.title.trim(),
    main_title: values.main_title?.trim() || null,
    description: values.description?.trim() || null,
    main_image: values.main_image?.trim() || null,
    secondary_image: values.secondary_image?.trim() || null,
    benefits,
    advantages,
    reviews,
    pixels,
    button_text: values.button_text?.trim() || 'Узнать цену',
    survey_text: values.survey_text?.trim() || null,
    colors: values.colors || {},
    styles: values.styles || {},
    is_active: values.is_active !== false,
  };
}
