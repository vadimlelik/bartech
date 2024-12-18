import { MongoClient } from 'mongodb'

async function initDb() {
	const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bartech'
	const client = new MongoClient(uri)

	try {
		await client.connect()
		const db = client.db('bartech')

		// Создаем коллекцию categories если она не существует
		const collections = await db.listCollections().toArray()
		if (!collections.find((c) => c.name === 'categories')) {
			await db.createCollection('categories')
		}

		// Очищаем существующие категории
		await db.collection('categories').deleteMany({})

		// Добавляем начальные категории
		const categories = [
			{
				name: 'iPhone',
				description: 'Смартфоны Apple iPhone',
				imageUrl: 'images/categories/iphone.jpeg',
			},
			{
				name: 'Samsung',
				description: 'Смартфоны Samsung Galaxy',
				imageUrl: 'images/categories/samsung.webp',
			},
			{
				name: 'Xiaomi',
				description: 'Смартфоны Xiaomi',
				imageUrl: 'images/categories/xiaomi.jpg',
			},
		]

		await db.collection('categories').insertMany(categories)
		console.log('База данных успешно инициализирована')
	} catch (error) {
		console.error('Ошибка при инициализации базы данных:', error)
	} finally {
		await client.close()
	}
}

initDb()
