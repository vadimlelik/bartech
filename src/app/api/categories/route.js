import { categories } from '@/data/categories'

export async function GET() {
	return new Response(JSON.stringify(categories), {
		headers: { 'Content-Type': 'application/json' },
	})
}
