import { prisma } from '@/lib/prisma';

function normalizeProduct(product) {
  if (!product) return null;
  return {
    ...product,
    categoryId: product.categoryId ?? product.category_id ?? null,
    category_id: product.categoryId ?? product.category_id ?? null,
  };
}

export async function getAllProducts() {
  const products = await prisma.product.findMany({
    orderBy: { id: 'desc' },
  });
  return (products || []).map(normalizeProduct);
}

export async function getProductById(id) {
  if (!id) return null;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });
  return normalizeProduct(product);
}

export async function addProduct(productData) {
  try {
    const processedData = {
      name: productData?.name || null,
      category: productData?.category || null,
      categoryId: productData?.category_id || productData?.categoryId || null,
      price: productData?.price || 0,
      image: productData?.image || null,
      images: Array.isArray(productData?.images)
        ? productData.images
        : productData?.images
          ? [productData.images]
          : [],
      description: productData?.description || null,
      specifications: productData?.specifications || {},
    };

    // Преобразуем пустые строки в null
    Object.keys(processedData).forEach((key) => {
      if (processedData[key] === '') processedData[key] = null;
    });

    const created = await prisma.product.create({
      data: processedData,
    });

    return { success: true, product: normalizeProduct(created) };
  } catch (error) {
    return { success: false, error: error.message || 'Failed to create product' };
  }
}

export async function updateProduct(id, productData) {
  try {
    if (!id) return { success: false, error: 'Product ID is required' };

    const processedData = {
      name: productData?.name ?? undefined,
      category: productData?.category ?? undefined,
      categoryId: productData?.category_id ?? productData?.categoryId ?? undefined,
      price: productData?.price ?? undefined,
      image: productData?.image ?? undefined,
      images: Array.isArray(productData?.images)
        ? productData.images
        : productData?.images
          ? [productData.images]
          : undefined,
      description: productData?.description ?? undefined,
      specifications: productData?.specifications ?? undefined,
    };

    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: processedData,
    });

    return { success: true, product: normalizeProduct(updated) };
  } catch (error) {
    if (error?.code === 'P2025') {
      return { success: false, error: 'Product not found' };
    }
    return { success: false, error: error.message || 'Failed to update product' };
  }
}

export async function deleteProduct(id) {
  try {
    if (!id) return { success: false, error: 'Product ID is required' };
    await prisma.product.delete({ where: { id: Number(id) } });
    return { success: true };
  } catch (error) {
    if (error?.code === 'P2025') {
      return { success: false, error: 'Product not found' };
    }
    return { success: false, error: error.message || 'Failed to delete product' };
  }
}

export async function getProductsByCategory(categoryId) {
  if (!categoryId) return [];
  const products = await prisma.product.findMany({
    where: { categoryId: String(categoryId) },
    orderBy: { id: 'desc' },
  });
  return (products || []).map(normalizeProduct);
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
  // Для простоты и совместимости на первом шаге берём набор и фильтруем в JS.
  // Можно оптимизировать позже, если понадобится.
  const all = await getAllProducts();

  let filtered = all || [];

  if (ids && ids.length > 0) {
    filtered = filtered.filter((p) => ids.includes(String(p.id)));
  } else {
    if (categoryId) {
      const categoryLower = String(categoryId).toLowerCase();
      filtered = filtered.filter((product) => {
        const matchCategory = String(product.categoryId || '') === String(categoryId);
        const matchBrand =
          String(product?.specifications?.brand || '').toLowerCase() === categoryLower;
        return matchCategory || matchBrand;
      });
    }

    if (search && String(search).trim()) {
      const searchLower = String(search).trim().toLowerCase();
      filtered = filtered.filter((p) =>
        String(p?.name || '').toLowerCase().includes(searchLower),
      );
    }

    Object.entries(filters || {}).forEach(([field, value]) => {
      if (value) {
        filtered = filtered.filter(
          (p) =>
            String(p?.specifications?.[field] || '').toLowerCase() ===
            String(value).toLowerCase(),
        );
      }
    });
  }

  filtered.sort((a, b) => {
    const aValue = a?.[sortBy] || 0;
    const bValue = b?.[sortBy] || 0;
    if (sort === 'asc') return aValue > bValue ? 1 : -1;
    return aValue < bValue ? 1 : -1;
  });

  const availableFilters = {
    memory: [...new Set(filtered.map((p) => p?.specifications?.memory))]
      .filter(Boolean)
      .sort(),
    ram: [...new Set(filtered.map((p) => p?.specifications?.ram))]
      .filter(Boolean)
      .sort(),
    processor: [...new Set(filtered.map((p) => p?.specifications?.processor))]
      .filter(Boolean)
      .sort(),
    display: [...new Set(filtered.map((p) => p?.specifications?.display))]
      .filter(Boolean)
      .sort(),
    camera: [...new Set(filtered.map((p) => p?.specifications?.camera))]
      .filter(Boolean)
      .sort(),
    battery: [...new Set(filtered.map((p) => p?.specifications?.battery))]
      .filter(Boolean)
      .sort(),
    os: [...new Set(filtered.map((p) => p?.specifications?.os))]
      .filter(Boolean)
      .sort(),
    color: [...new Set(filtered.map((p) => p?.specifications?.color))]
      .filter(Boolean)
      .sort(),
    year: [...new Set(filtered.map((p) => p?.specifications?.year))]
      .filter(Boolean)
      .sort(),
    brand: [...new Set(filtered.map((p) => p?.specifications?.brand))]
      .filter(Boolean)
      .sort(),
  };

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginatedProducts = filtered.slice(startIndex, startIndex + limit);

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
}


