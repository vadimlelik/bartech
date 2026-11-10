'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { productPublicPath } from '@/shared/lib/product-path';
import Link from 'next/link';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,

  Tabs,
  Tab,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AdminGuard from '@/features/admin-guard/ui/AdminGuard';
import { useAuthStore } from '@/features/auth';
import ImageSelector from '@/features/admin-images/ui/ImageSelector';
import AdminThumbImage from '@/features/admin-images/ui/AdminThumbImage';
import { AdminLeadsTab } from '@/features/admin-leads';
import { LandingManager } from '@/features/admin-landings';

function AdminPageContent() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState(0);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [roleDialogUser, setRoleDialogUser] = useState(null);
  const [roleDialogValue, setRoleDialogValue] = useState('user');
  const [openDeleteUserDialog, setOpenDeleteUserDialog] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [productsLoadingMore, setProductsLoadingMore] = useState(false);
  const [productHasMore, setProductHasMore] = useState(false);
  const [productSearchInput, setProductSearchInput] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const nextProductPageRef = useRef(1);
  const productHasMoreRef = useRef(false);
  const productsLoadingMoreRef = useRef(false);
  const adminLoadingRef = useRef(false);
  const productsScrollRootRef = useRef(null);
  const productsSentinelRef = useRef(null);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [imageSelectorOpen, setImageSelectorOpen] = useState(false);
  const [landingsReload, setLandingsReload] = useState(0);
  const [initializing, setInitializing] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    id: '',
    name: '',
    image: '',
  });
  // Используем ref для отслеживания первой загрузки, чтобы избежать повторных загрузок
  const initialLoadDoneRef = useRef(false);
  const prevAuthLoadingRef = useRef(authLoading);

  const loadTabData = async (tabIndex) => {
    try {
      if (tabIndex === 0 && !productsLoaded) {
        await fetchProducts();
      } else if (tabIndex === 1 && !categoriesLoaded) {
        await fetchCategories();
      } else if (tabIndex === 3 && !usersLoaded) {
        await fetchUsers();
      }
    } catch (error) {
      console.error('Error loading tab data:', error);
    }
  };

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


      loadTabData(activeTab);
    } else if (prevAuthLoading === false && authLoading === false && profile && !initialLoadDoneRef.current) {
      // Если изначально authLoading был false (уже загружен), загружаем данные один раз
      initialLoadDoneRef.current = true;


      loadTabData(activeTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, profile, activeTab]); // Зависим от authLoading, профиля и активного таба

  // Догружаем данные при смене таба после первой инициализации
  useEffect(() => {
    if (!initialLoadDoneRef.current || authLoading || !profile) {
      return;
    }
    loadTabData(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchProducts = useCallback(async (options = { reset: true }) => {
    const reset = options.reset !== false;
    const page = reset ? 1 : nextProductPageRef.current;
    const search = options.search ?? productSearchTerm;

    if (!reset) {
      if (!productHasMoreRef.current || productsLoadingMoreRef.current || adminLoadingRef.current) {
        return;
      }
    }

    try {
      if (reset) {
        setLoading(true);
        adminLoadingRef.current = true;
      } else {
        setProductsLoadingMore(true);
        productsLoadingMoreRef.current = true;
      }

      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const response = await fetch(
        `/api/admin/products?page=${page}&limit=40${searchParam}`,
        { credentials: 'include' },
      );

      if (!response.ok) {
        if (response.status === 403) {
          setSnackbar({
            open: true,
            message: 'Доступ запрещен. Требуются права администратора',
            severity: 'error',
          });
          setProducts([]);
          setProductHasMore(false);
          productHasMoreRef.current = false;
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const batch = Array.isArray(data.products) ? data.products : [];
      const pagination = data.pagination || {};

      if (reset) {
        setProducts(batch);
        nextProductPageRef.current = (pagination.page ?? 1) + 1;
      } else {
        setProducts((prev) => [...prev, ...batch]);
        nextProductPageRef.current = (pagination.page ?? page) + 1;
      }

      const pages = pagination.pages ?? 0;
      const currentPage = pagination.page ?? page;
      const hasMore = pages > 0 && currentPage < pages;
      setProductHasMore(hasMore);
      productHasMoreRef.current = hasMore;
      setProductsLoaded(true);
    } catch (error) {
      console.error('Error fetching products:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Ошибка загрузки товаров',
        severity: 'error',
      });
      if (reset) {
        setProducts([]);
        setProductHasMore(false);
        productHasMoreRef.current = false;
      }
    } finally {
      setLoading(false);
      adminLoadingRef.current = false;
      setProductsLoadingMore(false);
      productsLoadingMoreRef.current = false;
    }
  }, [productSearchTerm]);

  const handleProductSearch = () => {
    const search = productSearchInput.trim();
    setProductSearchTerm(search);
    fetchProducts({ reset: true, search });
  };

  const handleProductSearchReset = () => {
    setProductSearchInput('');
    setProductSearchTerm('');
    fetchProducts({ reset: true, search: '' });
  };

  useEffect(() => {
    productHasMoreRef.current = productHasMore;
  }, [productHasMore]);

  useEffect(() => {
    if (activeTab !== 0 || !productsLoaded) {
      return;
    }
    const root = productsScrollRootRef.current;
    const sentinel = productsSentinelRef.current;
    if (!root || !sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) {
          return;
        }
        if (
          !productHasMoreRef.current ||
          productsLoadingMoreRef.current ||
          adminLoadingRef.current
        ) {
          return;
        }
        fetchProducts({ reset: false });
      },
      { root, rootMargin: '200px', threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [activeTab, productsLoaded, fetchProducts]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
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
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setCategoriesLoaded(true);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users', { credentials: 'include' });

      if (!response.ok) {
        if (response.status === 403) {
          setSnackbar({ open: true, message: 'Доступ запрещен', severity: 'error' });
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setSnackbar({ open: true, message: 'Ошибка загрузки пользователей', severity: 'error' });
    } finally {
      setUsersLoaded(true);
      setLoading(false);
    }
  };

  const handleOpenRoleDialog = (user) => {
    setRoleDialogUser(user);
    setRoleDialogValue(user.role);
    setOpenRoleDialog(true);
  };

  const handleSaveRole = async () => {
    if (!roleDialogUser) return;
    try {
      const response = await fetch(`/api/admin/users/${roleDialogUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: roleDialogValue }),
      });
      const data = await response.json();
      if (!response.ok) {
        showSnackbar(data.error || 'Ошибка изменения роли', 'error');
        return;
      }
      setUsers((prev) => prev.map((u) => (u.id === data.user.id ? data.user : u)));
      showSnackbar('Роль обновлена', 'success');
      setOpenRoleDialog(false);
      setRoleDialogUser(null);
    } catch {
      showSnackbar('Ошибка изменения роли', 'error');
    }
  };

  const handleDeleteUserConfirm = (user) => {
    setDeletingUser(user);
    setOpenDeleteUserDialog(true);
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    try {
      const response = await fetch(`/api/admin/users/${deletingUser.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        showSnackbar(data.error || 'Ошибка удаления', 'error');
        return;
      }
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      showSnackbar('Пользователь удален', 'success');
      setOpenDeleteUserDialog(false);
      setDeletingUser(null);
    } catch {
      showSnackbar('Ошибка удаления пользователя', 'error');
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

  const handleInitializeDatabase = async () => {
    if (
      !confirm(
        'Загрузить данные из папки data в БД? Используются только SQL: categories_rows.sql, products_rows.sql, landing_pages_rows.sql, profiles_rows.sql (все четыре обязательны). Профили пишутся в users с паролем из INIT_DB_IMPORTED_USERS_PASSWORD или по умолчанию ChangeAfterInit!1. Продолжить?'
      )
    ) {
      return;
    }

    setInitializing(true);
    try {
      const response = await fetch('/api/admin/init-db', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        const { results } = data;
        const catSrc = results.categories.source ? ` [${results.categories.source}]` : '';
        const prSrc = results.products.source ? ` [${results.products.source}]` : '';
        const ld = results.landings;
        const us = results.users;
        const usLine = us?.bulkSql
          ? `Пользователи: выполнен SQL${us.source ? ` [${us.source}]` : ''}.`
          : `Пользователи: ${us?.success ?? 0} ок, ${us?.failed ?? 0} ошибок${us?.source ? ` [${us.source}]` : ''}.`;
        const catLine = results.categories.bulkSql
          ? `Категории: выполнен SQL${catSrc}.`
          : `Категории: ${results.categories.success} ок, ${results.categories.failed} ошибок${catSrc}.`;
        const prErr = results.products.errors?.[0]?.error;
        const ldErr = results.landings.errors?.[0]?.error;
        const prLine = results.products.bulkSql
          ? `Товары: выполнен SQL${prSrc}.`
          : `Товары: ${results.products.success} ок, ${results.products.failed} ошибок${prSrc}${prErr ? ` — ${prErr}` : ''}.`;
        const ldLineFinal = ld?.bulkSql
          ? `Лендинги: выполнен SQL${ld.source ? ` [${ld.source}]` : ''}.`
          : `Лендинги: ${ld?.success ?? 0} ок, ${ld?.failed ?? 0} ошибок${ld?.source ? ` [${ld.source}]` : ''}${ldErr ? ` — ${ldErr}` : ''}.`;
        const message = `Готово. ${catLine} ${prLine} ${ldLineFinal} ${usLine}`;
        const hasFailures =
          (results.products.failed > 0 && !results.products.bulkSql) ||
          (results.landings.failed > 0 && !results.landings.bulkSql) ||
          (results.categories.failed > 0 && !results.categories.bulkSql) ||
          (results.users?.failed > 0 && !results.users?.bulkSql);
        showSnackbar(message, hasFailures ? 'warning' : 'success');

        // Обновляем списки после инициализации
        await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
        setProductsLoaded(true);
        setCategoriesLoaded(true);
        setLandingsReload((value) => value + 1);
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
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
        <Typography component="h1" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.25rem' }, letterSpacing: '-0.02em' }}>
          Админ-панель
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button component={Link} href="/admin/cities" variant="contained">
            Города
          </Button>
          <Button component={Link} href="/admin/localities" variant="outlined">
            Населённые пункты
          </Button>
        </Box>
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
          <Tab label="Пользователи" />
          <Tab label="Заявки" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', md: 'center' },
              gap: 2,
              mb: 3,
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            <Typography variant="h5" component="h2">
              Управление товарами
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
              }}
            >
              <TextField
                size="small"
                label="Поиск товаров"
                value={productSearchInput}
                onChange={(event) => setProductSearchInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleProductSearch();
                  }
                }}
                sx={{ minWidth: { xs: '100%', sm: 260 } }}
              />
              <Button variant="outlined" onClick={handleProductSearch}>
                Найти
              </Button>
              {productSearchTerm && (
                <Button variant="text" onClick={handleProductSearchReset}>
                  Сбросить
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push('/admin/products/new')}
              >
                Добавить товар
              </Button>
            </Box>
          </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          ref={productsScrollRootRef}
          component={Paper}
          sx={{ maxHeight: '72vh', overflow: 'auto' }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Изображение</TableCell>
                <TableCell>Название</TableCell>
                <TableCell>Категория</TableCell>
                <TableCell>Цена</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Бренд</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => {
                const isProductOnOrder =
                  (product.availabilityStatus || product.availability_status) === 'on_order';
                const totalPrice = product.totalPrice ?? product.total_price;
                const numericPrice = Number(product.price) || 0;
                const numericTotalPrice = Number(totalPrice) > 0 ? Number(totalPrice) : numericPrice;
                const displayPrice = isProductOnOrder
                  ? numericPrice > 0
                    ? `от ${numericPrice} BYN/мес.`
                    : ''
                  : numericTotalPrice > 0
                    ? `${numericTotalPrice} BYN${numericPrice > 0 ? ` · от ${numericPrice} BYN/мес.` : ''}`
                    : '';

                return (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>
                      {product.image && (
                        <AdminThumbImage
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
                    <TableCell>{displayPrice || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          isProductOnOrder
                            ? 'Нет в наличии, под заказ'
                            : 'В наличии'
                        }
                        color={isProductOnOrder ? 'warning' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{product.specifications?.brand || '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="default"
                        title="Открыть карточку товара"
                        onClick={() => router.push(productPublicPath(product))}
                      >
                        <OpenInNewIcon />
                      </IconButton>
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
                );
              })}
              {productsLoadingMore && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 2, border: 0 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Box ref={productsSentinelRef} sx={{ height: 8, width: '100%' }} aria-hidden />
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
                          <AdminThumbImage
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
                        Выбрать из MinIO
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
                      <AdminThumbImage
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
        <LandingManager onNotify={showSnackbar} reloadToken={landingsReload} />
      )}

      {activeTab === 3 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" component="h2">
              Управление пользователями
            </Typography>
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
                    <TableCell>Email</TableCell>
                    <TableCell>Имя</TableCell>
                    <TableCell>Роль</TableCell>
                    <TableCell>Дата регистрации</TableCell>
                    <TableCell align="right">Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Пользователи не найдены
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.fullName || '—'}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                            color={user.role === 'admin' ? 'primary' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            title="Изменить роль"
                            onClick={() => handleOpenRoleDialog(user)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            title="Удалить пользователя"
                            onClick={() => handleDeleteUserConfirm(user)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Role Change Dialog */}
          <Dialog open={openRoleDialog} onClose={() => setOpenRoleDialog(false)} maxWidth="xs" fullWidth>
            <DialogTitle>Изменить роль пользователя</DialogTitle>
            <DialogContent>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {roleDialogUser?.email}
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Роль</InputLabel>
                <Select
                  value={roleDialogValue}
                  label="Роль"
                  onChange={(e) => setRoleDialogValue(e.target.value)}
                >
                  <MenuItem value="user">Пользователь</MenuItem>
                  <MenuItem value="admin">Администратор</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenRoleDialog(false)}>Отмена</Button>
              <Button onClick={handleSaveRole} variant="contained">Сохранить</Button>
            </DialogActions>
          </Dialog>

          {/* Delete User Confirmation Dialog */}
          <Dialog open={openDeleteUserDialog} onClose={() => setOpenDeleteUserDialog(false)} maxWidth="xs" fullWidth>
            <DialogTitle>Удалить пользователя</DialogTitle>
            <DialogContent>
              <Typography>
                Вы уверены, что хотите удалить пользователя <strong>{deletingUser?.email}</strong>? Это действие нельзя отменить.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDeleteUserDialog(false)}>Отмена</Button>
              <Button onClick={handleDeleteUser} variant="contained" color="error">Удалить</Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      {activeTab === 4 && <AdminLeadsTab />}

      <ImageSelector
        open={imageSelectorOpen}
        onClose={() => setImageSelectorOpen(false)}
        onSelect={(imageUrl) => {
          setCategoryFormData((prev) => ({ ...prev, image: imageUrl }));
          setImageSelectorOpen(false);
        }}
        currentImage={categoryFormData.image}
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

