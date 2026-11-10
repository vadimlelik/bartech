'use client';

import { useEffect, useState } from 'react';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { isValidSlug, slugify } from '../model/slug';

/**
 * @param {{
 *   value: string,
 *   onChange: (value: string, meta?: { manual?: boolean }) => void,
 *   onBlur?: () => void,
 *   error?: string,
 *   excludeId?: number | null,
 *   inputId?: string,
 *   editWarning?: string,
 * }} props
 */
export default function SlugField({
  value,
  onChange,
  onBlur,
  error,
  excludeId = null,
  inputId = 'landing-slug',
  editWarning = '',
}) {
  const [status, setStatus] = useState(/** @type {'idle'|'checking'|'free'|'taken'|'error'} */ ('idle'));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const slug = String(value || '');
    if (!isValidSlug(slug)) {
      setStatus('idle');
      return undefined;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setStatus('checking');
      try {
        const params = new URLSearchParams({ slug });
        if (excludeId) params.set('excludeId', String(excludeId));
        const response = await fetch(`/api/admin/landings/slug-check?${params.toString()}`, {
          credentials: 'include',
          signal: controller.signal,
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          setStatus('error');
          return;
        }
        setStatus(data.available ? 'free' : 'taken');
      } catch (checkError) {
        if (checkError instanceof DOMException && checkError.name === 'AbortError') return;
        setStatus('error');
      }
    }, 450);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [value, excludeId]);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const slug = slugify(value || '');
  const url = slug ? `${origin}/${slug}` : `${origin}/`;
  const taken = status === 'taken';
  const helper = error || (taken ? 'Этот slug уже занят' : 'Только латиница, цифры и дефисы. После ручной правки автозаполнение отключается.');

  const copyUrl = async () => {
    if (!slug) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Box>
      <TextField
        id={inputId}
        fullWidth
        required
        label="Slug (URL путь)"
        value={value || ''}
        autoComplete="off"
        error={Boolean(error) || taken}
        helperText={helper}
        onBlur={() => {
          onChange(slugify(value || ''), { manual: false });
          onBlur?.();
        }}
        onChange={(event) => onChange(slugify(event.target.value, { trimEdges: false }), { manual: true })}
      />
      {editWarning ? (
        <Typography variant="caption" color="warning.main" sx={{ display: 'block', mt: 0.5 }}>
          {editWarning}
        </Typography>
      ) : null}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
          {url}
        </Typography>
        <IconButton type="button" size="small" aria-label="Скопировать адрес страницы" onClick={copyUrl} disabled={!slug}>
          {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
        </IconButton>
        <Typography
          variant="caption"
          color={status === 'free' ? 'success.main' : status === 'error' ? 'warning.main' : 'text.secondary'}
          aria-live="polite"
        >
          {status === 'checking' && 'Проверяем…'}
          {status === 'free' && 'Свободен'}
          {status === 'taken' && 'Занят'}
          {status === 'error' && 'Не удалось проверить уникальность'}
        </Typography>
      </Box>
    </Box>
  );
}
