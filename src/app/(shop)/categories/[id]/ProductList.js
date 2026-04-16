'use client';

import {
  memo,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
  Chip,
  IconButton,
  Snackbar,
  Button,
  Alert,
  Paper,
  Slide,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Divider,
  CircularProgress,
  Skeleton,
  Rating,
  Tooltip,
} from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import { useCompareStore } from '@/entities/compare';
import { useFavoritesStore } from '@/entities/favorites';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import TuneIcon from '@mui/icons-material/Tune';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import PaymentIcon from '@mui/icons-material/Payment';

const PAGE_SIZE = 24;

const FILTER_URL_KEYS = [
  'memory',
  'ram',
  'processor',
  'display',
  'camera',
  'battery',
  'os',
  'color',
  'year',
];

const hasSpecsToShow = (specifications) => {
  if (
    !specifications ||
    typeof specifications !== 'object' ||
    Array.isArray(specifications)
  ) {
    return false;
  }

  const fields = [
    specifications.display,
    specifications.processor,
    specifications.ram,
    specifications.memory,
    specifications.camera,
    specifications.battery,
  ];

  return fields.some((value) => value && String(value).trim() !== '');
};

const ProductGridCard = memo(function ProductGridCard({
  product,
  index,
  isFavorite,
  isCompared,
  onCompare,
  onFavorite,
}) {
  const showSpecs = hasSpecsToShow(product.specifications);

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            display: 'flex',
            gap: 1,
          }}
        >
          <Tooltip title="Добавить в сравнение">
            <IconButton
              size="small"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCompare(product);
              }}
              sx={{
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <CompareArrowsIcon color={isCompared ? 'primary' : 'action'} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Добавить в избранное">
            <IconButton
              size="small"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onFavorite(product.id);
              }}
              sx={{
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'action.hover' },
                zIndex: 2,
              }}
            >
              {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        <Link
          href={`/products/${product.id}`}
          style={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              pt: '100%',
              bgcolor: 'background.paper',
            }}
          >
            {product.image && (
              <Image
                src={product.image}
                alt={product.name}
                fill
                style={{
                  objectFit: 'contain',
                  padding: '20px',
                }}
                sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                priority={index < 6}
              />
            )}
          </Box>

          <CardContent sx={{ flexGrow: 1, pt: 2 }}>
            <Box sx={{ mb: 1 }}>
              {product.isNew && (
                <Chip
                  label="Новинка"
                  color="primary"
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
              )}
              {product.discount > 0 && (
                <Chip
                  label={`-${product.discount}%`}
                  color="error"
                  size="small"
                  sx={{ mb: 1 }}
                />
              )}
            </Box>

            <Typography
              variant="h6"
              component="h3"
              gutterBottom
              sx={{
                fontSize: '1rem',
                fontWeight: 500,
                minHeight: '3rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {product.name}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Rating
                value={product.rating || 0}
                readOnly
                size="small"
                precision={0.5}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {product.description}
              </Typography>

              {showSpecs && (
                <List dense sx={{ mt: 1, '& .MuiListItem-root': { px: 0 } }}>
                  {product.specifications.display &&
                    String(product.specifications.display).trim() !== '' && (
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography variant="body2" component="span">
                              <strong>Дисплей:</strong> {product.specifications.display}
                            </Typography>
                          }
                        />
                      </ListItem>
                    )}
                  {product.specifications.processor &&
                    String(product.specifications.processor).trim() !== '' && (
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography variant="body2" component="span">
                              <strong>Процессор:</strong>{' '}
                              {product.specifications.processor}
                            </Typography>
                          }
                        />
                      </ListItem>
                    )}
                  {product.specifications.ram &&
                    String(product.specifications.ram).trim() !== '' && (
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography variant="body2" component="span">
                              <strong>Память:</strong> {product.specifications.ram}
                            </Typography>
                          }
                        />
                      </ListItem>
                    )}
                  {product.specifications.memory &&
                    String(product.specifications.memory).trim() !== '' && (
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography variant="body2" component="span">
                              <strong>Накопитель:</strong> {product.specifications.memory}
                            </Typography>
                          }
                        />
                      </ListItem>
                    )}
                  {product.specifications.camera &&
                    String(product.specifications.camera).trim() !== '' && (
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography variant="body2" component="span">
                              <strong>Камера:</strong> {product.specifications.camera}
                            </Typography>
                          }
                        />
                      </ListItem>
                    )}
                  {product.specifications.battery &&
                    String(product.specifications.battery).trim() !== '' && (
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography variant="body2" component="span">
                              <strong>Аккумулятор:</strong>{' '}
                              {product.specifications.battery}
                            </Typography>
                          }
                        />
                      </ListItem>
                    )}
                </List>
              )}
            </Box>

            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Tooltip title="Бесплатная доставка">
                <LocalShippingIcon color="primary" fontSize="small" />
              </Tooltip>
              <Tooltip title="Официальная гарантия">
                <VerifiedIcon color="primary" fontSize="small" />
              </Tooltip>
              <Tooltip title="Рассрочка">
                <PaymentIcon color="primary" fontSize="small" />
              </Tooltip>
            </Stack>

            <Box sx={{ mt: 'auto' }}>
              {product.oldPrice && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textDecoration: 'line-through',
                  }}
                >
                  от {product.oldPrice.toLocaleString()} BYN/мес. <br />
                </Typography>
              )}
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                от {product.price.toLocaleString()} BYN/мес. <br />
              </Typography>
            </Box>
          </CardContent>
        </Link>
      </Card>
    </Grid>
  );
});

