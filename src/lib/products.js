import fs from 'fs';
import path from 'path';

const productsPath = path.join(process.cwd(), 'data', 'products_new.json');

function getAllProducts() {
  try {
    if (!fs.existsSync(productsPath)) {
      return [];
    }
    const rawData = fs.readFileSync(productsPath, 'utf8');

    const data = JSON.parse(rawData);
    'Parsed products count:', data.length;
    return data;
  } catch (error) {
    'Error reading products:', error;
    return [];
  }
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
    'getProducts called with:',
      {
        categoryId,
        search,
        sort,
        sortBy,
        page,
        limit,
        ids,
        filters,
      };
    let filteredProducts = getAllProducts() || [];
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

export function getProductById(id) {
  ('=== getProductById Debug ===');
  '1. Input ID:', id, typeof id;

  if (!id) {
    ('2. No ID provided');
    return null;
  }

  try {
    const products = getAllProducts();
    '3. All products loaded:', products ? products.length : 'no products';

    if (!Array.isArray(products)) {
      ('4. Products is not an array');
      return null;
    }

    const stringId = String(id);
    '5. Looking for product with string ID:', stringId;

    const product = products.find((product) => {
      'Comparing:', String(product.id), '===', stringId;
      return String(product.id) === stringId;
    });

    '6. Found product:', product;

    return product || null;
  } catch (error) {
    '7. Error in getProductById:', error;
    return null;
  }
}

export function getProductsByCategory(categoryId) {
  if (!categoryId) return [];
  try {
    const products = getAllProducts();
    if (!Array.isArray(products)) return [];
    return (
      products.filter((product) => product.categoryId === categoryId) || []
    );
  } catch (error) {
    'Error in getProductsByCategory:', error;
    return [];
  }
}
