import { supabaseAdmin } from './supabase';

export async function getAllProducts() {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllProducts:', error);
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
    let query = supabaseAdmin.from('products').select('*', { count: 'exact' });

    // Если переданы ID, ищем только по ним
    if (ids && ids.length > 0) {
      query = query.in('id', ids.map((id) => parseInt(id)).filter(Boolean));
    } else {
      // Фильтр по категории или бренду
      if (categoryId) {
        query = query.or(`category_id.eq.${categoryId},specifications->>brand.ilike.%${categoryId}%`);
      }

      // Поиск по названию
      if (search && search.trim()) {
        query = query.ilike('name', `%${search.trim()}%`);
      }

      // Применяем фильтры по характеристикам
      Object.entries(filters).forEach(([field, value]) => {
        if (value) {
          query = query.eq(`specifications->>${field}`, value);
        }
      });
    }

    // Сортировка
    const ascending = sort === 'asc';
    query = query.order(sortBy === 'price' ? 'price' : 'name', {
      ascending,
    });

    // Пагинация
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching products:', error);
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

    // Получаем доступные фильтры (нужно загрузить все товары для фильтров)
    const allProducts = await getAllProducts();
    const availableFilters = {
      memory: [
        ...new Set(
          allProducts
            .map((p) => p?.specifications?.memory)
            .filter(Boolean)
        ),
      ].sort(),
      ram: [
        ...new Set(allProducts.map((p) => p?.specifications?.ram).filter(Boolean)),
      ].sort(),
      processor: [
        ...new Set(
          allProducts.map((p) => p?.specifications?.processor).filter(Boolean)
        ),
      ].sort(),
      display: [
        ...new Set(
          allProducts.map((p) => p?.specifications?.display).filter(Boolean)
        ),
      ].sort(),
      camera: [
        ...new Set(
          allProducts.map((p) => p?.specifications?.camera).filter(Boolean)
        ),
      ].sort(),
      battery: [
        ...new Set(
          allProducts.map((p) => p?.specifications?.battery).filter(Boolean)
        ),
      ].sort(),
      os: [
        ...new Set(allProducts.map((p) => p?.specifications?.os).filter(Boolean)),
      ].sort(),
      color: [
        ...new Set(
          allProducts.map((p) => p?.specifications?.color).filter(Boolean)
        ),
      ].sort(),
      year: [
        ...new Set(
          allProducts.map((p) => p?.specifications?.year).filter(Boolean)
        ),
      ].sort(),
      brand: [
        ...new Set(
          allProducts.map((p) => p?.specifications?.brand).filter(Boolean)
        ),
      ].sort(),
    };

    // Преобразуем данные для совместимости с фронтендом
    const formattedProducts = (data || []).map((product) => ({
      ...product,
      categoryId: product.category_id,
      // Обеспечиваем обратную совместимость
    }));

    return {
      products: formattedProducts || [],
      filters: availableFilters || {},
      pagination: {
        total: count || 0,
        page,
        limit,
        pages: Math.ceil((count || 0) / limit),
      },
    };
  } catch (error) {
    console.error('Error in getProducts:', error);
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
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    // Преобразуем для обратной совместимости
    return data
      ? {
          ...data,
          categoryId: data.category_id,
        }
      : null;
  } catch (error) {
    console.error('Error in getProductById:', error);
    return null;
  }
}

export async function getProductsByCategory(categoryId) {
  if (!categoryId) return [];
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('category_id', categoryId);

    if (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }

    return (data || []).map((product) => ({
      ...product,
      categoryId: product.category_id,
    }));
  } catch (error) {
    console.error('Error in getProductsByCategory:', error);
    return [];
  }
}

