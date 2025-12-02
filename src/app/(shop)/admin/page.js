'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { profile, loading: authLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState(0);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [initializing, setInitializing] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    id: '',
    name: '',
    image: '',
  });

  // Используем ref для отслеживания первой загрузки, чтобы избежать повторных загрузок
  const initialLoadDoneRef = useRef(false);
  const prevAuthLoadingRef = useRef(authLoading);

  useEffect(() => {
    // Если уже загружали данные, больше не загружаем - это ключевая проверка!
    if (initialLoadDoneRef.current) {
      return;
    }

    // Отслеживаем изменение authLoading
    const prevAuthLoading = prevAuthLoadingRef.current;
    prevAuthLoadingRef.current = authLoading;

    // Загружаем данные только когда authLoading меняется с true на false (первая загрузка)
    if (authLoading || !profile) {
      console.log('AdminPage: Waiting for auth...', { authLoading, profile: !!profile });
      return;
    }

    // Загружаем данные только если это переход с true на false ИЛИ если изначально было false
    if (prevAuthLoading === true && authLoading === false && profile) {
      // Помечаем, что начальная загрузка выполнена ДО загрузки данных
      initialLoadDoneRef.current = true;

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
          // Если произошла ошибка, сбрасываем флаг, чтобы можно было попробовать снова
          initialLoadDoneRef.current = false;
        }
      };
      
      loadData();
    } else if (prevAuthLoading === false && authLoading === false && profile && !initialLoadDoneRef.current) {
      // Если изначально authLoading был false (уже загружен), загружаем данные один раз
      initialLoadDoneRef.current = true;

      console.log('AdminPage: Loading data (initial state)...', { profileRole: profile?.role });
      
      const loadData = async () => {
        try {
          await Promise.all([
            fetchProducts(),
            fetchCategories(),
          ]);
          console.log('AdminPage: Data loaded successfully');
        } catch (error) {
          console.error('AdminPage: Error loading data:', error);
          initialLoadDoneRef.current = false;
        }
      };
      
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading]); // Зависим только от authLoading

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
              onClick={() => router.push('/admin/products/new')}
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
                      onClick={() => router.push(`/admin/products/${product.id}/edit`)}
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

