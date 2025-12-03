import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { addProduct } from '@/lib/products-supabase';
import { addCategory } from '@/lib/categories';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    await requireAdmin();

    const results = {
      categories: { success: 0, failed: 0, errors: [] },
      products: { success: 0, failed: 0, errors: [] },
    };

    // Инициализация категорий
    try {
      const categoriesPath = path.join(process.cwd(), 'data', 'categories.json');
      const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));

      for (const category of categoriesData) {
        try {
          // Пропускаем категории без названия
          if (!category.name || category.name.trim() === '') {
            continue;
          }

          // Если id пустая строка, передаем undefined, чтобы функция сама сгенерировала id
          const result = await addCategory({
            id: category.id && category.id.trim() !== '' ? category.id : undefined,
            name: category.name,
            image: category.image || null,
          });

          if (result.success) {
            results.categories.success++;
          } else {
            results.categories.failed++;
            results.categories.errors.push({
              name: category.name,
              error: result.error || 'Unknown error',
            });
          }
        } catch (error) {
          results.categories.failed++;
          results.categories.errors.push({
            name: category.name || 'Unknown',
            error: error.message || 'Unknown error',
          });
        }
      }
    } catch (error) {
      return NextResponse.json(
        {
          error: 'Failed to read categories file',
          details: error.message,
        },
        { status: 500 }
      );
    }

    // Инициализация продуктов
    try {
      const productsPath = path.join(process.cwd(), 'data', 'products_new.json');
      const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

      for (const product of productsData) {
        try {
          const productData = {
            name: product.name,
            category: product.category || null,
            categoryId: product.category_id || product.categoryId || null,
            price: product.price || 0,
            image: product.image || null,
            images: Array.isArray(product.images) ? product.images : [],
            description: product.description || null,
            specifications: product.specifications || {},
          };

          const result = await addProduct(productData);

          if (result.success) {
            results.products.success++;
          } else {
            results.products.failed++;
            results.products.errors.push({
              name: product.name,
              error: result.error || 'Unknown error',
            });
          }
        } catch (error) {
          results.products.failed++;
          results.products.errors.push({
            name: product.name || 'Unknown',
            error: error.message || 'Unknown error',
          });
        }
      }
    } catch (error) {
      return NextResponse.json(
        {
          error: 'Failed to read products file',
          details: error.message,
          partialResults: results,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Database initialization completed',
      results: {
        categories: {
          total: results.categories.success + results.categories.failed,
          success: results.categories.success,
          failed: results.categories.failed,
          errors: results.categories.errors,
        },
        products: {
          total: results.products.success + results.products.failed,
          success: results.products.success,
          failed: results.products.failed,
          errors: results.products.errors.slice(0, 10), // Ограничиваем количество ошибок в ответе
        },
      },
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