export default function ProductList({
  categoryId,
  initialProducts = [],
  initialFilters = {},
  initialHasMore = false,
}) {
  const hasInitialData =
    (Array.isArray(initialProducts) && initialProducts.length > 0) ||
    Boolean(initialHasMore) ||
    (initialFilters && Object.keys(initialFilters).length > 0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(!hasInitialData);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sort, setSort] = useState('asc');
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const loadMoreSentinelRef = useRef(null);
  const hasMoreRef = useRef(false);
  const loadingMoreRef = useRef(false);
  const initialLoadingRef = useRef(false);
  const { compareItems, addToCompare, removeFromCompare } = useCompareStore();
  const { favorites, addToFavorites, removeFromFavorites } = useFavoritesStore();

  const compareIds = useMemo(
    () => new Set(compareItems.map((item) => String(item.id))),
    [compareItems],
  );
  const favoriteIds = useMemo(
    () => new Set(favorites.map((id) => String(id))),
    [favorites],
  );

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [availableFilters, setAvailableFilters] = useState(initialFilters);
  const [activeFilters, setActiveFilters] = useState({});
  const [previewFilters, setPreviewFilters] = useState({});
  const [previewCount, setPreviewCount] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const didUseInitialDataRef = useRef(hasInitialData);

  // Удален console.log для production

  // Мемоизируем строковое представление activeFilters для предотвращения лишних запросов
  // Это решает проблему, когда объект создается заново при каждом рендере
  const activeFiltersKey = useMemo(() => {
    return JSON.stringify(activeFilters);
  }, [activeFilters]);

  useEffect(() => {
    setPage(1);
  }, [categoryId]);

  const didInitSearchRef = useRef(false);
  useEffect(() => {
    if (didInitSearchRef.current) {
      return;
    }
    didInitSearchRef.current = true;
    const q = searchParams.get('search');
    if (q) {
      setSearchInput(q);
      setSearchTerm(q.trim());
    }
  }, [searchParams]);

  useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = searchInput.trim();
      if (trimmed === searchTerm) {
        return;
      }
      setSearchTerm(trimmed);
      setPage(1);
      const currentParams = new URLSearchParams(window.location.search);
      if (trimmed) {
        currentParams.set('search', trimmed);
      } else {
        currentParams.delete('search');
      }
      currentParams.delete('page');
      router.replace(`?${currentParams.toString()}`, { scroll: false });
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput, router, searchTerm]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    loadingMoreRef.current = loadingMore;
  }, [loadingMore]);

  useEffect(() => {
    initialLoadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      if (!categoryId) {
        return;
      }
      const isDefaultInitialRequest =
        didUseInitialDataRef.current &&
        page === 1 &&
        sort === 'asc' &&
        sortBy === 'name' &&
        !searchTerm &&
        activeFiltersKey === '{}';
      if (isDefaultInitialRequest) {
        didUseInitialDataRef.current = false;
        return;
      }
      const isFirstPage = page === 1;
      try {
        if (isFirstPage) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError(null);
        const params = new URLSearchParams({
          categoryId,
          sort,
          sortBy,
          page: String(page),
          limit: String(PAGE_SIZE),
          search: searchTerm,
          ...activeFilters,
        });
        const response = await fetch(`/api/products?${params}`);
        if (!response.ok) {
          throw new Error('Не удалось загрузить продукты');
        }
        const data = await response.json();
        if (cancelled) {
          return;
        }
        const batch = data.products || [];
        const pages = data.pagination?.pages ?? 0;

        if (isFirstPage) {
          setProducts(batch);
        } else {
          setProducts((prev) => {
            const seen = new Set(prev.map((p) => p.id));
            const merged = [...prev];
            for (const p of batch) {
              if (p?.id !== undefined && p?.id !== null && !seen.has(p.id)) {
                seen.add(p.id);
                merged.push(p);
              }
            }
            return merged;
          });
        }
        setAvailableFilters(data.filters || {});
        setHasMore(pages > 0 && page < pages);
      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching products:', err);
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          if (isFirstPage) {
            setLoading(false);
          } else {
            setLoadingMore(false);
          }
        }
      }
    };

    fetchProducts();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, sort, sortBy, page, searchTerm, activeFiltersKey]);

  useEffect(() => {
    const el = loadMoreSentinelRef.current;
    if (!el || loading) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) {
          return;
        }
        if (
          !hasMoreRef.current ||
          loadingMoreRef.current ||
          initialLoadingRef.current
        ) {
          return;
        }
        setPage((p) => p + 1);
      },
      { root: null, rootMargin: '320px', threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loading, products.length, categoryId, hasMore]);

  const updateUrl = useCallback(
    (params) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.delete('page');
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          currentParams.set(key, value);
        } else {
          currentParams.delete(key);
        }
      });
      router.push(`?${currentParams.toString()}`);
    },
    [router, searchParams],
  );

  // Мемоизированные обработчики для предотвращения лишних ререндеров
  const handleSortChange = useCallback(
    (event) => {
      setSortBy(event.target.value);
      setPage(1);
      updateUrl({ sortBy: event.target.value });
    },
    [updateUrl],
  );

  const handleOrderChange = useCallback(
    (event) => {
      setSort(event.target.value);
      setPage(1);
      updateUrl({ sort: event.target.value });
    },
    [updateUrl],
  );

  const handleSearchChange = useCallback((event) => {
    setSearchInput(event.target.value);
  }, []);

  // Debounce для handleFilterChange - предотвращает частые запросы при изменении фильтров
  const filterChangeTimeoutRef = useRef(null);

  const handleFilterChange = useCallback(async (field, value) => {
    const newFilters = { ...previewFilters };
    if (newFilters[field] === value) {
      delete newFilters[field];
    } else {
      newFilters[field] = value;
    }
    setPreviewFilters(newFilters);

    // Очищаем предыдущий таймер
    if (filterChangeTimeoutRef.current) {
      clearTimeout(filterChangeTimeoutRef.current);
    }

    // Устанавливаем новый таймер - запрос выполнится только через 500ms после последнего изменения
    filterChangeTimeoutRef.current = setTimeout(async () => {
      setIsPreviewLoading(true);
      try {
        const params = new URLSearchParams({
          categoryId,
          ...newFilters,
        });
        const response = await fetch(`/api/products?${params}`);
        const data = await response.json();
        setPreviewCount(data.pagination.total);
      } catch (error) {
        console.error('Error fetching preview count:', error);
      } finally {
        setIsPreviewLoading(false);
      }
    }, 500);
  }, [previewFilters, categoryId]);

  const applyFilters = () => {
    setActiveFilters(previewFilters);
    setPage(1);
    updateUrl({ ...previewFilters });
    setDrawerOpen(false);
  };

  const resetFilters = () => {
    setPreviewFilters({});
    setActiveFilters({});
    setPreviewCount(null);
    setPage(1);
    const currentParams = new URLSearchParams(searchParams.toString());
    FILTER_URL_KEYS.forEach((key) => currentParams.delete(key));
    currentParams.delete('page');
    router.push(`?${currentParams.toString()}`);
  };

  const handleCompareToggle = useCallback((product) => {
    const productId = String(product.id);
    if (compareIds.has(productId)) {
      removeFromCompare(product.id);
      setSnackbarMessage('Товар удален из сравнения');
    } else {
      if (compareItems.length >= 4) {
        setSnackbarMessage('Можно сравнивать максимум 4 товара');
      } else {
        addToCompare(product);
        setSnackbarMessage('Товар добавлен к сравнению');
      }
    }
    setSnackbarOpen(true);
  }, [removeFromCompare, addToCompare, compareItems.length, compareIds]);

  const handleFavoriteClick = useCallback((productId) => {
    if (favoriteIds.has(String(productId))) {
      removeFromFavorites(productId);
      setSnackbarMessage('Товар удален из избранного');
    } else {
      addToFavorites(productId);
      setSnackbarMessage('Товар добавлен в избранное');
    }
    setSnackbarOpen(true);
  }, [favoriteIds, removeFromFavorites, addToFavorites]);

  const filterSections = [
    { key: 'memory', label: 'Память' },
    { key: 'ram', label: 'Оперативная память' },
    { key: 'processor', label: 'Процессор' },
    { key: 'display', label: 'Дисплей' },
    { key: 'camera', label: 'Камера' },
    { key: 'battery', label: 'Аккумулятор' },
    { key: 'os', label: 'Операционная система' },
    { key: 'color', label: 'Цвет' },
    { key: 'year', label: 'Год выпуска' },
  ];

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems="center"
        >
          <TextField
            label="Поиск"
            variant="outlined"
            value={searchInput}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1 }}
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Сортировать по</InputLabel>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              label="Сортировать по"
            >
              <MenuItem value="name">Названию</MenuItem>
              <MenuItem value="price">Цене</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Порядок</InputLabel>
            <Select value={sort} onChange={handleOrderChange} label="Порядок">
              <MenuItem value="asc">По возрастанию</MenuItem>
              <MenuItem value="desc">По убыванию</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<TuneIcon />}
            onClick={() => setDrawerOpen(true)}
            color={
              Object.keys(activeFilters).length > 0 ? 'primary' : 'inherit'
            }
          >
            Фильтры
            {Object.keys(activeFilters).length > 0 && (
              <Chip
                label={Object.keys(activeFilters).length}
                size="small"
                color="primary"
                sx={{ ml: 1 }}
              />
            )}
          </Button>
        </Stack>
      </Box>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => {
          setPreviewFilters(activeFilters);
          setPreviewCount(null);
          setDrawerOpen(false);
        }}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 } },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6">Фильтры</Typography>
            {Object.keys(previewFilters).length > 0 && (
              <Button variant="text" onClick={resetFilters}>
                Сбросить все
              </Button>
            )}
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <List>
            {filterSections.map(
              ({ key, label }) =>
                availableFilters[key]?.length > 0 && (
                  <ListItem
                    key={key}
                    sx={{ flexDirection: 'column', alignItems: 'flex-start' }}
                  >
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      {label}
                    </Typography>
                    <FormGroup>
                      {availableFilters[key].map((value) => (
                        <FormControlLabel
                          key={value}
                          control={
                            <Checkbox
                              checked={previewFilters[key] === value}
                              onChange={() => handleFilterChange(key, value)}
                            />
                          }
                          label={value}
                        />
                      ))}
                    </FormGroup>
                    <Divider sx={{ my: 2, width: '100%' }} />
                  </ListItem>
                )
            )}
          </List>
          {(previewCount !== null || isPreviewLoading) && (
            <Paper
              elevation={3}
              sx={{
                p: 2,
                position: 'sticky',
                bottom: 16,
                mt: 2,
                backgroundColor: 'background.paper',
                zIndex: 1,
              }}
            >
              <Stack spacing={2}>
                {isPreviewLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <Typography>Найдено товаров: {previewCount}</Typography>
                )}
                <Button
                  variant="contained"
                  onClick={applyFilters}
                  disabled={isPreviewLoading}
                  fullWidth
                >
                  Показать результаты
                </Button>
              </Stack>
            </Paper>
          )}
        </Box>
      </Drawer>

      {loading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
              <Skeleton
                variant="rectangular"
                height={400}
                sx={{ borderRadius: 2 }}
                animation="wave"
              />
            </Grid>
          ))}
        </Grid>
      ) : products.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Товары не найдены
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Попробуйте изменить фильтры или поисковый запрос
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.map((product, index) => {
            if (!product.id || !product.image) {
              return null;
            }
            const productId = String(product.id);
            return (
              <ProductGridCard
                key={product.id}
                product={product}
                index={index}
                isFavorite={favoriteIds.has(productId)}
                isCompared={compareIds.has(productId)}
                onCompare={handleCompareToggle}
                onFavorite={handleFavoriteClick}
              />
            );
          })}
        </Grid>
      )}

      {!loading && products.length > 0 && (
        <Box sx={{ mt: 2, minHeight: 24 }}>
          {loadingMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={32} />
            </Box>
          )}
          <Box ref={loadMoreSentinelRef} sx={{ height: 24 }} aria-hidden />
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
