import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request, context) {
    try {
        const productId = context.params.productId
        console.log('API: Received productId:', productId)
        
        const client = await clientPromise
        const db = client.db('bartech')
        
        let product

        // Сначала пробуем найти по ObjectId
        if (ObjectId.isValid(productId)) {
            console.log('API: Searching by ObjectId')
            product = await db.collection('products').findOne({
                _id: new ObjectId(productId)
            })
            console.log('API: ObjectId search result:', product ? 'found' : 'not found')
        }

        // Если не нашли по ObjectId, ищем по id или slug
        if (!product) {
            console.log('API: Searching by id or slug')
            product = await db.collection('products').findOne({
                $or: [
                    { id: productId },
                    { slug: productId }
                ]
            })
            console.log('API: id/slug search result:', product ? 'found' : 'not found')
        }

        if (!product) {
            console.log('API: Product not found')
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        // Преобразуем _id в строку для JSON
        product = {
            ...product,
            _id: product._id.toString()
        }

        console.log('API: Returning product:', product._id)
        return NextResponse.json({ product })
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        )
    }
}
