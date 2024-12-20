'use client'

import { Box } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CompareBar from '@/components/CompareBar'

export default function ShopLayout({ children }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <Header />
            <Box component="main" sx={{ flex: 1 }}>
                {children}
            </Box>
            <CompareBar />
            <Footer />
        </Box>
    )
}
