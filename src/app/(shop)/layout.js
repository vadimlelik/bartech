'use client'

import { Box } from '@mui/material'
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
			<Box component='main' sx={{ flex: 1 }}>
				{children}
			</Box>
			<CompareBar />
		</Box>
	)
}
