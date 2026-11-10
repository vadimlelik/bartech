'use client';

import { useRef, useState } from 'react';
import { Box, Button, LinearProgress, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ImageIcon from '@mui/icons-material/Image';
import ImageSelector from '@/features/admin-images/ui/ImageSelector';
import { uploadLandingImage, validateImageFile } from '../model/upload-image';

/**
 * @param {{
 *   label: string,
 *   value: string,
 *   onChange: (path: string) => void,
 *   helperText?: string,
 *   error?: string,
 *   compact?: boolean,
 * }} props
 */
export default function ImageField({ label, value, onChange, helperText, error, compact = false }) {
  const inputRef = useRef(/** @type {HTMLInputElement | null} */ (null));
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [localError, setLocalError] = useState('');
  const [previewFailed, setPreviewFailed] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const height = compact ? 96 : 180;

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  /**
   * @param {File | undefined} file
   */
  const handleFile = async (file) => {
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    setLocalError('');
    setUploading(true);
    setProgress(0);
    try {
      const path = await uploadLandingImage(file, { onProgress: setProgress });
      setPreviewFailed(false);
      onChange(path);
    } catch (uploadError) {
      const message = uploadError instanceof Error ? uploadError.message : 'Не удалось загрузить изображение';
      if (message !== 'Загрузка отменена') {
        setLocalError(message);
      }
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const message = localError || error || '';

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        aria-label={`${label}: выбрать файл`}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          handleFile(file);
        }}
      />

      {value ? (
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            p: 1.5,
            border: 1,
            borderColor: message ? 'error.main' : 'divider',
            borderRadius: 1,
            bgcolor: 'background.paper',
          }}
        >
          <Box
            sx={{
              width: compact ? 96 : 160,
              height,
              borderRadius: 1,
              overflow: 'hidden',
              bgcolor: 'action.hover',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            {previewFailed ? (
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 1 }}>
                <Typography variant="caption" color="text.secondary" align="center">
                  Не удалось показать превью
                </Typography>
              </Box>
            ) : (
              <Box
                component="img"
                src={value}
                alt={label}
                onError={() => setPreviewFailed(true)}
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            )}
            {uploading && (
              <LinearProgress
                variant="determinate"
                value={progress}
                aria-label="Прогресс загрузки"
                sx={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 160 }}>
            <Button type="button" variant="outlined" size="small" onClick={openFileDialog} disabled={uploading}>
              Заменить
            </Button>
            <Button
              type="button"
              variant="outlined"
              size="small"
              onClick={() => setSelectorOpen(true)}
              disabled={uploading}
            >
              Выбрать из MinIO
            </Button>
            <Button
              type="button"
              variant="text"
              color="error"
              size="small"
              startIcon={<DeleteOutlineIcon />}
              onClick={() => {
                setPreviewFailed(false);
                setLocalError('');
                onChange('');
              }}
              disabled={uploading}
            >
              Удалить
            </Button>
          </Box>
        </Box>
      ) : (
        <Box
          role="button"
          tabIndex={0}
          aria-label={`${label}: загрузить изображение`}
          onClick={openFileDialog}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openFileDialog();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragOver(false);
            const file = event.dataTransfer.files?.[0];
            handleFile(file);
          }}
          sx={{
            border: '1px dashed',
            borderColor: message ? 'error.main' : dragOver ? 'primary.main' : 'divider',
            borderRadius: 1,
            bgcolor: dragOver ? 'primary.light' : 'background.paper',
            minHeight: height,
            px: 2,
            py: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
            '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
          }}
        >
          {uploading ? (
            <Box sx={{ width: '100%', maxWidth: 280 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Загрузка… {progress}%
              </Typography>
              <LinearProgress variant="determinate" value={progress} aria-label="Прогресс загрузки" />
            </Box>
          ) : (
            <>
              <CloudUploadIcon color="primary" />
              <Typography variant="body2">Перетащите изображение или нажмите, чтобы загрузить</Typography>
              <Typography variant="caption" color="text.secondary">
                JPEG, PNG или WebP, до 10 МБ
              </Typography>
              <Button
                type="button"
                variant="outlined"
                size="small"
                startIcon={<ImageIcon />}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectorOpen(true);
                }}
              >
                Выбрать из MinIO
              </Button>
            </>
          )}
        </Box>
      )}

      <Typography variant="caption" color={message ? 'error' : 'text.secondary'} sx={{ display: 'block', mt: 0.75 }} role={message ? 'alert' : undefined}>
        {message || helperText || 'JPEG, PNG или WebP, до 10 МБ'}
      </Typography>

      <ImageSelector
        open={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        currentImage={value}
        onSelect={(imageUrl) => {
          setPreviewFailed(false);
          setLocalError('');
          onChange(imageUrl);
          setSelectorOpen(false);
        }}
      />
    </Box>
  );
}
