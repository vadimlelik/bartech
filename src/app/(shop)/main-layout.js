'use client'

import { Box } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function MainLayout({ children }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <Header />
            {children}
            <Footer />
        </Box>
    )
}
