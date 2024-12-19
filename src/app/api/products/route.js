import { getProducts } from '@/lib/products'
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

        // Получаем продукты из JSON файла
        const result = await getProducts({
            categoryId,
            search,
            sort,
            sortBy,
            page,
            limit,
            ids,
            filters
        })

        return NextResponse.json(result)
    } catch (error) {
        console.error('Error in products API:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
