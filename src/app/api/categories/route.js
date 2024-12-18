import clientPromise from '../../../lib/mongodb'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const client = await clientPromise
		const db = client.db('bartech')

		const categories = await db.collection('categories').find({}).toArray()

		return NextResponse.json(categories)
	} catch (e) {
		console.error(e)
		return NextResponse.json(
			{ error: 'Unable to fetch categories' },
			{ status: 500 }
		)
	}
}
