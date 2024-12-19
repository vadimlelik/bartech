import fs from 'fs'
import path from 'path'

const productsPath = path.join(process.cwd(), 'data', 'products_new.json')

export async function getProducts({ 
    categoryId, 
    search, 
    sort = 'asc', 
    sortBy = 'name', 
    page = 1, 
    limit = 12,
    ids = [],
    filters = {}
}) {
    // Читаем JSON файл
    const data = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
    
    // Фильтруем продукты
    let filteredProducts = data

    // Если переданы ID, ищем только по ним
    if (ids && ids.length > 0) {
        filteredProducts = filteredProducts.filter(product => ids.includes(product.id))
    } else {
        // Фильтр по категории (бренду)
        if (categoryId) {
            filteredProducts = filteredProducts.filter(product => 
                product.specifications.brand.toLowerCase() === categoryId.toLowerCase()
            )
        }

        // Поиск по названию или описанию
        if (search && search.trim()) {
            const searchLower = search.trim().toLowerCase()
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(searchLower) ||
                product.description.toLowerCase().includes(searchLower)
            )
        }

        // Применяем все активные фильтры
        Object.entries(filters).forEach(([field, value]) => {
            if (value) {
                filteredProducts = filteredProducts.filter(product => 
                    product.specifications[field] === value
                )
            }
        })
    }

    // Сортировка
    filteredProducts.sort((a, b) => {
        const aValue = a[sortBy] || 0
        const bValue = b[sortBy] || 0
        if (sort === 'asc') {
            return aValue > bValue ? 1 : -1
        }
        return aValue < bValue ? 1 : -1
    })

    // Получаем доступные фильтры для текущей выборки
    const availableFilters = {
        brands: [...new Set(filteredProducts.map(p => p.specifications.brand))].filter(Boolean).sort(),
        models: [...new Set(filteredProducts.map(p => p.specifications.model))].filter(Boolean).sort(),
        memories: [...new Set(filteredProducts.map(p => p.specifications.memory))].filter(Boolean).sort(),
        rams: [...new Set(filteredProducts.map(p => p.specifications.ram))].filter(Boolean).sort(),
        processors: [...new Set(filteredProducts.map(p => p.specifications.processor))].filter(Boolean).sort(),
        displays: [...new Set(filteredProducts.map(p => p.specifications.display))].filter(Boolean).sort(),
        cameras: [...new Set(filteredProducts.map(p => p.specifications.camera))].filter(Boolean).sort(),
        batteries: [...new Set(filteredProducts.map(p => p.specifications.battery))].filter(Boolean).sort(),
        oss: [...new Set(filteredProducts.map(p => p.specifications.os))].filter(Boolean).sort(),
        colors: [...new Set(filteredProducts.map(p => p.specifications.color))].filter(Boolean).sort(),
        conditions: [...new Set(filteredProducts.map(p => p.specifications.condition))].filter(Boolean).sort(),
        years: [...new Set(filteredProducts.map(p => p.specifications.year))].filter(Boolean).sort()
    }

    // Пагинация
    const total = filteredProducts.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    return {
        products: paginatedProducts,
        filters: availableFilters,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
        }
    }
}

export async function getProductById(id) {
    const data = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
    return data.find(product => String(product.id) === String(id)) || null
}
