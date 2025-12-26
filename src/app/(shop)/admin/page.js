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

  Tabs,
  Tab,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Image from 'next/image';
import AdminGuard from '@/components/AdminGuard';
import { useAuthStore } from '@/store/auth';
import ImageSelector from '@/components/admin/ImageSelector';

function AdminPageContent() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState(0);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [landings, setLandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [openLandingDialog, setOpenLandingDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingLanding, setEditingLanding] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [imageSelectorOpen, setImageSelectorOpen] = useState(false);
  const [imageSelectorField, setImageSelectorField] = useState(null);
  const [initializing, setInitializing] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    id: '',
    name: '',
    image: '',
  });
  const [landingFormData, setLandingFormData] = useState({
    slug: '',
    title: '',
    main_title: '',
    description: '',
    main_image: '',
    secondary_image: '',
    benefits: [],
    advantages: [],
    reviews: [],
    pixels: [],
    button_text: 'Узнать цену',
    survey_text: '',
    colors: { header: '#1a1a1a', button: '#4caf50', buttonHover: '#45a049', background: '#ffffff', textColor: '#1a1a1a', bodyBackground: '#ffffff' },
    styles: {},
    is_active: true,
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
      return;
    }

    // Загружаем данные только если это переход с true на false ИЛИ если изначально было false
    if (prevAuthLoading === true && authLoading === false && profile) {
      // Помечаем, что начальная загрузка выполнена ДО загрузки данных
      initialLoadDoneRef.current = true;


      const loadData = async () => {
        try {
          await Promise.all([
            fetchProducts(),
            fetchCategories(),
            fetchLandings(),
          ]);
        } catch (error) {
          // Если произошла ошибка, сбрасываем флаг, чтобы можно было попробовать снова
          initialLoadDoneRef.current = false;
        }
      };

      loadData();
    } else if (prevAuthLoading === false && authLoading === false && profile && !initialLoadDoneRef.current) {
      // Если изначально authLoading был false (уже загружен), загружаем данные один раз
      initialLoadDoneRef.current = true;


      const loadData = async () => {
        try {
          await Promise.all([
            fetchProducts(),
            fetchCategories(),
            fetchLandings(),
          ]);
        } catch (error) {
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

  const fetchLandings = async () => {
    try {
      const response = await fetch('/api/admin/landings');

      if (!response.ok) {
        if (response.status === 403) {
          console.error('Access forbidden for landings');
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.landings && Array.isArray(data.landings)) {
        setLandings(data.landings);
      } else {
        setLandings([]);
      }
    } catch (error) {
      console.error('Error fetching landings:', error);
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
    // Валидация перед отправкой
    if (!categoryFormData.name || categoryFormData.name.trim() === '') {
      showSnackbar('Название категории обязательно', 'error');
      return;
    }

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      // Подготавливаем данные для отправки
      const dataToSend = {
        name: categoryFormData.name.trim(),
        image: categoryFormData.image?.trim() || null,
        description: categoryFormData.description?.trim() || null,
      };

      // Добавляем ID только если он указан (для новых категорий ID будет сгенерирован на сервере)
      if (categoryFormData.id && categoryFormData.id.trim() !== '') {
        dataToSend.id = categoryFormData.id.trim();
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
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

  const handleOpenLandingDialog = (landing = null) => {
    if (landing) {
      setEditingLanding(landing);
      setLandingFormData({
        slug: landing.slug || '',
        title: landing.title || '',
        main_title: landing.main_title || '',
        description: landing.description || '',
        main_image: landing.main_image || '',
        secondary_image: landing.secondary_image || '',
        benefits: Array.isArray(landing.benefits) ? landing.benefits : [],
        advantages: Array.isArray(landing.advantages) ? landing.advantages : [],
        reviews: Array.isArray(landing.reviews) ? landing.reviews : [],
        pixels: Array.isArray(landing.pixels) ? landing.pixels : [],
        button_text: landing.button_text || 'Узнать цену',
        survey_text: landing.survey_text || '',
        colors: landing.colors || { header: '#1a1a1a', button: '#4caf50', buttonHover: '#45a049', background: '#ffffff', textColor: '#1a1a1a', bodyBackground: '#ffffff' },
        styles: landing.styles || {},
        is_active: landing.is_active !== undefined ? landing.is_active : true,
      });
    } else {
      setEditingLanding(null);
      setLandingFormData({
        slug: '',
        title: '',
        main_title: '',
        description: '',
        main_image: '',
        secondary_image: '',
        benefits: [],
        advantages: [],
        reviews: [],
        pixels: [],
        button_text: 'Узнать цену',
        survey_text: '',
        colors: { header: '#1a1a1a', button: '#4caf50', buttonHover: '#45a049', background: '#ffffff', textColor: '#1a1a1a', bodyBackground: '#ffffff' },
        styles: {},
        is_active: true,
      });
    }
    setOpenLandingDialog(true);
  };

  const handleCloseLandingDialog = () => {
    setOpenLandingDialog(false);
    setEditingLanding(null);
    setLandingFormData({
      slug: '',
      title: '',
      main_title: '',
      description: '',
      main_image: '',
      secondary_image: '',
      benefits: [],
      advantages: [],
      reviews: [],
      pixels: [],
      button_text: 'Узнать цену',
      survey_text: '',
      colors: { header: '#1a1a1a', button: '#4caf50', buttonHover: '#45a049', background: '#ffffff', textColor: '#1a1a1a', bodyBackground: '#ffffff' },
      styles: {},
      is_active: true,
    });
  };

  const handleLandingInputChange = (e) => {
    const { name, value } = e.target;
    setLandingFormData({
      ...landingFormData,
      [name]: value || '',
    });
  };

  const handleLandingImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'landings');

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
        setLandingFormData((prev) => ({
          ...prev,
          [field]: data.path || '',
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

  const handleLandingSubmit = async () => {
    // Валидация перед отправкой
    if (!landingFormData.slug || landingFormData.slug.trim() === '') {
      showSnackbar('Slug обязателен', 'error');
      return;
    }

    if (!landingFormData.title || landingFormData.title.trim() === '') {
      showSnackbar('Название обязательно', 'error');
      return;
    }

    // Валидация slug формата
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(landingFormData.slug)) {
      showSnackbar('Slug может содержать только латинские буквы, цифры и дефисы', 'error');
      return;
    }

    try {
      const url = editingLanding
        ? `/api/admin/landings/${editingLanding.id}`
        : '/api/admin/landings';
      const method = editingLanding ? 'PUT' : 'POST';

      const dataToSend = {
        slug: landingFormData.slug.trim(),
        title: landingFormData.title.trim(),
        main_title: landingFormData.main_title?.trim() || null,
        description: landingFormData.description?.trim() || null,
        main_image: landingFormData.main_image?.trim() || null,
        secondary_image: landingFormData.secondary_image?.trim() || null,
        benefits: Array.isArray(landingFormData.benefits) ? landingFormData.benefits : [],
        advantages: Array.isArray(landingFormData.advantages) ? landingFormData.advantages : [],
        reviews: Array.isArray(landingFormData.reviews) ? landingFormData.reviews : [],
        pixels: Array.isArray(landingFormData.pixels) ? landingFormData.pixels : [],
        button_text: landingFormData.button_text || 'Узнать цену',
        survey_text: landingFormData.survey_text?.trim() || null,
        colors: landingFormData.colors || {},
        styles: landingFormData.styles || {},
        is_active: landingFormData.is_active !== undefined ? landingFormData.is_active : true,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        showSnackbar(
          editingLanding ? 'Лендинг обновлен' : 'Лендинг создан',
          'success'
        );
        handleCloseLandingDialog();
        fetchLandings();
      } else {
        showSnackbar(data.error || 'Ошибка сохранения', 'error');
      }
    } catch (error) {
      console.error('Error saving landing:', error);
      showSnackbar('Ошибка сохранения лендинга', 'error');
    }
  };

  const handleDeleteLanding = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этот лендинг?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/landings/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showSnackbar('Лендинг удален', 'success');
        fetchLandings();
      } else {
        const data = await response.json();
        showSnackbar(data.error || 'Ошибка удаления', 'error');
      }
    } catch (error) {
      console.error('Error deleting landing:', error);
      showSnackbar('Ошибка удаления лендинга', 'error');
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
          fetchLandings(),
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
          <Tab label="Лендинги" />
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
                  <TableCell> от {product.price} руб/мес.</TableCell>
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
                    <Box sx={{ display: 'flex', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                      <Button
                        variant="outlined"
                        component="label"
                        sx={{ flex: 1, minWidth: '200px' }}
                      >
                        Загрузить изображение
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleCategoryImageUpload}
                        />
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setImageSelectorOpen(true)}
                        sx={{ flex: 1, minWidth: '200px' }}
                      >
                        Выбрать из базы данных
                      </Button>
                    </Box>
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

      {activeTab === 2 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" component="h2">
              Управление лендингами
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenLandingDialog()}
            >
              Добавить лендинг
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
                    <TableCell>Slug</TableCell>
                    <TableCell>Название</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell align="right">Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {landings.map((landing) => (
                    <TableRow key={landing.id}>
                      <TableCell>{landing.id}</TableCell>
                      <TableCell>
                        <a href={`/${landing.slug}`} target="_blank" rel="noopener noreferrer">
                          /{landing.slug}
                        </a>
                      </TableCell>
                      <TableCell>{landing.title}</TableCell>
                      <TableCell>
                        <Chip
                          label={landing.is_active ? 'Активен' : 'Неактивен'}
                          color={landing.is_active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenLandingDialog(landing)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteLanding(landing.id)}
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

          <Dialog open={openLandingDialog} onClose={handleCloseLandingDialog} maxWidth="md" fullWidth>
            <DialogTitle>
              {editingLanding ? 'Редактировать лендинг' : 'Добавить лендинг'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Slug (URL путь)"
                    name="slug"
                    value={landingFormData.slug}
                    onChange={handleLandingInputChange}
                    disabled={!!editingLanding}
                    required
                    helperText={editingLanding ? 'Slug нельзя изменить' : 'Только латиница, цифры и дефисы (например: my-landing)'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Название"
                    name="title"
                    value={landingFormData.title}
                    onChange={handleLandingInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Главный заголовок"
                    name="main_title"
                    value={landingFormData.main_title}
                    onChange={handleLandingInputChange}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Описание"
                    name="description"
                    value={landingFormData.description}
                    onChange={handleLandingInputChange}
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                      <Button
                        variant="outlined"
                        component="label"
                        size="small"
                      >
                        Загрузить
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => handleLandingImageUpload(e, 'main_image')}
                        />
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setImageSelectorField('main_image');
                          setImageSelectorOpen(true);
                        }}
                      >
                        Выбрать
                      </Button>
                    </Box>
                    <TextField
                      fullWidth
                      label="Главное изображение"
                      name="main_image"
                      value={landingFormData.main_image}
                      onChange={handleLandingInputChange}
                      size="small"
                    />
                    {landingFormData.main_image && (
                      <Box sx={{ mt: 1, position: 'relative' }}>
                        <Box
                          component="img"
                          src={landingFormData.main_image}
                          alt="Preview"
                          onError={(e) => {
                            const errorBox = e.target.nextElementSibling;
                            if (errorBox) {
                              e.target.style.display = 'none';
                              errorBox.style.display = 'flex';
                            }
                          }}
                          sx={{
                            width: 150,
                            height: 150,
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid #ddd',
                          }}
                        />
                        <Box
                          sx={{
                            display: 'none',
                            width: 150,
                            height: 150,
                            border: '1px solid #ddd',
                            borderRadius: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: '#f5f5f5',
                            color: '#999',
                            fontSize: '12px',
                            textAlign: 'center',
                            p: 1,
                          }}
                        >
                          Ошибка загрузки
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                      <Button
                        variant="outlined"
                        component="label"
                        size="small"
                      >
                        Загрузить
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => handleLandingImageUpload(e, 'secondary_image')}
                        />
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setImageSelectorField('secondary_image');
                          setImageSelectorOpen(true);
                        }}
                      >
                        Выбрать
                      </Button>
                    </Box>
                    <TextField
                      fullWidth
                      label="Второстепенное изображение"
                      name="secondary_image"
                      value={landingFormData.secondary_image}
                      onChange={handleLandingInputChange}
                      size="small"
                    />
                    {landingFormData.secondary_image && (
                      <Box sx={{ mt: 1, position: 'relative' }}>
                        <Box
                          component="img"
                          src={landingFormData.secondary_image}
                          alt="Preview"
                          onError={(e) => {
                            const errorBox = e.target.nextElementSibling;
                            if (errorBox) {
                              e.target.style.display = 'none';
                              errorBox.style.display = 'flex';
                            }
                          }}
                          sx={{
                            width: 150,
                            height: 150,
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid #ddd',
                          }}
                        />
                        <Box
                          sx={{
                            display: 'none',
                            width: 150,
                            height: 150,
                            border: '1px solid #ddd',
                            borderRadius: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: '#f5f5f5',
                            color: '#999',
                            fontSize: '12px',
                            textAlign: 'center',
                            p: 1,
                          }}
                        >
                          Ошибка загрузки
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Преимущества (benefits)</Typography>
                  <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 2 }}>
                    {(Array.isArray(landingFormData.benefits) ? landingFormData.benefits : []).map((benefit, index) => (
                      <Box key={index} sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" fontWeight="bold">Преимущество {index + 1}</Typography>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              const newBenefits = [...(landingFormData.benefits || [])];
                              newBenefits.splice(index, 1);
                              setLandingFormData({ ...landingFormData, benefits: newBenefits });
                            }}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                        <TextField
                          fullWidth
                          label="Текст преимущества"
                          value={benefit || ''}
                          onChange={(e) => {
                            const newBenefits = [...(landingFormData.benefits || [])];
                            newBenefits[index] = e.target.value;
                            setLandingFormData({ ...landingFormData, benefits: newBenefits });
                          }}
                          multiline
                          rows={3}
                          size="small"
                          helperText="Можно использовать переносы строк"
                        />
                      </Box>
                    ))}
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setLandingFormData({
                          ...landingFormData,
                          benefits: [...(landingFormData.benefits || []), ''],
                        });
                      }}
                      fullWidth
                    >
                      Добавить преимущество
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Преимущества магазина (advantages)</Typography>
                  <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 2 }}>
                    {(Array.isArray(landingFormData.advantages) ? landingFormData.advantages : []).map((advantage, index) => (
                      <Box key={index} sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" fontWeight="bold">Преимущество {index + 1}</Typography>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              const newAdvantages = [...(landingFormData.advantages || [])];
                              newAdvantages.splice(index, 1);
                              setLandingFormData({ ...landingFormData, advantages: newAdvantages });
                            }}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                        <TextField
                          fullWidth
                          label="Заголовок"
                          value={advantage.title || advantage.name || ''}
                          onChange={(e) => {
                            const newAdvantages = [...(landingFormData.advantages || [])];
                            newAdvantages[index] = { ...newAdvantages[index], title: e.target.value };
                            setLandingFormData({ ...landingFormData, advantages: newAdvantages });
                          }}
                          size="small"
                          sx={{ mb: 1 }}
                        />
                        <TextField
                          fullWidth
                          label="Описание"
                          value={advantage.description || advantage.desc || ''}
                          onChange={(e) => {
                            const newAdvantages = [...(landingFormData.advantages || [])];
                            newAdvantages[index] = { ...newAdvantages[index], description: e.target.value };
                            setLandingFormData({ ...landingFormData, advantages: newAdvantages });
                          }}
                          multiline
                          rows={2}
                          size="small"
                        />
                      </Box>
                    ))}
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        const newAdvantages = [...(landingFormData.advantages || []), { title: '', description: '' }];
                        setLandingFormData({ ...landingFormData, advantages: newAdvantages });
                      }}
                      fullWidth
                    >
                      Добавить преимущество
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Отзывы (reviews)</Typography>
                  <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 2 }}>
                    {(Array.isArray(landingFormData.reviews) ? landingFormData.reviews : []).map((review, index) => {
                      // Убеждаемся, что review - это объект
                      const safeReview = review && typeof review === 'object' ? review : { text: '', image: '' };
                      const currentText = safeReview.text || safeReview.comment || '';
                      const currentImage = safeReview.image || '';

                      return (
                        <Box key={index} sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" fontWeight="bold">Отзыв {index + 1}</Typography>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                const currentReviews = Array.isArray(landingFormData.reviews) ? [...landingFormData.reviews] : [];
                                currentReviews.splice(index, 1);
                                setLandingFormData({ ...landingFormData, reviews: currentReviews });
                              }}
                            >
                              <RemoveIcon />
                            </IconButton>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                            <Button
                              variant="outlined"
                              component="label"
                              size="small"
                              sx={{ flex: 1, minWidth: '150px' }}
                            >
                              Загрузить изображение
                              <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files[0];
                                  if (!file) return;
                                  try {
                                    const formData = new FormData();
                                    formData.append('file', file);
                                    formData.append('folder', 'landings');
                                    const response = await fetch('/api/admin/upload', {
                                      method: 'POST',
                                      body: formData,
                                    });
                                    const data = await response.json();
                                    if (response.ok && data.path) {
                                      setLandingFormData((prev) => {
                                        const currentReviews = Array.isArray(prev.reviews) ? [...prev.reviews] : [];
                                        if (!currentReviews[index]) {
                                          currentReviews[index] = { text: '', image: '' };
                                        }
                                        currentReviews[index] = { ...currentReviews[index], image: data.path };
                                        return { ...prev, reviews: currentReviews };
                                      });
                                      showSnackbar('Изображение загружено', 'success');
                                    }
                                  } catch (error) {
                                    showSnackbar('Ошибка загрузки изображения', 'error');
                                  }
                                }}
                              />
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              sx={{ flex: 1, minWidth: '150px' }}
                              onClick={() => {
                                setImageSelectorField(`review_${index}`);
                                setImageSelectorOpen(true);
                              }}
                            >
                              Выбрать из базы
                            </Button>
                          </Box>
                          <TextField
                            fullWidth
                            label="Путь к изображению"
                            value={currentImage}
                            onChange={(e) => {
                              setLandingFormData((prev) => {
                                const currentReviews = Array.isArray(prev.reviews) ? [...prev.reviews] : [];
                                if (!currentReviews[index]) {
                                  currentReviews[index] = { text: '', image: '' };
                                }
                                currentReviews[index] = { ...currentReviews[index], image: e.target.value };
                                return { ...prev, reviews: currentReviews };
                              });
                            }}
                            size="small"
                            sx={{ mb: 1 }}
                          />
                          {currentImage && (
                            <Box sx={{ mb: 1, position: 'relative' }}>
                              <Box
                                component="img"
                                src={currentImage}
                                alt="Preview"
                                onError={(e) => {
                                  const errorBox = e.target.nextElementSibling;
                                  if (errorBox) {
                                    e.target.style.display = 'none';
                                    errorBox.style.display = 'flex';
                                  }
                                }}
                                sx={{
                                  width: 100,
                                  height: 100,
                                  objectFit: 'cover',
                                  borderRadius: 1,
                                  border: '1px solid #ddd',
                                }}
                              />
                              <Box
                                sx={{
                                  display: 'none',
                                  width: 100,
                                  height: 100,
                                  border: '1px solid #ddd',
                                  borderRadius: 1,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  bgcolor: '#f5f5f5',
                                  color: '#999',
                                  fontSize: '12px',
                                  textAlign: 'center',
                                  p: 1,
                                }}
                              >
                                Ошибка загрузки
                              </Box>
                            </Box>
                          )}
                          <TextField
                            fullWidth
                            label="Текст отзыва"
                            value={currentText}
                            onChange={(e) => {
                              setLandingFormData((prev) => {
                                const currentReviews = Array.isArray(prev.reviews) ? [...prev.reviews] : [];
                                if (!currentReviews[index]) {
                                  currentReviews[index] = { text: '', image: '' };
                                }
                                currentReviews[index] = { ...currentReviews[index], text: e.target.value };
                                return { ...prev, reviews: currentReviews };
                              });
                            }}
                            multiline
                            rows={3}
                            size="small"
                          />
                        </Box>
                      );
                    })}
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        const currentReviews = Array.isArray(landingFormData.reviews) ? landingFormData.reviews : [];
                        const newReviews = [...currentReviews, { text: '', image: '' }];
                        setLandingFormData({ ...landingFormData, reviews: newReviews });
                      }}
                      fullWidth
                    >
                      Добавить отзыв
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>TikTok Пиксели</Typography>
                  <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 2 }}>
                    {(Array.isArray(landingFormData.pixels) ? landingFormData.pixels : []).map((pixel, index) => (
                      <Box key={index} sx={{ mb: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField
                          fullWidth
                          label={`Пиксель ${index + 1}`}
                          value={pixel || ''}
                          onChange={(e) => {
                            const currentPixels = Array.isArray(landingFormData.pixels) ? landingFormData.pixels : [];
                            const newPixels = [...currentPixels];
                            newPixels[index] = e.target.value.trim();
                            setLandingFormData({ ...landingFormData, pixels: newPixels });
                          }}
                          size="small"
                          placeholder="Введите ID пикселя"
                        />
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            const currentPixels = Array.isArray(landingFormData.pixels) ? landingFormData.pixels : [];
                            const newPixels = [...currentPixels];
                            newPixels.splice(index, 1);
                            setLandingFormData({ ...landingFormData, pixels: newPixels });
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Box>
                    ))}
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        const currentPixels = Array.isArray(landingFormData.pixels) ? landingFormData.pixels : [];
                        const newPixels = [...currentPixels, ''];
                        setLandingFormData({ ...landingFormData, pixels: newPixels });
                      }}
                      fullWidth
                    >
                      Добавить пиксель
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Текст кнопки"
                    name="button_text"
                    value={landingFormData.button_text}
                    onChange={handleLandingInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Текст перед кнопкой"
                    name="survey_text"
                    value={landingFormData.survey_text}
                    onChange={handleLandingInputChange}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Цвета</Typography>
                  <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <input
                            type="color"
                            value={landingFormData.colors?.header || '#1a1a1a'}
                            onChange={(e) => {
                              setLandingFormData({
                                ...landingFormData,
                                colors: { ...(landingFormData.colors || {}), header: e.target.value },
                              });
                            }}
                            style={{ width: 50, height: 40, border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' }}
                          />
                          <TextField
                            fullWidth
                            label="Цвет заголовка (header)"
                            value={landingFormData.colors?.header || '#1a1a1a'}
                            onChange={(e) => {
                              setLandingFormData({
                                ...landingFormData,
                                colors: { ...(landingFormData.colors || {}), header: e.target.value },
                              });
                            }}
                            size="small"
                            placeholder="#1a1a1a"
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <input
                            type="color"
                            value={landingFormData.colors?.button || '#4caf50'}
                            onChange={(e) => {
                              setLandingFormData({
                                ...landingFormData,
                                colors: { ...(landingFormData.colors || {}), button: e.target.value },
                              });
                            }}
                            style={{ width: 50, height: 40, border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' }}
                          />
                          <TextField
                            fullWidth
                            label="Цвет кнопки (button)"
                            value={landingFormData.colors?.button || '#4caf50'}
                            onChange={(e) => {
                              setLandingFormData({
                                ...landingFormData,
                                colors: { ...(landingFormData.colors || {}), button: e.target.value },
                              });
                            }}
                            size="small"
                            placeholder="#4caf50"
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <input
                            type="color"
                            value={landingFormData.colors?.buttonHover || '#45a049'}
                            onChange={(e) => {
                              setLandingFormData({
                                ...landingFormData,
                                colors: { ...(landingFormData.colors || {}), buttonHover: e.target.value },
                              });
                            }}
                            style={{ width: 50, height: 40, border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' }}
                          />
                          <TextField
                            fullWidth
                            label="Цвет кнопки при наведении (buttonHover)"
                            value={landingFormData.colors?.buttonHover || '#45a049'}
                            onChange={(e) => {
                              setLandingFormData({
                                ...landingFormData,
                                colors: { ...(landingFormData.colors || {}), buttonHover: e.target.value },
                              });
                            }}
                            size="small"
                            placeholder="#45a049"
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <input
                            type="color"
                            value={landingFormData.colors?.background || '#ffffff'}
                            onChange={(e) => {
                              setLandingFormData({
                                ...landingFormData,
                                colors: { ...(landingFormData.colors || {}), background: e.target.value },
                              });
                            }}
                            style={{ width: 50, height: 40, border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' }}
                          />
                          <TextField
                            fullWidth
                            label="Цвет фона страницы (background)"
                            value={landingFormData.colors?.background || '#ffffff'}
                            onChange={(e) => {
                              setLandingFormData({
                                ...landingFormData,
                                colors: { ...(landingFormData.colors || {}), background: e.target.value },
                              });
                            }}
                            size="small"
                            placeholder="#ffffff"
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <input
                            type="color"
                            value={landingFormData.colors?.textColor || '#1a1a1a'}
                            onChange={(e) => {
                              setLandingFormData({
                                ...landingFormData,
                                colors: { ...(landingFormData.colors || {}), textColor: e.target.value },
                              });
                            }}
                            style={{ width: 50, height: 40, border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' }}
                          />
                          <TextField
                            fullWidth
                            label="Цвет текста (textColor)"
                            value={landingFormData.colors?.textColor || '#1a1a1a'}
                            onChange={(e) => {
                              setLandingFormData({
                                ...landingFormData,
                                colors: { ...(landingFormData.colors || {}), textColor: e.target.value },
                              });
                            }}
                            size="small"
                            placeholder="#1a1a1a"
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <input
                            type="color"
                            value={landingFormData.colors?.bodyBackground || '#ffffff'}
                            onChange={(e) => {
                              setLandingFormData({
                                ...landingFormData,
                                colors: { ...(landingFormData.colors || {}), bodyBackground: e.target.value },
                              });
                            }}
                            style={{ width: 50, height: 40, border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' }}
                          />
                          <TextField
                            fullWidth
                            label="Фон за лендингом (bodyBackground)"
                            value={landingFormData.colors?.bodyBackground || '#ffffff'}
                            onChange={(e) => {
                              setLandingFormData({
                                ...landingFormData,
                                colors: { ...(landingFormData.colors || {}), bodyBackground: e.target.value },
                              });
                            }}
                            size="small"
                            placeholder="#ffffff"
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={landingFormData.is_active}
                      onChange={(e) => setLandingFormData({ ...landingFormData, is_active: e.target.checked })}
                      style={{ marginRight: 8 }}
                    />
                    <Typography>Активен</Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseLandingDialog}>Отмена</Button>
              <Button onClick={handleLandingSubmit} variant="contained">
                {editingLanding ? 'Сохранить' : 'Создать'}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      <ImageSelector
        open={imageSelectorOpen}
        onClose={() => {
          setImageSelectorOpen(false);
          setImageSelectorField(null);
        }}
        onSelect={(imageUrl) => {
          if (imageSelectorField) {
            if (imageSelectorField.startsWith('review_')) {
              const index = parseInt(imageSelectorField.replace('review_', ''));
              const currentReviews = Array.isArray(landingFormData.reviews) ? landingFormData.reviews : [];
              const newReviews = [...currentReviews];
              if (!newReviews[index]) {
                newReviews[index] = { text: '', image: '' };
              }
              newReviews[index] = { ...newReviews[index], image: imageUrl };
              setLandingFormData({ ...landingFormData, reviews: newReviews });
            } else {
              setLandingFormData((prev) => ({ ...prev, [imageSelectorField]: imageUrl }));
            }
          } else {
            setCategoryFormData((prev) => ({ ...prev, image: imageUrl }));
          }
          setImageSelectorOpen(false);
          setImageSelectorField(null);
        }}
        currentImage={
          imageSelectorField
            ? imageSelectorField.startsWith('review_')
              ? landingFormData.reviews?.[parseInt(imageSelectorField.replace('review_', ''))]?.image
              : landingFormData[imageSelectorField]
            : categoryFormData.image
        }
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

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminPageContent />
    </AdminGuard>
  );
}

