'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image';
import AdminGuard from '@/components/AdminGuard';
import { useAuthStore } from '@/store/auth';

function AdminPageContent() {
  const { profile, loading: authLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState(0);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [initializing, setInitializing] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    id: '',
    name: '',
    image: '',
  });
  const [formData, setFormData] = useState(() => ({
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
  }));

  useEffect(() => {
    if (authLoading || !profile) {
      console.log('AdminPage: Waiting for auth...', { authLoading, profile: !!profile });
      return;
    }

      console.log('AdminPage: Loading data...', { profileRole: profile?.role });
    
    const loadData = async () => {
      try {
        await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
        console.log('AdminPage: Data loaded successfully');
      } catch (error) {
        console.error('AdminPage: Error loading data:', error);
      }
    };
    
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, profile]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/products');
      
      if (!response.ok) {
        if (response.status === 403) {
          showSnackbar('Доступ запрещен. Требуются права администратора', 'error');
          setProducts([]);
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showSnackbar(error.message || 'Ошибка загрузки товаров', 'error');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      
      if (!response.ok) {
        if (response.status === 403) {
          console.error('Access forbidden for categories');
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.categories && Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        category: product.category || '',
        categoryId: product.category_id || product.categoryId || '',
        price: product.price || '',
        image: product.image || '',
        images: Array.isArray(product.images) ? product.images.join(', ') : '',
        description: product.description || '',
        specifications: {
          brand: product.specifications?.brand || '',
          model: product.specifications?.model || '',
          memory: product.specifications?.memory || '',
          ram: product.specifications?.ram || '',
          display: product.specifications?.display || '',
          processor: product.specifications?.processor || '',
          camera: product.specifications?.camera || '',
          battery: product.specifications?.battery || '',
          os: product.specifications?.os || '',
          color: product.specifications?.color || '',
          year: product.specifications?.year || '',
          condition: product.specifications?.condition || 'new',
        },
      });
    } else {
      setEditingProduct(null);
      setFormData({
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
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setFormData({
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
  };

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
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.error || 'Ошибка загрузки изображения';
        console.error('Upload error:', errorMessage);
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

      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        showSnackbar(
          editingProduct ? 'Товар обновлен' : 'Товар создан',
          'success'
        );
        handleCloseDialog();
        fetchProducts();
      } else {
        showSnackbar(data.error || 'Ошибка сохранения', 'error');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      showSnackbar('Ошибка сохранения товара', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showSnackbar('Товар удален', 'success');
        fetchProducts();
      } else {
        const data = await response.json();
        showSnackbar(data.error || 'Ошибка удаления', 'error');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showSnackbar('Ошибка удаления товара', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenCategoryDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryFormData({
        id: category.id || '',
        name: category.name || '',
        image: category.image || '',
      });
    } else {
      setEditingCategory(null);
      setCategoryFormData({
        id: '',
        name: '',
        image: '',
      });
    }
    setOpenCategoryDialog(true);
  };

  const handleCloseCategoryDialog = () => {
    setOpenCategoryDialog(false);
    setEditingCategory(null);
    setCategoryFormData({
      id: '',
      name: '',
      image: '',
    });
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryFormData({
      ...categoryFormData,
      [name]: value || '',
    });
  };

  const handleCategoryImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'categories'); // Загружаем в папку categories

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.error || 'Ошибка загрузки изображения';
        console.error('Upload error:', errorMessage);
        showSnackbar(errorMessage, 'error');
        return;
      }

      if (data.path) {
        setCategoryFormData((prev) => ({
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

  const handleCategorySubmit = async () => {
    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryFormData),
      });

      const data = await response.json();

      if (response.ok) {
        showSnackbar(
          editingCategory ? 'Категория обновлена' : 'Категория создана',
          'success'
        );
        handleCloseCategoryDialog();
        fetchCategories();
      } else {
        showSnackbar(data.error || 'Ошибка сохранения', 'error');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      showSnackbar('Ошибка сохранения категории', 'error');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить эту категорию?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showSnackbar('Категория удалена', 'success');
        fetchCategories();
      } else {
        const data = await response.json();
        showSnackbar(data.error || 'Ошибка удаления', 'error');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      showSnackbar('Ошибка удаления категории', 'error');
    }
  };

  const handleInitializeDatabase = async () => {
    if (!confirm('Вы уверены, что хотите инициализировать базу данных? Это добавит все категории и товары из файлов data/categories.json и data/products_new.json. Существующие записи могут быть продублированы.')) {
      return;
    }

    setInitializing(true);
    try {
      const response = await fetch('/api/admin/init-db', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        const { results } = data;
        const message = `Инициализация завершена! Категории: ${results.categories.success} успешно, ${results.categories.failed} ошибок. Товары: ${results.products.success} успешно, ${results.products.failed} ошибок.`;
        showSnackbar(message, 'success');
        
        // Обновляем списки после инициализации
        await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
      } else {
        showSnackbar(data.error || 'Ошибка инициализации базы данных', 'error');
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      showSnackbar('Ошибка инициализации базы данных', 'error');
    } finally {
      setInitializing(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Админ-панель
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleInitializeDatabase}
          disabled={initializing}
          sx={{ ml: 2 }}
        >
          {initializing ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Инициализация...
            </>
          ) : (
            'Инициализировать БД'
          )}
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Товары" />
          <Tab label="Категории" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" component="h2">
              Управление товарами
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Добавить товар
            </Button>
          </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Изображение</TableCell>
                <TableCell>Название</TableCell>
                <TableCell>Категория</TableCell>
                <TableCell>Цена</TableCell>
                <TableCell>Бренд</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>
                    {product.image && (
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={60}
                        height={60}
                        style={{ objectFit: 'cover', borderRadius: 4 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    <Chip label={product.category || product.category_id || '-'} size="small" />
                  </TableCell>
                  <TableCell>{product.price} руб.</TableCell>
                  <TableCell>{product.specifications?.brand || '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(product)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(product.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Редактировать товар' : 'Добавить товар'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
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
                helperText="Или загрузите файл ниже"
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label">
                Загрузить изображение
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingProduct ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
        </>
      )}

      {activeTab === 1 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" component="h2">
              Управление категориями
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenCategoryDialog()}
            >
              Добавить категорию
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Изображение</TableCell>
                    <TableCell>Название</TableCell>
                    <TableCell align="right">Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.id}</TableCell>
                      <TableCell>
                        {category.image && (
                          <Image
                            src={category.image}
                            alt={category.name}
                            width={60}
                            height={60}
                            style={{ objectFit: 'cover', borderRadius: 4 }}
                          />
                        )}
                      </TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenCategoryDialog(category)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Dialog open={openCategoryDialog} onClose={handleCloseCategoryDialog} maxWidth="sm" fullWidth>
            <DialogTitle>
              {editingCategory ? 'Редактировать категорию' : 'Добавить категорию'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="ID категории"
                    name="id"
                    value={categoryFormData.id}
                    onChange={handleCategoryInputChange}
                    disabled={!!editingCategory}
                    helperText={editingCategory ? 'ID нельзя изменить' : 'Будет сгенерирован автоматически, если оставить пустым'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Название"
                    name="name"
                    value={categoryFormData.name}
                    onChange={handleCategoryInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{ mb: 1 }}
                    >
                      Загрузить изображение
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleCategoryImageUpload}
                      />
                    </Button>
                    <TextField
                      fullWidth
                      label="Путь к изображению"
                      name="image"
                      value={categoryFormData.image}
                      onChange={handleCategoryInputChange}
                      helperText="Или введите URL изображения вручную"
                    />
                  </Box>
                </Grid>
                {categoryFormData.image && (
                  <Grid item xs={12}>
                    <Box sx={{ mt: 2 }}>
                      <Image
                        src={categoryFormData.image}
                        alt="Preview"
                        width={200}
                        height={200}
                        style={{ objectFit: 'cover', borderRadius: 4 }}
                      />
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseCategoryDialog}>Отмена</Button>
              <Button onClick={handleCategorySubmit} variant="contained">
                {editingCategory ? 'Сохранить' : 'Создать'}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

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

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminPageContent />
    </AdminGuard>
  );
}

