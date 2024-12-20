import MainLayout from './main-layout'
import ComparePanel from '@/components/ComparePanel'

export default function ShopLayout({ children }) {
    return (
        <MainLayout>
            {children}
            <ComparePanel />
        </MainLayout>
    )
}
