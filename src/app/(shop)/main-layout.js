'use client'

import { Box } from '@mui/material'

export default function MainLayout({ children }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            {children}
        </Box>
    )
}
