'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Box } from '@mui/material';

function isRemoteAbsoluteUrl(src) {
  return /^https?:\/\//i.test(src || '');
}

/**
 * Превью в админке: абсолютные URL грузятся через обычный img, без next/image optimizer
 * (иначе при 402/403 от CDN в логах сыпется "upstream image response failed").
 */
export default function AdminThumbImage({
  src,
  alt = '',
  width = 60,
  height = 60,
  style = {},
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src) return null;

  if (isRemoteAbsoluteUrl(src)) {
    if (failed) {
      return (
        <Box
          sx={{
            width,
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'action.hover',
            borderRadius: style.borderRadius ?? 1,
            fontSize: width < 100 ? 10 : 12,
            color: 'text.secondary',
            textAlign: 'center',
            px: 0.5,
            border: '1px dashed',
            borderColor: 'divider',
          }}
        >
          Нет фото
        </Box>
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element -- обход Image Optimization для внешних CDN
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{ objectFit: 'cover', borderRadius: 4, ...style }}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={{ objectFit: 'cover', borderRadius: 4, ...style }}
    />
  );
}
