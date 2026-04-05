import { NextResponse } from 'next/server';
import { requireAdmin } from '@/shared/lib/auth-helpers';
import { seedDatabaseFromDataFolder } from '@/shared/lib/init-db-seed';

export async function POST() {
  try {
    await requireAdmin();

    const results = await seedDatabaseFromDataFolder();

    return NextResponse.json({
      message: 'Инициализация из папки data завершена',
      results: {
        categories: {
          total: results.categories.success + results.categories.failed,
          success: results.categories.success,
          failed: results.categories.failed,
          errors: results.categories.errors.slice(0, 20),
          source: results.categories.source,
          bulkSql: results.categories.bulkSql || false,
        },
        products: {
          total: results.products.success + results.products.failed,
          success: results.products.success,
          failed: results.products.failed,
          errors: results.products.errors.slice(0, 10),
          source: results.products.source,
          bulkSql: results.products.bulkSql || false,
        },
        landings: {
          total: results.landings.success + results.landings.failed,
          success: results.landings.success,
          failed: results.landings.failed,
          errors: results.landings.errors.slice(0, 10),
          source: results.landings.source,
          bulkSql: results.landings.bulkSql || false,
        },
        users: {
          total: results.users.success + results.users.failed,
          success: results.users.success,
          failed: results.users.failed,
          errors: results.users.errors.slice(0, 10),
          source: results.users.source,
          bulkSql: results.users.bulkSql || false,
        },
      },
    });
  } catch (error) {
    console.error('Error initializing database:', error);

    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
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
