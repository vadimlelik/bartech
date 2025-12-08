'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Grid,
  TextField,
  CircularProgress,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';
import Image from 'next/image';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

export default function ImageSelector({ open, onClose, onSelect, currentImage = '' }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(currentImage);

  useEffect(() => {
    if (open) {
      fetchImages();
      setSelectedImage(currentImage);
    }
  }, [open, currentImage]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/images');
      const data = await response.json();

      if (response.ok && data.images) {
        setImages(data.images);
      } else {
        console.error('Error fetching images:', data.error);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = images.filter((img) =>
    img.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    img.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Выбрать изображение из базы данных</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Поиск изображений..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              Найдено изображений: {filteredImages.length}
            </Typography>
            <Box
              sx={{
                maxHeight: '60vh',
                overflowY: 'auto',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 2,
              }}
            >
              <Grid container spacing={2}>
                {filteredImages.length === 0 ? (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Изображения не найдены
                      </Typography>
                    </Box>
                  </Grid>
                ) : (
                  filteredImages.map((img) => (
                    <Grid item xs={6} sm={4} md={3} key={img.url}>
                      <Box
                        onClick={() => setSelectedImage(img.url)}
                        sx={{
                          position: 'relative',
                          cursor: 'pointer',
                          border: selectedImage === img.url ? 3 : 1,
                          borderColor: selectedImage === img.url ? 'primary.main' : 'divider',
                          borderRadius: 1,
                          overflow: 'hidden',
                          aspectRatio: '1',
                          '&:hover': {
                            borderColor: 'primary.main',
                            borderWidth: 2,
                          },
                        }}
                      >
                        <Image
                          src={img.url}
                          alt={img.name}
                          fill
                          style={{
                            objectFit: 'cover',
                          }}
                          sizes="(max-width: 600px) 50vw, (max-width: 960px) 33vw, 25vw"
                        />
                        {selectedImage === img.url && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              bgcolor: 'primary.main',
                              opacity: 0.2,
                            }}
                          />
                        )}
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={img.name}
                      >
                        {img.name}
                      </Typography>
                    </Grid>
                  ))
                )}
              </Grid>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleSelect}
          variant="contained"
          disabled={!selectedImage}
        >
          Выбрать
        </Button>
      </DialogActions>
    </Dialog>
  );
}

