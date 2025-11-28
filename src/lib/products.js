// Используем Supabase для получения товаров
// Если нужно вернуться к JSON файлам, раскомментируйте код ниже и закомментируйте импорт
import {
  getAllProducts as getAllProductsFromSupabase,
  getProducts as getProductsFromSupabase,
  getProductById as getProductByIdFromSupabase,
  getProductsByCategory as getProductsByCategoryFromSupabase,
} from './products-supabase-read';

// Fallback на JSON файлы если Supabase не настроен
import fs from 'fs';
import path from 'path';

const productsPath = path.join(process.cwd(), 'data', 'products_new.json');

function getAllProductsFromJSON() {
  try {
    if (!fs.existsSync(productsPath)) {
      return [];
    }
    const rawData = fs.readFileSync(productsPath, 'utf8');
    const data = JSON.parse(rawData);
    return data;
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
}

// Проверяем наличие переменных Supabase
const useSupabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function getAllProducts() {
  if (useSupabase) {
    try {
      return await getAllProductsFromSupabase();
    } catch (error) {
      console.error('Error fetching from Supabase, falling back to JSON:', error);
      return getAllProductsFromJSON();
    }
  }
  return getAllProductsFromJSON();
}

export async function getProducts({
  categoryId,
  search,
  sort = 'asc',
  sortBy = 'name',
  page = 1,
  limit = 12,
  ids = [],
  filters = {},
} = {}) {
  try {
    // Используем Supabase если настроен
    if (useSupabase) {
      try {
        return await getProductsFromSupabase({
          categoryId,
          search,
          sort,
          sortBy,
          page,
          limit,
          ids,
          filters,
        });
      } catch (error) {
        console.error('Error fetching from Supabase, falling back to JSON:', error);
      }
    }

    // Fallback на JSON файлы
    let filteredProducts = getAllProductsFromJSON() || [];
    'Total products:', filteredProducts.length;

    // Если переданы ID, ищем только по ним
    if (ids && ids.length > 0) {
      'Filtering by IDs:', ids;
      filteredProducts = (filteredProducts || []).filter((product) => {
        const productIdStr = String(product.id);
        const isIncluded = ids.includes(productIdStr);
        'Product ID:', productIdStr, 'isIncluded:', isIncluded;
        return isIncluded;
      });
      'Found products:', filteredProducts;
    } else {
      // Фильтр по категории или бренду
      if (categoryId) {
        'Filtering by categoryId:', categoryId;
        filteredProducts = (filteredProducts || []).filter((product) => {
          if (!product) return false;
          const matchCategory = product.categoryId === categoryId;
          const matchBrand =
            product.specifications?.brand?.toLowerCase() ===
            categoryId.toLowerCase();
          'Product:',
            product.name,
            'categoryId:',
            product.categoryId,
            'brand:',
            product.specifications?.brand;
          'Matches:', { matchCategory, matchBrand };
          return matchCategory || matchBrand;
        });
        'Filtered products:', filteredProducts.length;
      }

      // Поиск по названию
      if (search && search.trim()) {
        const searchLower = search.trim().toLowerCase();
        filteredProducts = (filteredProducts || []).filter((product) =>
          product?.name?.toLowerCase().includes(searchLower)
        );
      }

      // Применяем все активные фильтры
      Object.entries(filters).forEach(([field, value]) => {
        if (value) {
          filteredProducts = (filteredProducts || []).filter(
            (product) =>
              String(product?.specifications?.[field] || '').toLowerCase() ===
              String(value).toLowerCase()
          );
        }
      });
    }

    // Сортировка
    filteredProducts.sort((a, b) => {
      const aValue = a?.[sortBy] || 0;
      const bValue = b?.[sortBy] || 0;
      if (sort === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    // Получаем доступные фильтры
    const availableFilters = {
      memory: [
        ...new Set(
          (filteredProducts || []).map((p) => p?.specifications?.memory)
        ),
      ]
        .filter(Boolean)
        .sort(),
      ram: [
        ...new Set((filteredProducts || []).map((p) => p?.specifications?.ram)),
      ]
        .filter(Boolean)
        .sort(),
      processor: [
        ...new Set(
          (filteredProducts || []).map((p) => p?.specifications?.processor)
        ),
      ]
        .filter(Boolean)
        .sort(),
      display: [
        ...new Set(
          (filteredProducts || []).map((p) => p?.specifications?.display)
        ),
      ]
        .filter(Boolean)
        .sort(),
      camera: [
        ...new Set(
          (filteredProducts || []).map((p) => p?.specifications?.camera)
        ),
      ]
        .filter(Boolean)
        .sort(),
      battery: [
        ...new Set(
          (filteredProducts || []).map((p) => p?.specifications?.battery)
        ),
      ]
        .filter(Boolean)
        .sort(),
      os: [
        ...new Set((filteredProducts || []).map((p) => p?.specifications?.os)),
      ]
        .filter(Boolean)
        .sort(),
      color: [
        ...new Set(
          (filteredProducts || []).map((p) => p?.specifications?.color)
        ),
      ]
        .filter(Boolean)
        .sort(),
      year: [
        ...new Set(
          (filteredProducts || []).map((p) => p?.specifications?.year)
        ),
      ]
        .filter(Boolean)
        .sort(),
      brand: [
        ...new Set(
          (filteredProducts || []).map((p) => p?.specifications?.brand)
        ),
      ]
        .filter(Boolean)
        .sort(),
    };

    // Пагинация
    const total = filteredProducts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      products: paginatedProducts || [],
      filters: availableFilters || {},
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    'Error in getProducts:', error;
    return {
      products: [],
      filters: {},
      pagination: {
        total: 0,
        page: 1,
        limit: 12,
        pages: 1,
      },
    };
  }
}

export async function getProductById(id) {
  if (!id) {
    return null;
  }

  try {
    // Используем Supabase если настроен
    if (useSupabase) {
      try {
        return await getProductByIdFromSupabase(id);
      } catch (error) {
        console.error('Error fetching from Supabase, falling back to JSON:', error);
      }
    }

    // Fallback на JSON файлы
    const products = getAllProductsFromJSON();
    if (!Array.isArray(products)) {
      return null;
    }

    const stringId = String(id);
    const product = products.find((product) => String(product.id) === stringId);

    return product || null;
  } catch (error) {
    console.error('Error in getProductById:', error);
    return null;
  }
}

export async function getProductsByCategory(categoryId) {
  if (!categoryId) return [];
  try {
    // Используем Supabase если настроен
    if (useSupabase) {
      try {
        return await getProductsByCategoryFromSupabase(categoryId);
      } catch (error) {
        console.error('Error fetching from Supabase, falling back to JSON:', error);
      }
    }

    // Fallback на JSON файлы
    const products = getAllProductsFromJSON();
    if (!Array.isArray(products)) return [];
    return (
      products.filter((product) => product.categoryId === categoryId || product.category_id === categoryId) || []
    );
  } catch (error) {
    console.error('Error in getProductsByCategory:', error);
    return [];
  }
}
