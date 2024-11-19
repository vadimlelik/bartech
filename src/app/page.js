import Header from '@/shared/ui/header/Header'
import styles from './page.module.css'
import Footer from '@/shared/ui/footer/Footer'

import CategoriesList from './components/categoriesList/CategoriesList'

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
				<div className={styles.container}>
					<h1 className={styles.title}>Техника для жизни и дома</h1>
					<CategoriesList list={categories} />
				</div>
			</main>
			<Footer />
		</div>
	)
}
