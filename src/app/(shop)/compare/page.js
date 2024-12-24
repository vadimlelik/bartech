'use client'

import {
	Container,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
	Box,
} from '@mui/material'
import Image from 'next/image'
import { useCompareStore } from '@/store/compare'
import CloseIcon from '@mui/icons-material/Close'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ComparePage() {
	const { compareItems, removeFromCompare } = useCompareStore()

	if (compareItems.length === 0) {
		return (
			<Container sx={{ py: 4 }}>
				<Typography variant='h4' gutterBottom>
					Сравнение товаров
				</Typography>
				<Typography>
					Нет товаров для сравнения. Добавьте товары, чтобы сравнить их
					характеристики.
				</Typography>
			</Container>
		)
	}

	// Получаем все уникальные характеристики
	const allSpecs = compareItems.reduce((specs, item) => {
		Object.keys(item.specifications).forEach((spec) => {
			if (!specs.includes(spec)) {
				specs.push(spec)
			}
		})
		return specs
	}, [])

	return (
		<>
			<Container sx={{ py: 4 }}>
				<Typography variant='h4' gutterBottom>
					Сравнение товаров
				</Typography>

				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Характеристики</TableCell>
								{compareItems.map((item) => (
									<TableCell key={item.id} align='center'>
										<Box sx={{ position: 'relative' }}>
											<IconButton
												size='small'
												onClick={() => removeFromCompare(item.id)}
												sx={{
													position: 'absolute',
													top: 0,
													right: 0,
													zIndex: 1,
												}}
											>
												<CloseIcon />
											</IconButton>
											<Box
												sx={{
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'center',
													gap: 1,
													pt: 4,
												}}
											>
												<Image
													src={item.image}
													alt={item.name}
													width={150}
													height={150}
													style={{
														objectFit: 'contain',
													}}
												/>
												<Typography variant='subtitle1'>{item.name}</Typography>
												<Typography variant='h6' color='primary'>
													{(item.price * 3.35).toFixed(2)} BYN
												</Typography>
											</Box>
										</Box>
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{allSpecs.map((spec) => (
								<TableRow key={spec}>
									<TableCell component='th' scope='row'>
										{spec}
									</TableCell>
									{compareItems.map((item) => (
										<TableCell key={item.id} align='center'>
											{item.specifications[spec]}
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Container>
		</>
	)
}
