import { prisma } from '@/shared/lib/prisma';

function slugifyCategoryId(input) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizeCategory(category) {
  if (!category) return null;
  return {
    id: category.id,
    name: category.name,
    image: category.image || null,
    description: category.description || null,
    created_at: category.createdAt,
    updated_at: category.updatedAt,
  };
}

export async function getAllCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  // Совместимость со старым кодом: выкидываем пустые id/имя
  return (categories || [])
    .map(normalizeCategory)
    .filter(
      (c) => c && c.id && String(c.id).trim() !== '' && c.name && String(c.name).trim() !== '',
    );
}

export async function getCategoryById(id) {
  if (!id) return null;
  const category = await prisma.category.findUnique({
    where: { id: String(id) },
  });
  return normalizeCategory(category);
}

export async function addCategory(categoryData) {
  try {
    const categoryName = categoryData?.name?.trim();
    if (!categoryName) {
      return { success: false, error: 'Category name is required' };
    }

    let categoryId = categoryData?.id?.trim();
    if (!categoryId) {
      categoryId = slugifyCategoryId(categoryName);
    }
    if (!categoryId) {
      return {
        success: false,
        error:
          'Failed to generate category ID from name. Please provide an ID manually.',
      };
    }

    const created = await prisma.category.create({
      data: {
        id: categoryId,
        name: categoryName,
        image: categoryData?.image || null,
        description: categoryData?.description || null,
      },
    });

    return { success: true, category: normalizeCategory(created) };
  } catch (error) {
    if (error?.code === 'P2002') {
      return {
        success: false,
        error: `Категория с ID "${categoryData?.id || ''}" уже существует`,
      };
    }
    return { success: false, error: error.message || 'Failed to create category' };
  }
}

export async function updateCategory(id, categoryData) {
  try {
    if (!id) return { success: false, error: 'Category ID is required' };

    const updated = await prisma.category.update({
      where: { id: String(id) },
      data: {
        name: categoryData?.name ?? undefined,
        image: categoryData?.image ?? undefined,
        description: categoryData?.description ?? undefined,
      },
    });

    return { success: true, category: normalizeCategory(updated) };
  } catch (error) {
    if (error?.code === 'P2025') {
      return { success: false, error: 'Category not found' };
    }
    return { success: false, error: error.message || 'Failed to update category' };
  }
}

export async function deleteCategory(id) {
  try {
    if (!id) return { success: false, error: 'Category ID is required' };
    await prisma.category.delete({ where: { id: String(id) } });
    return { success: true };
  } catch (error) {
    if (error?.code === 'P2025') {
      return { success: false, error: 'Category not found' };
    }
    return { success: false, error: error.message || 'Failed to delete category' };
  }
}


