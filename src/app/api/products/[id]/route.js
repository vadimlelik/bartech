import clientPromise from '../../../../lib/mongodb'
import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'

export async function GET(request, { params }) {
    try {
        const resolvedParams = await params
        const { id } = resolvedParams
        
        const client = await clientPromise
        const db = client.db('bartech')

        const product = await db.collection('products').findOne({
            _id: new ObjectId(id)
        })

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ product })
    } catch (e) {
        console.error(e)
        return NextResponse.json(
            { error: 'Unable to fetch product' },
            { status: 500 }
        )
    }
}
