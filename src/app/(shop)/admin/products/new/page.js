'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Image from 'next/image';
import AdminGuard from '@/components/AdminGuard';
import ImageSelector from '@/components/admin/ImageSelector';

function NewProductPageContent() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [imageSelectorOpen, setImageSelectorOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    categoryId: '',
    price: '',
    image: '',
    images: '',
    description: '',
    specifications: {
      brand: '',
      model: '',
      memory: '',
      ram: '',
      display: '',
      processor: '',
      camera: '',
      battery: '',
      os: '',
      color: '',
      year: '',
      condition: 'new',
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories');
        if (response.ok) {
          const data = await response.json();
          if (data.categories && Array.isArray(data.categories)) {
            setCategories(data.categories);
          } else if (Array.isArray(data)) {
            setCategories(data);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('specifications.')) {
      const specKey = name.split('.')[1];
      setFormData({
        ...formData,
        specifications: {
          ...(formData.specifications || {}),
          [specKey]: value || '',
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value || '',
      });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.error || 'Ошибка загрузки изображения';
        showSnackbar(errorMessage, 'error');
        return;
      }

      if (data.path) {
        setFormData((prev) => ({
          ...prev,
          image: data.path || '',
        }));
        showSnackbar('Изображение загружено', 'success');
      } else {
        showSnackbar('Ошибка: путь к изображению не получен', 'error');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showSnackbar(`Ошибка загрузки: ${error.message || 'Неизвестная ошибка'}`, 'error');
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const submitData = {
        name: formData.name,
        category: formData.category,
        category_id: formData.categoryId,
        price: parseFloat(formData.price) || 0,
        image: formData.image,
        images: formData.images
          ? formData.images.split(',').map((img) => img.trim()).filter(Boolean)
          : [],
        description: formData.description,
        specifications: formData.specifications || {},
      };

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        showSnackbar('Товар создан', 'success');
        setTimeout(() => {
          router.push('/admin');
        }, 1000);
      } else {
        showSnackbar(data.error || 'Ошибка сохранения', 'error');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      showSnackbar('Ошибка сохранения товара', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/admin')}
          sx={{ mb: 2 }}
        >
          Назад к списку товаров
        </Button>
        <Typography variant="h4" component="h1">
          Добавить товар
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Название"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Категория</InputLabel>
              <Select
                value={formData.categoryId || ''}
                label="Категория"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    categoryId: e.target.value || '',
                    category: categories.find((c) => c.id === e.target.value)?.name || '',
                  })
                }
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Категория (текст)"
              name="category"
              value={formData.category || ''}
              onChange={handleInputChange}
              helperText="Или введите название категории вручную"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Цена"
              name="price"
              type="number"
              value={formData.price || ''}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Описание"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Основное изображение (путь)"
              name="image"
              value={formData.image || ''}
              onChange={handleInputChange}
              helperText="Или загрузите файл ниже, или выберите из базы данных"
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="outlined" component="label">
                Загрузить изображение
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
              <Button
                variant="outlined"
                onClick={() => setImageSelectorOpen(true)}
              >
                Выбрать из базы данных
              </Button>
            </Box>
            {formData.image && (
              <Box sx={{ mt: 2 }}>
                <Image
                  src={formData.image}
                  alt="Preview"
                  width={200}
                  height={200}
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                />
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Дополнительные изображения (через запятую)"
              name="images"
              value={formData.images || ''}
              onChange={handleInputChange}
              helperText="Разделяйте пути запятыми"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Характеристики
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Бренд"
              name="specifications.brand"
              value={formData.specifications?.brand || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Модель"
              name="specifications.model"
              value={formData.specifications?.model || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Память"
              name="specifications.memory"
              value={formData.specifications?.memory || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="ОЗУ"
              name="specifications.ram"
              value={formData.specifications?.ram || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Дисплей"
              name="specifications.display"
              value={formData.specifications?.display || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Процессор"
              name="specifications.processor"
              value={formData.specifications?.processor || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Камера"
              name="specifications.camera"
              value={formData.specifications?.camera || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Батарея"
              name="specifications.battery"
              value={formData.specifications?.battery || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="ОС"
              name="specifications.os"
              value={formData.specifications?.os || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Цвет"
              name="specifications.color"
              value={formData.specifications?.color || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Год"
              name="specifications.year"
              value={formData.specifications?.year || ''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Состояние"
              name="specifications.condition"
              value={formData.specifications?.condition || 'new'}
              onChange={handleInputChange}
              select
              SelectProps={{ native: true }}
            >
              <option value="new">Новый</option>
              <option value="used">Б/У</option>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/admin')}
                disabled={saving}
              >
                Отмена
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? <CircularProgress size={20} /> : 'Создать'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <ImageSelector
        open={imageSelectorOpen}
        onClose={() => setImageSelectorOpen(false)}
        onSelect={(imageUrl) => {
          setFormData((prev) => ({ ...prev, image: imageUrl }));
        }}
        currentImage={formData.image}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default function NewProductPage() {
  return (
    <AdminGuard>
      <NewProductPageContent />
    </AdminGuard>
  );
}

