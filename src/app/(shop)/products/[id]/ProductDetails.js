'use client';

import { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Chip,
  Rating,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import Image from 'next/image';
import { useCartStore } from '@/store/cart';
import { useFavoritesStore } from '@/store/favorites';
import { useCompareStore } from '@/store/compare';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Reviews() {
  const reviews = [
    {
      id: 1,
      author: 'Александр',
      rating: 5,
      date: '15.12.2023',
      text: 'Отличный телефон, всем рекомендую!',
    },
    {
      id: 2,
      author: 'Мария',
      rating: 4,
      date: '10.12.2023',
      text: 'Хороший телефон, но дороговато',
    },
    {
      id: 3,
      author: 'Дмитрий',
      rating: 5,
      date: '05.12.2023',
      text: 'Камера супер, батарея держит долго',
    },
  ];

  return (
    <List>
      {reviews.map((review, index) => (
        <div key={review.id}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar>{review.author[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography component="span" variant="subtitle1">
                    {review.author}
                  </Typography>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {review.date}
                  </Typography>
                </Box>
              }
              secondary={
                <>
                  <Rating
                    value={review.rating}
                    readOnly
                    size="small"
                    sx={{ mt: 1 }}
                  />
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                    sx={{ display: 'block', mt: 1 }}
                  >
                    {review.text}
                  </Typography>
                </>
              }
            />
          </ListItem>
          {index < reviews.length - 1 && (
            <Divider variant="inset" component="li" />
          )}
        </div>
      ))}
    </List>
  );
}

function Delivery() {
  return (
    <Box>
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <LocalShippingIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Бесплатная доставка"
            secondary="При заказе от 1000 рублей"
          />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <PaymentIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Оплата при получении"
            secondary="Наличными или картой"
          />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <ScheduleIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Срок доставки" secondary="1-3 рабочих дня" />
        </ListItem>
      </List>
    </Box>
  );
}

export default function ProductDetails({ product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageDialogOpen, setImageDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const { addToCart } = useCartStore();
  const { favorites, addToFavorites, removeFromFavorites } =
    useFavoritesStore();
  const { addToCompare, isInCompare } = useCompareStore();
  const isFavorite = favorites.includes(product.id);

  const productImages = (() => {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images.filter(img => img && img.trim() !== '');
    }
    if (product.image && product.image.trim() !== '') {
      return [product.image];
    }
    return ['/logo_techno_bar.svg']; 
  })();

  const specificationTranslations = {
    brand: 'Бренд',
    model: 'Модель',
    year: 'Год выпуска',
    color: 'Цвет',
    memory: 'Память',
    ram: 'Оперативная память',
    processor: 'Процессор',
    display: 'Дисплей',
    camera: 'Камера',
    battery: 'Аккумулятор',
    os: 'Операционная система',
  };

  const translateSpecification = (key) => {
    return specificationTranslations[key] || key;
  };

  const handleImageClick = () => {
    if (productImages.length > 0) {
      setImageDialogOpen(true);
    }
  };

  const handlePrevImage = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : productImages.length - 1
    );
  };

  const handleNextImage = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setCurrentImageIndex((prev) =>
      prev < productImages.length - 1 ? prev + 1 : 0
    );
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '500px',
              cursor: 'pointer',
            }}
            onClick={handleImageClick}
          >
            {productImages.length > 0 && productImages[currentImageIndex] && (
              <Image
                src={productImages[currentImageIndex]}
                alt={`${product.name} - изображение ${currentImageIndex + 1}`}
                fill
                style={{ objectFit: 'contain' }}
                unoptimized
                priority
              />
            )}
            {productImages.length > 1 && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 2,
                  zIndex: 1,
                }}
              >
                <IconButton
                  onClick={handlePrevImage}
                  sx={{
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'background.paper' },
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <IconButton
                  onClick={handleNextImage}
                  sx={{
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'background.paper' },
                  }}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            )}
          </Box>
          {productImages.length > 1 && (
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mt: 2,
                justifyContent: 'center',
              }}
            >
              {productImages.map((img, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 60,
                    height: 60,
                    position: 'relative',
                    cursor: 'pointer',
                    border:
                      index === currentImageIndex
                        ? '2px solid primary.main'
                        : 'none',
                    opacity: index === currentImageIndex ? 1 : 0.7,
                  }}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - миниатюра ${index + 1}`}
                    fill
                    style={{ objectFit: 'contain' }}
                    unoptimized
                  />
                </Box>
              ))}
            </Box>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Chip
              label="В наличии"
              color="success"
              size="small"
              sx={{ ml: 2 }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" color="primary" component="span">
              {product.price.toFixed(2)} BYN
            </Typography>
            {product.oldPrice && (
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  textDecoration: 'line-through',
                  ml: 2,
                }}
                component="span"
              >
                {product.oldPrice.toFixed(2)} BYN
              </Typography>
            )}
          </Box>

          {product.specifications &&
           typeof product.specifications === 'object' &&
           !Array.isArray(product.specifications) &&
           Object.entries(product.specifications).filter(([key, value]) => {
             const strValue = String(value || '').trim();
             return strValue !== '' && value !== null && value !== undefined;
           }).length > 0 && (
            <Box
              sx={{ mb: 3, backgroundColor: 'grey.50', p: 2, borderRadius: 1 }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Основные характеристики:
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(product.specifications)
                  .filter(([key, value]) => {
                    const strValue = String(value || '').trim();
                    return strValue !== '' && value !== null && value !== undefined;
                  })
                  .slice(0, 6)
                  .map(([key, value]) => (
                    <Grid item xs={12} sm={6} key={key}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {translateSpecification(key)}:
                        </Typography>
                        <Typography variant="body2">{value}</Typography>
                      </Box>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          )}

          <Typography variant="body1" color="text.secondary" paragraph>
            {product.description}
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocalShippingIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">
                      Быстрая доставка
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Доставка по Минску в течение 24 часов
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PaymentIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">Удобная оплата</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Наличными, картой или в рассрочку
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => addToCart(product)}
              fullWidth
              sx={{
                height: 48,
                fontSize: '1.1rem',
              }}
            >
              В корзину
            </Button>
            <IconButton
              onClick={() => {
                'Product ID:', product.id, 'type:', typeof product.id;
                'Current favorites:', favorites;
                isFavorite
                  ? removeFromFavorites(product.id)
                  : addToFavorites(product.id);
                'Updated favorites:', favorites;
              }}
              color={isFavorite ? 'error' : 'default'}
              sx={{ height: 48, width: 48 }}
            >
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <IconButton
              onClick={() => {
                const success = addToCompare(product);
                if (!success) {
                  alert('Можно сравнивать максимум 4 товара');
                }
              }}
              color={isInCompare(product.id) ? 'primary' : 'default'}
              sx={{ height: 48, width: 48 }}
            >
              <CompareArrowsIcon />
            </IconButton>
          </Stack>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6 }}>
        <Paper>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Характеристики" />
            <Tab label="Доставка" />
            <Tab label="Отзывы" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            {product.specifications &&
             typeof product.specifications === 'object' &&
             !Array.isArray(product.specifications) &&
             Object.entries(product.specifications).filter(([key, value]) => 
               value && value !== '' && value !== null && value !== undefined && String(value).trim() !== ''
             ).length > 0 ? (
              <TableContainer>
                <Table>
                  <TableBody>
                    {Object.entries(product.specifications)
                      .filter(([key, value]) => 
                        value && value !== '' && value !== null && value !== undefined && String(value).trim() !== ''
                      )
                      .map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ width: '30%' }}
                          >
                            {translateSpecification(key)}
                          </TableCell>
                          <TableCell>{value}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Характеристики не указаны
                </Typography>
              </Box>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Delivery />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Reviews />
          </TabPanel>
        </Paper>
      </Box>

      <Dialog
        open={isImageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="xl"
        fullWidth
      >
        <DialogContent sx={{ position: 'relative', p: 0, height: '80vh' }}>
          <IconButton
            onClick={() => setImageDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            onClick={handlePrevImage}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <IconButton
            onClick={handleNextImage}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
          <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
            {productImages.length > 0 && productImages[currentImageIndex] && (
              <Image
                src={productImages[currentImageIndex]}
                alt={`${product.name} - изображение ${currentImageIndex + 1}`}
                fill
                style={{ objectFit: 'contain' }}
                unoptimized
              />
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
