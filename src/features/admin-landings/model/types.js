/**
 * Типы данных лендинга в админке.
 * Проект на JavaScript (eslint разрешает JSX только в .js/.jsx),
 * поэтому контракт описан JSDoc и проверяется через @ts-check. `any` не используется.
 */

/**
 * @typedef {Object} LandingColors
 * @property {string} [header]
 * @property {string} [button]
 * @property {string} [buttonHover]
 * @property {string} [background]
 * @property {string} [textColor]
 * @property {string} [bodyBackground]
 */

/**
 * @typedef {Object} LandingAdvantage
 * @property {string} [title]
 * @property {string} [description]
 * @property {string} [name]
 * @property {string} [desc]
 */

/**
 * Отзыв. `text` и `image` читает публичная страница.
 * `author`, `rating` и `avatar` — дополнительные поля, старые отзывы их не содержат.
 * @typedef {Object} LandingReview
 * @property {string} [text]
 * @property {string} [comment]
 * @property {string} [image]
 * @property {string} [author]
 * @property {number} [rating]
 * @property {string} [avatar]
 */

/**
 * @typedef {Object} LandingRecord
 * @property {number} id
 * @property {string} slug
 * @property {string} title
 * @property {string|null} [main_title]
 * @property {string|null} [description]
 * @property {string|null} [main_image]
 * @property {string|null} [secondary_image]
 * @property {string[]} [benefits]
 * @property {LandingAdvantage[]} [advantages]
 * @property {LandingReview[]} [reviews]
 * @property {string[]} [pixels]
 * @property {string|null} [button_text]
 * @property {string|null} [survey_text]
 * @property {LandingColors} [colors]
 * @property {Record<string, unknown>} [styles]
 * @property {boolean} [is_active]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} BenefitFormItem
 * @property {string} text
 */

/**
 * @typedef {Object} PixelFormItem
 * @property {string} value
 */

/**
 * Значения формы. На API уходят в прежнем формате через toApiPayload.
 * @typedef {Object} LandingFormValues
 * @property {string} slug
 * @property {string} title
 * @property {string} main_title
 * @property {string} description
 * @property {string} main_image
 * @property {string} secondary_image
 * @property {BenefitFormItem[]} benefits
 * @property {LandingAdvantage[]} advantages
 * @property {LandingReview[]} reviews
 * @property {PixelFormItem[]} pixels
 * @property {string} button_text
 * @property {string} survey_text
 * @property {LandingColors} colors
 * @property {Record<string, unknown>} styles
 * @property {boolean} is_active
 */

/**
 * @typedef {'create'|'edit'|'duplicate'} LandingEditorMode
 */

export {};
