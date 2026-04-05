'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

const PAGE_SIZE = 48;

export default function ImageSelector({ open, onClose, onSelect, currentImage = '' }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(currentImage);
  const [totalRemote, setTotalRemote] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const scrollRootRef = useRef(null);
  const sentinelRef = useRef(null);
  const offsetRef = useRef(0);
  const hasMoreRef = useRef(false);
  const loadingMoreRef = useRef(false);

  const fetchPage = useCallback(async (offset, append) => {
    const response = await fetch(
      `/api/admin/images?offset=${offset}&limit=${PAGE_SIZE}`,
      { credentials: 'include' },
    );
    const data = await response.json();

    if (!response.ok) {
      console.error('Error fetching images:', data.error);
      setHasMore(false);
      hasMoreRef.current = false;
      return { ok: false, batch: [], hasMore: false, total: 0 };
    }

    const batch = Array.isArray(data.images) ? data.images : [];
    setTotalRemote(typeof data.total === 'number' ? data.total : 0);
    const more = Boolean(data.hasMore);
    setHasMore(more);
    hasMoreRef.current = more;
    offsetRef.current = offset + batch.length;

    if (append) {
      setImages((prev) => {
        const seen = new Map(prev.map((img) => [img.url, img]));
        for (const img of batch) {
          if (img?.url && !seen.has(img.url)) {
            seen.set(img.url, img);
          }
        }
        return Array.from(seen.values());
      });
    } else {
      setImages(batch);
    }

    return { ok: true, batch, hasMore: Boolean(data.hasMore), total: data.total };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }
    setSelectedImage(currentImage);
    setSearchTerm('');
    offsetRef.current = 0;
    hasMoreRef.current = false;
    setHasMore(false);
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        await fetchPage(0, false);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, currentImage, fetchPage]);

  useEffect(() => {
    if (!open || loading) {
      return;
    }
    const root = scrollRootRef.current;
    const sentinel = sentinelRef.current;
    if (!root || !sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) {
          return;
        }
        if (!hasMoreRef.current || loadingMoreRef.current) {
          return;
        }
        loadingMoreRef.current = true;
        setLoadingMore(true);
        fetchPage(offsetRef.current, true).finally(() => {
          loadingMoreRef.current = false;
          setLoadingMore(false);
        });
      },
      { root, rootMargin: '160px', threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [open, loading, fetchPage]);

  const filteredImages = images.filter(
    (img) =>
      img.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.path.toLowerCase().includes(searchTerm.toLowerCase()),
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
          <Typography variant="h6">Выбрать изображение</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Поиск среди загруженных..."
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
              Совпадений: {filteredImages.length} · Загружено в список: {images.length}
              {totalRemote > 0 ? ` · Всего в хранилище: ${totalRemote}` : null}
              {hasMore || loadingMore ? ' · Прокрутите вниз, чтобы подгрузить ещё' : null}
            </Typography>
            <Box
              ref={scrollRootRef}
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
                {loadingMore && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                      <CircularProgress size={28} />
                    </Box>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Box ref={sentinelRef} sx={{ height: 8 }} aria-hidden />
                </Grid>
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
