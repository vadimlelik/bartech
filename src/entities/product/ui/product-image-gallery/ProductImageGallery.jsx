'use client';

import { useState, useCallback } from 'react';
import { Box, IconButton, Dialog, DialogContent } from '@mui/material';
import Image from 'next/image';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Компонент галереи изображений товара
 */
export default function ProductImageGallery({ images, productName }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const productImages = images && images.length > 0 
    ? images.filter(img => img && img.trim() !== '')
    : ['/logo_techno_bar.svg'];

  const handleImageClick = useCallback(() => {
    if (productImages.length > 0) {
      setDialogOpen(true);
    }
  }, [productImages.length]);

  const handlePrevImage = useCallback((e) => {
    if (e) e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : productImages.length - 1
    );
  }, [productImages.length]);

  const handleNextImage = useCallback((e) => {
    if (e) e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev < productImages.length - 1 ? prev + 1 : 0
    );
  }, [productImages.length]);

  const handleThumbnailClick = useCallback((index) => {
    setCurrentImageIndex(index);
  }, []);

  const thumbnailSlots = Array.from({ length: 4 }, (_, index) => productImages[index] || null);

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 320, md: 460 },
          cursor: 'zoom-in',
          bgcolor: '#eef2f6',
          borderRadius: 3,
          overflow: 'hidden',
        }}
        onClick={handleImageClick}
      >
        {productImages[currentImageIndex] && (
          <Image
            src={productImages[currentImageIndex]}
            alt={`${productName} - изображение ${currentImageIndex + 1}`}
            fill
            style={{ objectFit: 'contain', padding: 16 }}
            sizes="(max-width: 960px) 100vw, 50vw"
            priority
          />
        )}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 1,
          mt: 1.5,
        }}
      >
        {thumbnailSlots.map((img, index) => (
          <Box
            key={index}
            onClick={() => {
              if (img) handleThumbnailClick(index);
            }}
            sx={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1 / 1',
              cursor: img ? 'pointer' : 'default',
              border: currentImageIndex === index && img ? 2 : 1,
              borderColor:
                currentImageIndex === index && img ? 'primary.main' : 'divider',
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: '#eef2f6',
            }}
          >
            {img && (
              <Image
                src={img}
                alt={`${productName} - миниатюра ${index + 1}`}
                fill
                style={{ objectFit: 'contain', padding: 6 }}
                sizes="120px"
              />
            )}
          </Box>
        ))}
      </Box>

      <Dialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ position: 'relative', p: 0 }}>
          <IconButton
            onClick={() => setDialogOpen(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 2,
              bgcolor: 'background.paper',
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '80vh',
            }}
          >
            {productImages[currentImageIndex] && (
              <Image
                src={productImages[currentImageIndex]}
                alt={`${productName} - полноразмерное изображение`}
                fill
                style={{ objectFit: 'contain' }}
                sizes="100vw"
              />
            )}
            {productImages.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrevImage}
                  sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'background.paper',
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <IconButton
                  onClick={handleNextImage}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'background.paper',
                  }}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
