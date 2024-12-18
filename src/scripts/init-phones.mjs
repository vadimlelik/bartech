import { MongoClient } from 'mongodb'

const phones = [
	{
		id: 'iphone-15-pro-max',
		categoryId: 'iphone',
		name: 'iPhone 15 Pro Max',
		brand: 'Apple',
		description:
			'Флагманский смартфон с процессором A17 Pro и титановым корпусом',
		year: '2023',
		imageUrl: '/images/products/iphone-15-pro-max.webp',
		images: [
			'/images/products/iphone-15-pro-max-1.webp',
			'/images/products/iphone-15-pro-max-2.webp',
			'/images/products/iphone-15-pro-max-3.webp',
			'/images/products/iphone-15-pro-max-4.webp',
		],
		specifications: {
			brand: 'Apple',
			model: 'iPhone 15 Pro Max',
			storage: '256',
			memory: '256GB',
			ram: '8GB',
			processor: 'A17 Pro',
			display: '6.7" Super Retina XDR OLED',
			camera: '48MP + 12MP + 12MP',
			battery: '4422mAh',
			os: 'iOS 17',
			color: 'Natural Titanium',
			condition: 'Новый',
			year: '2023',
		},
		variants: [
			{
				id: 'iphone-15-pro-max-256-natural',
				memory: '256GB',
				color: 'Natural Titanium',
				price: 159990,
				stock: 10,
			},
		],
	},
	{
		id: 'iphone-14-pro',
		categoryId: 'iphone',
		name: 'iPhone 14 Pro',
		brand: 'Apple',
		description: 'Смартфон с Dynamic Island и улучшенной камерой',
		year: '2022',
		imageUrl: '/images/products/iphone-14-pro.webp',
		images: [
			'/images/products/iphone-14-pro-1.webp',
			'/images/products/iphone-14-pro-2.webp',
			'/images/products/iphone-14-pro-3.webp',
			'/images/products/iphone-14-pro-4.webp',
		],
		specifications: {
			brand: 'Apple',
			model: 'iPhone 14 Pro',
			storage: '128',
			memory: '128GB',
			ram: '6GB',
			processor: 'A16 Bionic',
			display: '6.1" Super Retina XDR OLED',
			camera: '48MP + 12MP + 12MP',
			battery: '3200mAh',
			os: 'iOS 16',
			color: 'Space Black',
			condition: 'Новый',
			year: '2022',
		},
		variants: [
			{
				id: 'iphone-14-pro-128-black',
				memory: '128GB',
				color: 'Space Black',
				price: 89990,
				stock: 15,
			},
		],
	},
	{
		id: 'samsung-galaxy-s23-ultra',
		categoryId: 'samsung',
		name: 'Samsung Galaxy S23 Ultra',
		brand: 'Samsung',
		description: 'Флагманский смартфон с 200MP камерой и S Pen',
		year: '2023',
		imageUrl: '/images/products/samsung-s23-ultra.webp',
		images: [
			'/images/products/samsung-s23-ultra-1.webp',
			'/images/products/samsung-s23-ultra-2.webp',
			'/images/products/samsung-s23-ultra-3.webp',
			'/images/products/samsung-s23-ultra-4.webp',
		],
		specifications: {
			brand: 'Samsung',
			model: 'Galaxy S23 Ultra',
			storage: '512',
			memory: '512GB',
			ram: '12GB',
			processor: 'Snapdragon 8 Gen 2',
			display: '6.8" Dynamic AMOLED 2X',
			camera: '200MP + 12MP + 10MP + 10MP',
			battery: '5000mAh',
			os: 'Android 13',
			color: 'Phantom Black',
			condition: 'Новый',
			year: '2023',
		},
		variants: [
			{
				id: 'samsung-s23-ultra-512-black',
				memory: '512GB',
				color: 'Phantom Black',
				price: 129990,
				stock: 8,
			},
		],
	},
	{
		id: 'samsung-galaxy-s23-plus',
		categoryId: 'samsung',
		name: 'Samsung Galaxy S23+',
		brand: 'Samsung',
		description: 'Мощный смартфон с отличной камерой',
		year: '2023',
		imageUrl: '/images/products/samsung-s23-plus.webp',
		images: [
			'/images/products/samsung-s23-plus-1.webp',
			'/images/products/samsung-s23-plus-2.webp',
			'/images/products/samsung-s23-plus-3.webp',
			'/images/products/samsung-s23-plus-4.webp',
		],
		specifications: {
			brand: 'Samsung',
			model: 'Galaxy S23+',
			storage: '256',
			memory: '256GB',
			ram: '8GB',
			processor: 'Snapdragon 8 Gen 2',
			display: '6.6" Dynamic AMOLED 2X',
			camera: '50MP + 12MP + 10MP',
			battery: '4700mAh',
			os: 'Android 13',
			color: 'Cream',
			condition: 'Новый',
			year: '2023',
		},
		variants: [
			{
				id: 'samsung-s23-plus-256-cream',
				memory: '256GB',
				color: 'Cream',
				price: 94990,
				stock: 12,
			},
		],
	},
	{
		id: 'xiaomi-13-pro',
		categoryId: 'xiaomi',
		name: 'Xiaomi 13 Pro',
		brand: 'Xiaomi',
		description: 'Флагманский смартфон с камерой Leica',
		year: '2023',
		imageUrl: '/images/products/xiaomi-13-pro.webp',
		images: [
			'/images/products/xiaomi-13-pro-1.webp',
			'/images/products/xiaomi-13-pro-2.webp',
			'/images/products/xiaomi-13-pro-3.webp',
			'/images/products/xiaomi-13-pro-4.webp',
		],
		specifications: {
			brand: 'Xiaomi',
			model: '13 Pro',
			storage: '256',
			memory: '256GB',
			ram: '12GB',
			processor: 'Snapdragon 8 Gen 2',
			display: '6.73" AMOLED',
			camera: '50MP + 50MP + 50MP',
			battery: '4820mAh',
			os: 'MIUI 14',
			color: 'Ceramic Black',
			condition: 'Новый',
			year: '2023',
		},
		variants: [
			{
				id: 'xiaomi-13-pro-256-black',
				memory: '256GB',
				color: 'Ceramic Black',
				price: 89990,
				stock: 12,
			},
		],
	},
	{
		id: 'xiaomi-12t-pro',
		categoryId: 'xiaomi',
		name: 'Xiaomi 12T Pro',
		brand: 'Xiaomi',
		description: 'Мощный смартфон с 200MP камерой',
		year: '2022',
		imageUrl: '/images/products/xiaomi-12t-pro.webp',
		images: [
			'/images/products/xiaomi-12t-pro-1.webp',
			'/images/products/xiaomi-12t-pro-2.webp',
			'/images/products/xiaomi-12t-pro-3.webp',
			'/images/products/xiaomi-12t-pro-4.webp',
		],
		specifications: {
			brand: 'Xiaomi',
			model: '12T Pro',
			storage: '128',
			memory: '128GB',
			ram: '8GB',
			processor: 'Snapdragon 8+ Gen 1',
			display: '6.67" AMOLED',
			camera: '200MP + 8MP + 2MP',
			battery: '5000mAh',
			os: 'MIUI 13',
			color: 'Black',
			condition: 'Новый',
			year: '2022',
		},
		variants: [
			{
				id: 'xiaomi-12t-pro-128-black',
				memory: '128GB',
				color: 'Black',
				price: 59990,
				stock: 20,
			},
		],
	},
	{
		id: 'iphone-13',
		categoryId: 'iphone',
		name: 'iPhone 13',
		brand: 'Apple',
		description: 'Надежный смартфон с отличной камерой',
		year: '2021',
		imageUrl: '/images/products/iphone-13.webp',
		images: [
			'/images/products/iphone-13-1.webp',
			'/images/products/iphone-13-2.webp',
			'/images/products/iphone-13-3.webp',
			'/images/products/iphone-13-4.webp',
		],
		specifications: {
			brand: 'Apple',
			model: 'iPhone 13',
			storage: '128',
			memory: '128GB',
			ram: '4GB',
			processor: 'A15 Bionic',
			display: '6.1" Super Retina XDR',
			camera: '12MP + 12MP',
			battery: '3240mAh',
			os: 'iOS 15',
			color: 'Midnight',
			condition: 'Б/У',
			year: '2021',
		},
		variants: [
			{
				id: 'iphone-13-128-midnight',
				memory: '128GB',
				color: 'Midnight',
				price: 54990,
				stock: 5,
			},
		],
	},
	{
		id: 'samsung-galaxy-a54',
		categoryId: 'samsung',
		name: 'Samsung Galaxy A54',
		brand: 'Samsung',
		description: 'Современный смартфон среднего класса',
		year: '2023',
		imageUrl: '/images/products/samsung-a54.webp',
		images: [
			'/images/products/samsung-a54-1.webp',
			'/images/products/samsung-a54-2.webp',
			'/images/products/samsung-a54-3.webp',
			'/images/products/samsung-a54-4.webp',
		],
		specifications: {
			brand: 'Samsung',
			model: 'Galaxy A54',
			storage: '128',
			memory: '128GB',
			ram: '6GB',
			processor: 'Exynos 1380',
			display: '6.4" Super AMOLED',
			camera: '50MP + 12MP + 5MP',
			battery: '5000mAh',
			os: 'Android 13',
			color: 'Awesome Graphite',
			condition: 'Новый',
			year: '2023',
		},
		variants: [
			{
				id: 'samsung-a54-128-graphite',
				memory: '128GB',
				color: 'Awesome Graphite',
				price: 34990,
				stock: 25,
			},
		],
	},
	{
		id: 'xiaomi-redmi-note-12-pro',
		categoryId: 'xiaomi',
		name: 'Xiaomi Redmi Note 12 Pro',
		brand: 'Xiaomi',
		description: 'Доступный смартфон с хорошей камерой',
		year: '2023',
		imageUrl: '/images/products/redmi-note-12-pro.webp',
		images: [
			'/images/products/redmi-note-12-pro-1.webp',
			'/images/products/redmi-note-12-pro-2.webp',
			'/images/products/redmi-note-12-pro-3.webp',
			'/images/products/redmi-note-12-pro-4.webp',
		],
		specifications: {
			brand: 'Xiaomi',
			model: 'Redmi Note 12 Pro',
			storage: '128',
			memory: '128GB',
			ram: '6GB',
			processor: 'Dimensity 1080',
			display: '6.67" AMOLED',
			camera: '50MP + 8MP + 2MP',
			battery: '5000mAh',
			os: 'MIUI 14',
			color: 'Forest Green',
			condition: 'Новый',
			year: '2023',
		},
		variants: [
			{
				id: 'redmi-note-12-pro-128-green',
				memory: '128GB',
				color: 'Forest Green',
				price: 29990,
				stock: 30,
			},
		],
	},
]

async function initPhones() {
	const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bartech'
	if (!uri) {
		console.error('Please define the MONGODB_URI environment variable')
		return
	}

	const client = new MongoClient(uri)

	try {
		await client.connect()
		console.log('Connected to MongoDB')

		const database = client.db('test')
		const products = database.collection('products')

		// Удаляем существующие продукты
		await products.deleteMany({})
		console.log('Existing products deleted')

		// Добавляем новые продукты
		const result = await products.insertMany(phones)
		console.log(`${result.insertedCount} products inserted`)
	} catch (error) {
		console.error('Error:', error)
	} finally {
		await client.close()
		console.log('Disconnected from MongoDB')
	}
}

// Запускаем инициализацию
initPhones()
