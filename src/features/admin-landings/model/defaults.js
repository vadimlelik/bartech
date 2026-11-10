// @ts-check

/**
 * @returns {import('./types').LandingColors}
 */
export function defaultColors() {
  return {
    header: '#1a1a1a',
    button: '#4caf50',
    buttonHover: '#45a049',
    background: '#ffffff',
    textColor: '#1a1a1a',
    bodyBackground: '#ffffff',
  };
}

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/**
 * @param {unknown} value
 * @returns {unknown[]}
 */
function asArray(value) {
  return Array.isArray(value) ? value : [];
}

/**
 * @returns {import('./types').LandingFormValues}
 */
export function emptyLandingForm() {
  return {
    slug: '',
    title: '',
    main_title: '',
    description: '',
    main_image: '',
    secondary_image: '',
    benefits: [],
    advantages: [],
    reviews: [],
    pixels: [],
    button_text: 'Узнать цену',
    survey_text: '',
    colors: defaultColors(),
    styles: {},
    is_active: true,
  };
}

/**
 * @param {import('./types').LandingRecord} landing
 * @returns {import('./types').LandingFormValues}
 */
export function landingToForm(landing) {
  return {
    slug: landing.slug || '',
    title: landing.title || '',
    main_title: landing.main_title || '',
    description: landing.description || '',
    main_image: landing.main_image || '',
    secondary_image: landing.secondary_image || '',
    benefits: asArray(landing.benefits).map((benefit) => {
      if (typeof benefit === 'string') return { text: benefit };
      if (isRecord(benefit) && typeof benefit.text === 'string') {
        return { text: benefit.text };
      }
      return { text: '' };
    }),
    advantages: asArray(landing.advantages).map((advantage) => {
      const source = isRecord(advantage) ? advantage : {};
      const title = typeof source.title === 'string' ? source.title : '';
      const name = typeof source.name === 'string' ? source.name : '';
      const description = typeof source.description === 'string' ? source.description : '';
      const desc = typeof source.desc === 'string' ? source.desc : '';
      return {
        ...source,
        title: title || name,
        description: description || desc,
      };
    }),
    reviews: asArray(landing.reviews).map((review) => {
      const source = isRecord(review) ? review : {};
      const text = typeof source.text === 'string' ? source.text : '';
      const comment = typeof source.comment === 'string' ? source.comment : '';
      const rating = Number(source.rating);
      return {
        ...source,
        text: text || comment,
        image: typeof source.image === 'string' ? source.image : '',
        author: typeof source.author === 'string' ? source.author : '',
        avatar: typeof source.avatar === 'string' ? source.avatar : '',
        rating: Number.isFinite(rating) ? Math.min(5, Math.max(0, rating)) : 0,
      };
    }),
    pixels: asArray(landing.pixels).map((pixel) => ({
      value: typeof pixel === 'string' ? pixel : '',
    })),
    button_text: landing.button_text || 'Узнать цену',
    survey_text: landing.survey_text || '',
    colors: {
      ...defaultColors(),
      ...(isRecord(landing.colors) ? landing.colors : {}),
    },
    styles: isRecord(landing.styles) ? { ...landing.styles } : {},
    is_active: landing.is_active !== false,
  };
}

/**
 * @param {import('./types').LandingRecord} landing
 * @returns {import('./types').LandingFormValues}
 */
export function duplicateLandingForm(landing) {
  const form = landingToForm(landing);
  return {
    ...form,
    slug: form.slug ? `${form.slug}-copy` : 'copy',
    title: form.title ? `${form.title} (копия)` : 'Копия',
  };
}
