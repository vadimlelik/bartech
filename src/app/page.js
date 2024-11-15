import Header from '@/shared/ui/header/Header'
import styles from './page.module.css'
import Footer from '@/shared/ui/footer/Footer'
import Link from 'next/link'

async function fetchCategories() {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
		cache: 'no-store',
	})
	if (!res.ok) {
		throw new Error('Failed to fetch categories')
	}
	return res.json()
}

export default async function Home() {
	const categories = await fetchCategories()

	return (
		<div className={styles.page}>
			<Header />
			<main className={styles.main}>
				<div className='container'>
					<h1>Категории товаров</h1>
					<div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
						{categories.map((category) => (
							<Link
								key={category.id}
								href={`/category/${category.id}`}
								style={{
									padding: '1rem',
									border: '1px solid #ccc',
									borderRadius: '8px',
									textDecoration: 'none',
									display: 'block',
									width: '150px',
									textAlign: 'center',
								}}
							>
								{category.name}
							</Link>
						))}
					</div>
				</div>
			</main>
			<Footer />
		</div>
	)
}
