// @ts-check

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024;

/**
 * @param {File} file
 * @returns {string | null}
 */
export function validateImageFile(file) {
  if (!file) return 'Файл не выбран';
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Допустимы только JPEG, PNG и WebP';
  }
  if (file.size > MAX_SIZE) {
    return 'Файл больше 10 МБ';
  }
  return null;
}

/**
 * @param {string} message
 * @returns {string}
 */
export function humanUploadError(message) {
  if (!message) return 'Не удалось загрузить изображение';
  if (/invalid file type/i.test(message)) return 'Допустимы только JPEG, PNG и WebP';
  if (/10\s?MB|size exceeds/i.test(message)) return 'Файл больше 10 МБ';
  if (/unauthorized/i.test(message)) return 'Нужно войти в админку';
  if (/forbidden/i.test(message)) return 'Недостаточно прав для загрузки';
  return message;
}

/**
 * @param {File} file
 * @param {{ onProgress?: (percent: number) => void, signal?: AbortSignal }} [options]
 * @returns {Promise<string>}
 */
export function uploadLandingImage(file, options = {}) {
  const validationError = validateImageFile(file);
  if (validationError) {
    return Promise.reject(new Error(validationError));
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/admin/upload');
    xhr.withCredentials = true;
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !options.onProgress) return;
      options.onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      /** @type {{ path?: string, error?: string }} */
      let data = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        data = {};
      }
      if (xhr.status >= 200 && xhr.status < 300 && data.path) {
        resolve(data.path);
        return;
      }
      reject(new Error(humanUploadError(data.error || 'Не удалось загрузить изображение')));
    };
    xhr.onerror = () => reject(new Error('Ошибка сети при загрузке'));
    xhr.onabort = () => reject(new Error('Загрузка отменена'));

    if (options.signal) {
      if (options.signal.aborted) {
        reject(new Error('Загрузка отменена'));
        return;
      }
      options.signal.addEventListener('abort', () => xhr.abort(), { once: true });
    }

    const body = new FormData();
    body.append('file', file);
    body.append('folder', 'landings');
    xhr.send(body);
  });
}
