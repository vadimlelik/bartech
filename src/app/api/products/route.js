import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        
        // Получаем все возможные фильтры
        const filterFields = [
            'memory', 'ram', 'display', 'processor', 
            'color', 'condition', 'year', 'brand', 
            'model', 'os', 'battery', 'camera', 'storage'
        ]

        // Получаем все параметры из URL
        const categoryId = searchParams.get('categoryId')
        const search = searchParams.get('search')
        const sort = searchParams.get('sort') || 'asc'
        const sortBy = searchParams.get('sortBy') || 'name'
        const page = parseInt(searchParams.get('page')) || 1
        const limit = parseInt(searchParams.get('limit')) || 12
        const ids = searchParams.getAll('ids')

        // Собираем значения фильтров из параметров запроса
        const filters = {}
        filterFields.forEach(field => {
            const value = searchParams.get(field)
            if (value) filters[field] = value
        })

        console.log('API received request with params:', { 
            categoryId, search, sort, sortBy, page, limit, filters, ids 
        }) // Отладка

        // Подключаемся к MongoDB
        const client = await clientPromise
        const db = client.db('bartech')
        const collection = db.collection('products')

        // Строим запрос
        let query = {}
        
        // Если переданы ID, ищем только по ним
        if (ids && ids.length > 0) {
            console.log('Searching products by ids:', ids)
            query = {
                $or: [
                    { _id: { $in: ids.map(id => {
                        try {
                            return new ObjectId(id);
                        } catch {
                            return id;
                        }
                    })}},
                    { id: { $in: ids }}
                ]
            };
        } else {
            // Фильтр по категории
            if (categoryId) {
                query.categoryId = categoryId
            }

            // Поиск по названию или описанию
            if (search && search.trim()) {
                const searchRegex = { $regex: search.trim(), $options: 'i' }
                query.$or = [
                    { name: searchRegex },
                    { description: searchRegex },
                    { 'variants.name': searchRegex }
                ]
            }

            // Применяем все активные фильтры
            Object.entries(filters).forEach(([field, value]) => {
                if (value) {
                    // Все фильтры ищем в specifications
                    query.$and = query.$and || []
                    query.$and.push({
                        [`specifications.${field}`]: value
                    })
                }
            })
        }

        console.log('MongoDB query:', JSON.stringify(query)) // Отладка

        // Получаем общее количество товаров
        const total = await collection.countDocuments(query)

        // Определяем направление сортировки
        const sortDirection = sort === 'desc' ? -1 : 1
        const sortOptions = { [sortBy]: sortDirection }

        // Получаем товары с пагинацией
        let products = []
        if (ids && ids.length > 0) {
            // Для избранных товаров не используем пагинацию
            products = await collection.find(query).toArray()
        } else {
            products = await collection
                .find(query)
                .sort(sortOptions)
                .skip((page - 1) * limit)
                .limit(limit)
                .toArray()
        }

        console.log(`Found ${products.length} products`) // Отладка

        // Преобразуем _id в строку и обрабатываем варианты
        products = products.map(product => ({
            ...product,
            _id: product._id.toString(),
            slug: product.slug || product._id.toString(),
            variants: product.variants?.map(variant => ({
                ...variant,
                _id: variant._id?.toString()
            })) || []
        }))

        // Получаем фильтры только если не ищем по ID
        let availableFilters = {}
        if (!ids || ids.length === 0) {
            console.log('Getting filters for category:', categoryId) // Отладка
            const filterResults = await collection.aggregate([
                { $match: { categoryId: categoryId } },
                {
                    $group: {
                        _id: null,
                        brands: { $addToSet: '$specifications.brand' },
                        models: { $addToSet: '$specifications.model' },
                        storages: { $addToSet: '$specifications.storage' },
                        memories: { $addToSet: '$specifications.memory' },
                        rams: { $addToSet: '$specifications.ram' },
                        processors: { $addToSet: '$specifications.processor' },
                        displays: { $addToSet: '$specifications.display' },
                        cameras: { $addToSet: '$specifications.camera' },
                        batteries: { $addToSet: '$specifications.battery' },
                        oss: { $addToSet: '$specifications.os' },
                        colors: { $addToSet: '$specifications.color' },
                        conditions: { $addToSet: '$specifications.condition' },
                        years: { $addToSet: '$specifications.year' }
                    }
                }
            ]).toArray()
            
            console.log('Filter results:', filterResults) // Отладка

            if (filterResults.length > 0) {
                const result = filterResults[0]
                delete result._id
                availableFilters = Object.fromEntries(
                    Object.entries(result).map(([key, values]) => [
                        key,
                        values.filter(Boolean).sort()
                    ])
                )
            }
            
            console.log('Available filters:', availableFilters) // Отладка
        }

        return NextResponse.json({
            products,
            filters: availableFilters,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        })

    } catch (error) {
        console.error('Error in products API:', error)
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        )
    }
}
