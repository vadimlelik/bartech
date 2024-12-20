import fs from 'fs'
import path from 'path'

const productsPath = path.join(process.cwd(), 'data', 'products_new.json')

function getAllProducts() {
	try {
		console.log('=== getAllProducts Debug ===')
		if (!fs.existsSync(productsPath)) {
			console.log('Products file not found at:', productsPath)
			return []
		}
		const rawData = fs.readFileSync(productsPath, 'utf8')
		console.log('Raw data length:', rawData.length)
		const data = JSON.parse(rawData)
		console.log('Parsed products count:', data.length)
		return data
	} catch (error) {
		console.error('Error reading products:', error)
		return []
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
		console.log('getProducts called with:', {
			categoryId,
			search,
			sort,
			sortBy,
			page,
			limit,
			ids,
			filters,
		})
		let filteredProducts = getAllProducts() || []
		console.log('Total products:', filteredProducts.length)

		// Если переданы ID, ищем только по ним
		if (ids && ids.length > 0) {
			filteredProducts = (filteredProducts || []).filter((product) =>
				ids.includes(product.id)
			)
		} else {
			// Фильтр по категории или бренду
			if (categoryId) {
				console.log('Filtering by categoryId:', categoryId)
				filteredProducts = (filteredProducts || []).filter((product) => {
					if (!product) return false
					const matchCategory = product.categoryId === categoryId
					const matchBrand =
						product.specifications?.brand?.toLowerCase() ===
						categoryId.toLowerCase()
					console.log(
						'Product:',
						product.name,
						'categoryId:',
						product.categoryId,
						'brand:',
						product.specifications?.brand
					)
					console.log('Matches:', { matchCategory, matchBrand })
					return matchCategory || matchBrand
				})
				console.log('Filtered products:', filteredProducts.length)
			}

			// Поиск по названию
			if (search && search.trim()) {
				const searchLower = search.trim().toLowerCase()
				filteredProducts = (filteredProducts || []).filter((product) =>
					product?.name?.toLowerCase().includes(searchLower)
				)
			}

			// Применяем все активные фильтры
			Object.entries(filters).forEach(([field, value]) => {
				if (value) {
					filteredProducts = (filteredProducts || []).filter(
						(product) =>
							String(product?.specifications?.[field] || '').toLowerCase() ===
							String(value).toLowerCase()
					)
				}
			})
		}

		// Сортировка
		filteredProducts.sort((a, b) => {
			const aValue = a?.[sortBy] || 0
			const bValue = b?.[sortBy] || 0
			if (sort === 'asc') {
				return aValue > bValue ? 1 : -1
			}
			return aValue < bValue ? 1 : -1
		})

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
		}

		// Пагинация
		const total = filteredProducts.length
		const startIndex = (page - 1) * limit
		const endIndex = startIndex + limit
		const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

		return {
			products: paginatedProducts || [],
			filters: availableFilters || {},
			pagination: {
				total,
				page,
				limit,
				pages: Math.ceil(total / limit),
			},
		}
	} catch (error) {
		console.error('Error in getProducts:', error)
		return {
			products: [],
			filters: {},
			pagination: {
				total: 0,
				page: 1,
				limit: 12,
				pages: 1,
			},
		}
	}
}

export function getProductById(id) {
    console.log('=== getProductById Debug ===')
    console.log('1. Input ID:', id, typeof id)
    
    if (!id) {
        console.log('2. No ID provided')
        return null
    }
    
    try {
        const products = getAllProducts()
        console.log('3. All products loaded:', products ? products.length : 'no products')
        
        if (!Array.isArray(products)) {
            console.log('4. Products is not an array')
            return null
        }

        const stringId = String(id)
        console.log('5. Looking for product with string ID:', stringId)
        
        const product = products.find(product => {
            console.log('Comparing:', String(product.id), '===', stringId)
            return String(product.id) === stringId
        })
        
        console.log('6. Found product:', product)
        
        return product || null
    } catch (error) {
        console.error('7. Error in getProductById:', error)
        return null
    }
}

export function getProductsByCategory(categoryId) {
	if (!categoryId) return []
	try {
		const products = getAllProducts()
		if (!Array.isArray(products)) return []
		return products.filter((product) => product.categoryId === categoryId) || []
	} catch (error) {
		console.error('Error in getProductsByCategory:', error)
		return []
	}
}
