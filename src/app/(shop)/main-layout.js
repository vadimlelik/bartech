'use client'

import { Box } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function MainLayout({ children }) {
    const [showHeader, setShowHeader] = useState(true)
    const pathname = usePathname()

    useEffect(() => {
        // Проверяем пути лендингов
        const isLandingPage = ['/1phonefree', '/phone2', '/tv1', '/50discount']
            .some(path => pathname.startsWith(path))
        setShowHeader(!isLandingPage)
    }, [pathname])

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            {showHeader && <Header />}
            {children}
            <Footer />
        </Box>
    )
}
