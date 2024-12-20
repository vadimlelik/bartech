import MainLayout from './main-layout'
import ComparePanel from '@/components/ComparePanel'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ShopLayout({ children }) {
	return (
		<MainLayout>
			<Header />
			{children}
			<ComparePanel />
			<Footer />
		</MainLayout>
	)
}
