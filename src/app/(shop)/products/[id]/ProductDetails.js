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
  DialogTitle,
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
  CircularProgress,
  Alert,
  TextField,
} from '@mui/material';
import Image from 'next/image';
import { useCartStore } from '@/store/cart';
import { useFavoritesStore } from '@/store/favorites';
import { useCompareStore } from '@/store/compare';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CloseIcon from '@mui/icons-material/Close';
import MaskedPhoneInput from '@/app/(shop)/components/InputMask/InputMask';
import ProductImageGallery from './components/ProductImageGallery';
import ProductDelivery from './components/ProductDelivery';
import ProductReviews from './components/ProductReviews';
import { EXTERNAL_SERVICES, VALIDATION, CURRENCY } from '@/config/constants';

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

export default function ProductDetails({ product }) {
  const [tabValue, setTabValue] = useState(0);
  const [isInstallmentModalOpen, setIsInstallmentModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [phone, setPhone] = useState('+375');
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { addToCart } = useCartStore();
  const { favorites, addToFavorites, removeFromFavorites } =
    useFavoritesStore();
  const { addToCompare, isInCompare } = useCompareStore();
  const isFavorite = favorites.includes(product.id);
  const params = useSearchParams();

  const utm_source = params.get('utm_source');
  const utm_medium = params.get('utm_medium');
  const utm_content = params.get('utm_content');
  const utm_campaign = params.get('utm_campaign');
  const ad = params.get('ad');
  const ttclid = params.get('ttclid');

  // Получаем изображения товара
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

  // Удалены обработчики изображений - теперь в ProductImageGallery

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenInstallmentModal = () => {
    setIsInstallmentModalOpen(true);
    setName('');
    setNameError('');
    setPhone('+375');
    setPhoneError('');
    setSubmitSuccess(false);
    setSubmitError('');
  };

  const handleCloseInstallmentModal = () => {
    setIsInstallmentModalOpen(false);
    setName('');
    setNameError('');
    setPhone('+375');
    setPhoneError('');
    setSubmitSuccess(false);
    setSubmitError('');
  };

  const validateName = (nameValue) => {
    if (!nameValue || nameValue.trim() === '') {
      return 'Пожалуйста, введите ваше имя';
    }
    if (nameValue.trim().length < 2) {
      return 'Имя должно содержать минимум 2 символа';
    }
    return '';
  };

  const validatePhone = (phoneNumber) => {
    if (!phoneNumber || phoneNumber === '+375') {
      return 'Пожалуйста, введите номер телефона';
    }
    if (!VALIDATION.PHONE_REGEX.test(phoneNumber)) {
      return 'Введите корректный номер телефона';
    }
    return '';
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    setNameError('');
    setSubmitError('');
  };

  const handlePhoneChange = (value) => {
    setPhone(value);
    setPhoneError('');
    setSubmitError('');
  };

  const handleSubmitInstallment = async () => {
    const nameError = validateName(name);
    const phoneError = validatePhone(phone);
    
    if (nameError) {
      setNameError(nameError);
    }
    if (phoneError) {
      setPhoneError(phoneError);
    }
    if (nameError || phoneError) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const formattedPhone = phone.replace(/[^\d+]/g, '');
      
      const productInfo = [
        `Товар: ${product.name}`,
        `Цена: ${product.price} BYN`,
        product.oldPrice ? `Старая цена: ${product.oldPrice} BYN` : '',
        product.description ? `Описание: ${product.description}` : '',
        product.specifications ? `Характеристики: ${JSON.stringify(product.specifications)}` : '',
      ].filter(Boolean).join('\n');

      const formData = {
        FIELDS: {
          TITLE: `Заявка на рассрочку - ${product.name}`,
          NAME: name.trim(),
          COMMENTS: `Заявка на оформление рассрочки\n\n${productInfo}`,
          PHONE: [{ VALUE: formattedPhone, VALUE_TYPE: 'WORK' }],
          SOURCE_ID: 'WEB',
          SOURCE_DESCRIPTION: 'Оформление в рассрочку со страницы товара',
          STATUS_ID: 'NEW',
          OPENED: 'Y',
          TYPE_ID: 'CALLBACK',
          UTM_SOURCE: utm_source || '',
          UTM_MEDIUM: utm_medium || '',
          UTM_CAMPAIGN: utm_campaign || '',
          UTM_CONTENT: utm_content || '',
          UTM_TERM: (ad || '') + (ttclid || ''),
        },
      };

      await axios.post(
        EXTERNAL_SERVICES.BITRIX24_WEBHOOK || 'https://technobar.bitrix24.by/rest/25/7fjyayckv4fkh0c2/crm.lead.add.json',
        formData
      );

      setSubmitSuccess(true);
      setTimeout(() => {
        handleCloseInstallmentModal();
      }, 2000);
    } catch (error) {
      console.error('Error submitting installment form:', error);
      setSubmitError('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <ProductImageGallery 
            images={productImages}
            productName={product.name}
          />
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
              от {product.price.toFixed(2)} BYN/мес. <br />
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
              onClick={handleOpenInstallmentModal}
              fullWidth
              sx={{
                height: 48,
                fontSize: '1.1rem',
              }}
            >
              Оформить в рассрочку
            </Button>
            <IconButton
              onClick={() => {
                isFavorite
                  ? removeFromFavorites(product.id)
                  : addToFavorites(product.id);
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
            <ProductDelivery />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <ProductReviews />
          </TabPanel>
        </Paper>
      </Box>

      {/* Диалог изображений теперь в ProductImageGallery */}

      {/* Модалка оформления в рассрочку */}
      <Dialog
        open={isInstallmentModalOpen}
        onClose={handleCloseInstallmentModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Оформить в рассрочку</Typography>
            <IconButton onClick={handleCloseInstallmentModal}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {/* Информация о товаре */}
            <Paper sx={{ p: 2, mb: 3, backgroundColor: 'grey.50' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: 100,
                    }}
                  >
                    <Image
                      src={productImages.length > 0 ? productImages[0] : '/logo_techno_bar.svg'}
                      alt={product.name}
                      fill
                      style={{ objectFit: 'contain' }}
                      unoptimized
                    />
                  </Box>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                   от {product.price.toFixed(2)} BYN
                  </Typography>
                  {product.oldPrice && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textDecoration: 'line-through' }}
                    >
                      {product.oldPrice.toFixed(2)} BYN
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Paper>

            {/* Форма с именем и телефоном */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                Введите ваше имя:
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ваше имя"
                value={name}
                onChange={handleNameChange}
                error={!!nameError}
                helperText={nameError}
                disabled={isSubmitting}
                sx={{ mb: 3 }}
              />
              
              <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                Введите ваш номер телефона для связи:
              </Typography>
              <MaskedPhoneInput
                value={phone}
                onChange={handlePhoneChange}
                error={phoneError}
                disabled={isSubmitting}
              />
            </Box>

            {/* Сообщения об успехе/ошибке */}
            {submitSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Ваша заявка успешно отправлена! Мы скоро свяжемся с вами.
              </Alert>
            )}
            {submitError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {submitError}
              </Alert>
            )}

            {/* Кнопки */}
            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                onClick={handleCloseInstallmentModal}
                disabled={isSubmitting}
                fullWidth
              >
                Отмена
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmitInstallment}
                disabled={isSubmitting}
                fullWidth
                sx={{ minHeight: 48 }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Отправить заявку'
                )}
              </Button>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
