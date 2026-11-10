// @ts-check

import { isValidSlug } from './slug';

/**
 * @param {import('./types').LandingFormValues} values
 * @returns {Record<string, { type: string, message: string }>}
 */
export function landingFieldErrors(values) {
  /** @type {Record<string, { type: string, message: string }>} */
  const errors = {};
  const slug = values.slug?.trim() || '';
  const title = values.title?.trim() || '';

  if (!slug) {
    errors.slug = { type: 'required', message: 'Укажите slug' };
  } else if (!isValidSlug(slug)) {
    errors.slug = {
      type: 'pattern',
      message: 'Только латинские буквы, цифры и дефисы',
    };
  }

  if (!title) {
    errors.title = { type: 'required', message: 'Укажите название' };
  }

  return errors;
}

/**
 * Резолвер react-hook-form без дополнительных библиотек.
 * @param {import('./types').LandingFormValues} values
 */
export function landingResolver(values) {
  const errors = landingFieldErrors(values);
  if (Object.keys(errors).length > 0) {
    return { values: {}, errors };
  }
  return { values, errors: {} };
}
