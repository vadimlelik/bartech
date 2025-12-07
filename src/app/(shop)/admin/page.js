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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
  const [landingPages, setLandingPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [openLandingDialog, setOpenLandingDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingLandingPage, setEditingLandingPage] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [initializing, setInitializing] = useState(false);
  const [storageImages, setStorageImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [imageGalleryOpen, setImageGalleryOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    id: '',
    name: '',
    image: '',
  });
  const [landingFormData, setLandingFormData] = useState({
    slug: '',
    title: '',
    theme: 'phone2',
    content: {
      rating: '',
      title: '',
      infoItems: [],
      heroTitle: '',
      benefits: [],
      advantages: [],
      reviews: [],
      quizPrompt: '',
      buttonText: '',
      questions: [],
    },
    images: [],
    pixels: [],
    is_active: true,
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
          fetchLandingPages(),
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

  const fetchLandingPages = async () => {
    try {
      const response = await fetch('/api/admin/landing-pages');
      
      if (!response.ok) {
        if (response.status === 403) {
          console.error('Access forbidden for landing pages');
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.landingPages && Array.isArray(data.landingPages)) {
        setLandingPages(data.landingPages);
      } else {
        setLandingPages([]);
      }
    } catch (error) {
      console.error('Error fetching landing pages:', error);
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

  const handleOpenLandingDialog = (landingPage = null) => {
    if (landingPage) {
      setEditingLandingPage(landingPage);
      const content = landingPage.content || {};
      setLandingFormData({
        slug: landingPage.slug || '',
        title: landingPage.title || '',
        theme: landingPage.theme || 'phone2',
        content: {
          rating: content.rating || '',
          title: content.title || '',
          infoItems: content.infoItems || [],
          heroTitle: content.heroTitle || '',
          benefits: content.benefits || [],
          advantages: content.advantages || [],
          reviews: content.reviews || [],
          quizPrompt: content.quizPrompt || '',
          buttonText: content.buttonText || '',
          questions: Array.isArray(content.questions) ? content.questions : [],
        },
        images: Array.isArray(landingPage.images) ? landingPage.images : [],
        pixels: Array.isArray(landingPage.pixels) ? landingPage.pixels : [],
        is_active: landingPage.is_active !== undefined ? landingPage.is_active : true,
      });
    } else {
      setEditingLandingPage(null);
      setLandingFormData({
        slug: '',
        title: '',
        theme: 'phone2',
        content: {
          rating: '',
          title: '',
          infoItems: [],
          heroTitle: '',
          benefits: [],
          advantages: [],
          reviews: [],
          quizPrompt: '',
          buttonText: '',
          questions: [],
        },
        images: [],
        pixels: [],
        is_active: true,
      });
    }
    setOpenLandingDialog(true);
  };

  const handleCloseLandingDialog = () => {
    setOpenLandingDialog(false);
    setEditingLandingPage(null);
    setLandingFormData({
      slug: '',
      title: '',
      theme: 'phone2',
      content: {
        rating: '',
        title: '',
        infoItems: [],
        heroTitle: '',
        benefits: [],
        advantages: [],
        reviews: [],
        quizPrompt: '',
        buttonText: '',
      },
      images: [],
      pixels: [],
      is_active: true,
    });
  };

  const handleLandingInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('content.')) {
      const contentKey = name.split('.')[1];
      setLandingFormData({
        ...landingFormData,
        content: {
          ...landingFormData.content,
          [contentKey]: value,
        },
      });
    } else if (name === 'is_active') {
      setLandingFormData({
        ...landingFormData,
        [name]: checked,
      });
    } else {
      setLandingFormData({
        ...landingFormData,
        [name]: value,
      });
    }
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: '',
      type: 'text',
      options: [],
    };
    setLandingFormData({
      ...landingFormData,
      content: {
        ...landingFormData.content,
        questions: [...(landingFormData.content?.questions || []), newQuestion],
      },
    });
  };

  const handleRemoveQuestion = (questionId) => {
    setLandingFormData({
      ...landingFormData,
      content: {
        ...landingFormData.content,
        questions: (landingFormData.content?.questions || []).filter(q => q.id !== questionId),
      },
    });
  };

  const handleUpdateQuestion = (questionId, field, value) => {
    setLandingFormData({
      ...landingFormData,
      content: {
        ...landingFormData.content,
        questions: (landingFormData.content?.questions || []).map(q => 
          q.id === questionId ? { ...q, [field]: value } : q
        ),
      },
    });
  };

  const handleAddOption = (questionId) => {
    setLandingFormData({
      ...landingFormData,
      content: {
        ...landingFormData.content,
        questions: (landingFormData.content?.questions || []).map(q => 
          q.id === questionId 
            ? { ...q, options: [...(q.options || []), { value: '', label: '' }] }
            : q
        ),
      },
    });
  };

  const handleRemoveOption = (questionId, optionIndex) => {
    setLandingFormData({
      ...landingFormData,
      content: {
        ...landingFormData.content,
        questions: (landingFormData.content?.questions || []).map(q => 
          q.id === questionId 
            ? { ...q, options: q.options.filter((_, i) => i !== optionIndex) }
            : q
        ),
      },
    });
  };

  const handleUpdateOption = (questionId, optionIndex, field, value) => {
    setLandingFormData({
      ...landingFormData,
      content: {
        ...landingFormData.content,
        questions: (landingFormData.content?.questions || []).map(q => 
          q.id === questionId 
            ? { 
                ...q, 
                options: q.options.map((opt, i) => 
                  i === optionIndex ? { ...opt, [field]: value } : opt
                )
              }
            : q
        ),
      },
    });
  };

  const handleAddPixel = () => {
    setLandingFormData({
      ...landingFormData,
      pixels: [...(landingFormData.pixels || []), ''],
    });
  };

  const handleRemovePixel = (index) => {
    setLandingFormData({
      ...landingFormData,
      pixels: landingFormData.pixels.filter((_, i) => i !== index),
    });
  };

  const handleUpdatePixel = (index, value) => {
    const newPixels = [...(landingFormData.pixels || [])];
    newPixels[index] = value.trim();
    setLandingFormData({
      ...landingFormData,
      pixels: newPixels,
    });
  };

  const handleLandingImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'landing');

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
          images: [...prev.images, data.path],
        }));
        showSnackbar('Изображение загружено', 'success');
        // Обновляем список изображений из Storage
        fetchStorageImages();
      } else {
        showSnackbar('Ошибка: путь к изображению не получен', 'error');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showSnackbar(`Ошибка загрузки: ${error.message || 'Неизвестная ошибка'}`, 'error');
    }
  };

  const fetchStorageImages = async () => {
    try {
      setLoadingImages(true);
      const response = await fetch('/api/admin/images');
      
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      
      const data = await response.json();
      setStorageImages(data.images || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      showSnackbar('Ошибка загрузки изображений из Storage', 'error');
    } finally {
      setLoadingImages(false);
    }
  };

  const handleOpenImageGallery = () => {
    setImageGalleryOpen(true);
    if (storageImages.length === 0) {
      fetchStorageImages();
    }
  };

  const handleSelectImageFromGallery = (imagePath) => {
    if (!landingFormData.images.includes(imagePath)) {
      setLandingFormData((prev) => ({
        ...prev,
        images: [...prev.images, imagePath],
      }));
      showSnackbar('Изображение добавлено', 'success');
    } else {
      showSnackbar('Изображение уже добавлено', 'warning');
    }
    setImageGalleryOpen(false);
  };

  const handleLandingSubmit = async () => {
    try {
      // Валидация и очистка вопросов
      const cleanedQuestions = (landingFormData.content?.questions || []).map((q, index) => {
        const cleanedQ = {
          id: q.id || index + 1,
          question: q.question || '',
          type: q.type || 'text',
        };
        
        // Добавляем options только для radio и checkbox
        if (cleanedQ.type === 'radio' || cleanedQ.type === 'checkbox') {
          cleanedQ.options = (q.options || []).filter(opt => opt.value && opt.label).map(opt => ({
            value: opt.value,
            label: opt.label,
          }));
        }
        
        return cleanedQ;
      }).filter(q => q.question.trim() !== ''); // Удаляем пустые вопросы

      // Очистка пикселей - удаляем пустые значения
      const cleanedPixels = (landingFormData.pixels || [])
        .map(p => p.trim())
        .filter(p => p !== '');

      const submitData = {
        slug: landingFormData.slug,
        title: landingFormData.title,
        theme: landingFormData.theme,
        content: {
          ...landingFormData.content,
          questions: cleanedQuestions,
        },
        images: landingFormData.images,
        pixels: cleanedPixels,
        is_active: landingFormData.is_active,
      };

      const url = editingLandingPage
        ? `/api/admin/landing-pages/${editingLandingPage.id}`
        : '/api/admin/landing-pages';
      const method = editingLandingPage ? 'PUT' : 'POST';

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
          editingLandingPage ? 'Landing страница обновлена' : 'Landing страница создана',
          'success'
        );
        handleCloseLandingDialog();
        fetchLandingPages();
      } else {
        showSnackbar(data.error || 'Ошибка сохранения', 'error');
      }
    } catch (error) {
      console.error('Error saving landing page:', error);
      showSnackbar('Ошибка сохранения landing страницы', 'error');
    }
  };

  const handleDeleteLandingPage = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить эту landing страницу?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/landing-pages/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showSnackbar('Landing страница удалена', 'success');
        fetchLandingPages();
      } else {
        const data = await response.json();
        showSnackbar(data.error || 'Ошибка удаления', 'error');
      }
    } catch (error) {
      console.error('Error deleting landing page:', error);
      showSnackbar('Ошибка удаления landing страницы', 'error');
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
          <Tab label="Landing Pages" />
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

      {activeTab === 2 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" component="h2">
              Управление Landing Pages
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenLandingDialog()}
            >
              Добавить Landing Page
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
                    <TableCell>Тема</TableCell>
                    <TableCell>Активна</TableCell>
                    <TableCell align="right">Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {landingPages.map((landingPage) => (
                    <TableRow key={landingPage.id}>
                      <TableCell>{landingPage.id}</TableCell>
                      <TableCell>{landingPage.slug}</TableCell>
                      <TableCell>{landingPage.title}</TableCell>
                      <TableCell>
                        <Chip label={landingPage.theme} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={landingPage.is_active ? 'Да' : 'Нет'} 
                          color={landingPage.is_active ? 'success' : 'default'}
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenLandingDialog(landingPage)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteLandingPage(landingPage.id)}
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

          <Dialog open={openLandingDialog} onClose={handleCloseLandingDialog} maxWidth="lg" fullWidth>
            <DialogTitle>
              {editingLandingPage ? 'Редактировать Landing Page' : 'Добавить Landing Page'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Slug (URL)"
                    name="slug"
                    value={landingFormData.slug}
                    onChange={handleLandingInputChange}
                    required
                    helperText="Например: new-phone-offer"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Название"
                    name="title"
                    value={landingFormData.title}
                    onChange={handleLandingInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Тема</InputLabel>
                    <Select
                      value={landingFormData.theme}
                      label="Тема"
                      name="theme"
                      onChange={handleLandingInputChange}
                    >
                      <MenuItem value="phone2">Phone2</MenuItem>
                      <MenuItem value="phone3">Phone3</MenuItem>
                      <MenuItem value="phone4">Phone4</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <input
                      type="checkbox"
                      id="is_active"
                      name="is_active"
                      checked={landingFormData.is_active}
                      onChange={handleLandingInputChange}
                      style={{ marginRight: 8 }}
                    />
                    <label htmlFor="is_active">Активна</label>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    Контент
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Рейтинг"
                    name="content.rating"
                    value={landingFormData.content?.rating || ''}
                    onChange={handleLandingInputChange}
                    helperText="Например: (4,9) ⭐️⭐️⭐️⭐️⭐️ 1031 отзыв"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Заголовок"
                    name="content.title"
                    value={landingFormData.content?.title || ''}
                    onChange={handleLandingInputChange}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Hero заголовок"
                    name="content.heroTitle"
                    value={landingFormData.content?.heroTitle || ''}
                    onChange={handleLandingInputChange}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Текст кнопки"
                    name="content.buttonText"
                    value={landingFormData.content?.buttonText || ''}
                    onChange={handleLandingInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Призыв к действию"
                    name="content.quizPrompt"
                    value={landingFormData.content?.quizPrompt || ''}
                    onChange={handleLandingInputChange}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    Изображения
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Button variant="outlined" component="label">
                      Загрузить новое
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleLandingImageUpload}
                      />
                    </Button>
                    <Button variant="outlined" onClick={handleOpenImageGallery}>
                      Выбрать из Storage
                    </Button>
                  </Box>
                  {landingFormData.images && landingFormData.images.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                      {landingFormData.images.map((img, index) => (
                        <Box key={index} sx={{ position: 'relative' }}>
                          <Image
                            src={img}
                            alt={`Image ${index + 1}`}
                            width={100}
                            height={100}
                            style={{ objectFit: 'cover', borderRadius: 4 }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => {
                              setLandingFormData({
                                ...landingFormData,
                                images: landingFormData.images.filter((_, i) => i !== index),
                              });
                            }}
                            sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'error.main', color: 'white' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    Вопросы для формы
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleAddQuestion}
                      size="small"
                    >
                      Добавить вопрос
                    </Button>
                  </Box>
                  {landingFormData.content?.questions && landingFormData.content.questions.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      {landingFormData.content.questions.map((question, qIndex) => (
                        <Accordion key={question.id} sx={{ mb: 1 }}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="subtitle1">
                              Вопрос {qIndex + 1}: {question.question || 'Новый вопрос'}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Текст вопроса"
                                  value={question.question || ''}
                                  onChange={(e) => handleUpdateQuestion(question.id, 'question', e.target.value)}
                                  required
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                  <InputLabel>Тип вопроса</InputLabel>
                                  <Select
                                    value={question.type || 'text'}
                                    label="Тип вопроса"
                                    onChange={(e) => handleUpdateQuestion(question.id, 'type', e.target.value)}
                                  >
                                    <MenuItem value="text">Текст</MenuItem>
                                    <MenuItem value="radio">Один вариант (radio)</MenuItem>
                                    <MenuItem value="checkbox">Несколько вариантов (checkbox)</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                              {(question.type === 'radio' || question.type === 'checkbox') && (
                                <>
                                  <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                      Варианты ответов
                                    </Typography>
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      startIcon={<AddIcon />}
                                      onClick={() => handleAddOption(question.id)}
                                      sx={{ mb: 2 }}
                                    >
                                      Добавить вариант
                                    </Button>
                                  </Grid>
                                  {question.options && question.options.map((option, optIndex) => (
                                    <Grid item xs={12} key={optIndex}>
                                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <TextField
                                          fullWidth
                                          label="Значение"
                                          size="small"
                                          value={option.value || ''}
                                          onChange={(e) => handleUpdateOption(question.id, optIndex, 'value', e.target.value)}
                                          placeholder="value"
                                        />
                                        <TextField
                                          fullWidth
                                          label="Текст"
                                          size="small"
                                          value={option.label || ''}
                                          onChange={(e) => handleUpdateOption(question.id, optIndex, 'label', e.target.value)}
                                          placeholder="label"
                                        />
                                        <IconButton
                                          color="error"
                                          onClick={() => handleRemoveOption(question.id, optIndex)}
                                          size="small"
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      </Box>
                                    </Grid>
                                  ))}
                                </>
                              )}
                              <Grid item xs={12}>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  startIcon={<DeleteIcon />}
                                  onClick={() => handleRemoveQuestion(question.id)}
                                  size="small"
                                >
                                  Удалить вопрос
                                </Button>
                              </Grid>
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    Пиксели (TikTok)
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleAddPixel}
                      size="small"
                    >
                      Добавить пиксель
                    </Button>
                  </Box>
                  {landingFormData.pixels && landingFormData.pixels.length > 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {landingFormData.pixels.map((pixel, index) => (
                        <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <TextField
                            fullWidth
                            label={`ID пикселя ${index + 1}`}
                            value={pixel || ''}
                            onChange={(e) => handleUpdatePixel(index, e.target.value)}
                            placeholder="Введите ID пикселя"
                            size="small"
                          />
                          <IconButton
                            color="error"
                            onClick={() => handleRemovePixel(index)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                  {(!landingFormData.pixels || landingFormData.pixels.length === 0) && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Нет добавленных пикселей. Нажмите "Добавить пиксель" для добавления.
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseLandingDialog}>Отмена</Button>
              <Button onClick={handleLandingSubmit} variant="contained">
                {editingLandingPage ? 'Сохранить' : 'Создать'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Галерея изображений из Storage */}
          <Dialog 
            open={imageGalleryOpen} 
            onClose={() => setImageGalleryOpen(false)} 
            maxWidth="md" 
            fullWidth
          >
            <DialogTitle>
              Выбрать изображение из Storage
            </DialogTitle>
            <DialogContent>
              {loadingImages ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Найдено изображений: {storageImages.length}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={fetchStorageImages}
                    >
                      Обновить
                    </Button>
                  </Box>
                  {storageImages.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                      Нет изображений в Storage
                    </Typography>
                  ) : (
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                        gap: 2,
                        maxHeight: '60vh',
                        overflowY: 'auto',
                        p: 1,
                      }}
                    >
                      {storageImages.map((image, index) => (
                        <Box
                          key={index}
                          sx={{
                            position: 'relative',
                            cursor: 'pointer',
                            border: landingFormData.images.includes(image.path) 
                              ? '2px solid #1976d2' 
                              : '2px solid transparent',
                            borderRadius: 1,
                            overflow: 'hidden',
                            '&:hover': {
                              border: '2px solid #1976d2',
                            },
                          }}
                          onClick={() => handleSelectImageFromGallery(image.path)}
                        >
                          <Image
                            src={image.path}
                            alt={image.name}
                            width={120}
                            height={120}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          {landingFormData.images.includes(image.path) && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                bgcolor: 'primary.main',
                                color: 'white',
                                borderRadius: '50%',
                                width: 24,
                                height: 24,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                              }}
                            >
                              ✓
                            </Box>
                          )}
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              bgcolor: 'rgba(0, 0, 0, 0.7)',
                              color: 'white',
                              p: 0.5,
                              fontSize: '10px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            title={image.name}
                          >
                            {image.name}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setImageGalleryOpen(false)}>Закрыть</Button>
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

