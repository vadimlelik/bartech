'use client'

import { Box } from '@mui/material'

export default function LandingLayout({ children }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                bgcolor: 'black',
                color: 'white'
            }}
        >
            {children}
        </Box>
    )
}
