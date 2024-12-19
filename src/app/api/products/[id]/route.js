import { getProductById } from '@/lib/products'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
    try {
        const id = params.id
        const product = await getProductById(id)
        
        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ product })
    } catch (error) {
        console.error('Error in product API:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
