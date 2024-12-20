import { Container, Typography, Box, Paper, Grid, Divider } from '@mui/material'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import PaymentIcon from '@mui/icons-material/Payment'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import SecurityIcon from '@mui/icons-material/Security'

export default function PaymentDelivery() {
	return (
		<Container maxWidth='lg' sx={{ py: 6 }}>
			<Paper elevation={0} sx={{ p: { xs: 2, md: 4 } }}>
				<Typography variant='h4' component='h1' gutterBottom align='center' sx={{ mb: 4 }}>
					Оплата и доставка
				</Typography>

				{/* Секция доставки */}
				<Box component='section' sx={{ mb: 6 }}>
					<Grid container spacing={4}>
						<Grid item xs={12} md={6}>
							<Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
								<LocalShippingIcon color='primary' sx={{ fontSize: 40, mr: 2 }} />
								<Typography variant='h5' sx={{ color: 'primary.main' }}>
									Доставка
								</Typography>
							</Box>
							<Typography variant='body1' paragraph>
								Мы осуществляем доставку по всей территории Беларуси. Доставка осуществляется
								курьерской службой или самовывозом из наших пунктов выдачи.
							</Typography>
							<Box sx={{ pl: 2 }}>
								<Typography variant='subtitle1' sx={{ fontWeight: 'bold', mb: 1 }}>
									Стоимость доставки:
								</Typography>
								<Box component='ul' sx={{ pl: 2, mb: 2 }}>
									<Typography component='li' variant='body1'>
										• Бесплатная доставка при заказе от 1000 BYN
									</Typography>
									<Typography component='li' variant='body1'>
										• Доставка по Минску - 10 BYN
									</Typography>
									<Typography component='li' variant='body1'>
										• Доставка по Беларуси - 15 BYN
									</Typography>
								</Box>
							</Box>
						</Grid>
						<Grid item xs={12} md={6}>
							<Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
								<AccessTimeIcon color='primary' sx={{ fontSize: 40, mr: 2 }} />
								<Typography variant='h5' sx={{ color: 'primary.main' }}>
									Сроки доставки
								</Typography>
							</Box>
							<Box sx={{ pl: 2 }}>
								<Typography variant='body1' paragraph>
									Сроки доставки зависят от вашего местоположения:
								</Typography>
								<Box component='ul' sx={{ pl: 2 }}>
									<Typography component='li' variant='body1'>
										• По Минску - в день заказа или на следующий день
									</Typography>
									<Typography component='li' variant='body1'>
										• По Беларуси - 1-3 рабочих дня
									</Typography>
									<Typography component='li' variant='body1'>
										• Самовывоз - в день заказа
									</Typography>
								</Box>
							</Box>
						</Grid>
					</Grid>
				</Box>

				<Divider sx={{ my: 4 }} />

				{/* Секция оплаты */}
				<Box component='section' sx={{ mb: 6 }}>
					<Grid container spacing={4}>
						<Grid item xs={12} md={6}>
							<Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
								<PaymentIcon color='primary' sx={{ fontSize: 40, mr: 2 }} />
								<Typography variant='h5' sx={{ color: 'primary.main' }}>
									Способы оплаты
								</Typography>
							</Box>
							<Typography variant='body1' paragraph>
								Мы предлагаем различные способы оплаты для вашего удобства:
							</Typography>
							<Box component='ul' sx={{ pl: 4 }}>
								<Typography component='li' variant='body1'>
									• Банковской картой онлайн
								</Typography>
								<Typography component='li' variant='body1'>
									• Наличными при получении
								</Typography>
								<Typography component='li' variant='body1'>
									• Картой при получении
								</Typography>
								<Typography component='li' variant='body1'>
									• Безналичный расчет для юридических лиц
								</Typography>
							</Box>
						</Grid>
						<Grid item xs={12} md={6}>
							<Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
								<SecurityIcon color='primary' sx={{ fontSize: 40, mr: 2 }} />
								<Typography variant='h5' sx={{ color: 'primary.main' }}>
									Безопасность платежей
								</Typography>
							</Box>
							<Typography variant='body1' paragraph>
								Все платежи обрабатываются через защищенное соединение с использованием
								современных протоколов шифрования. Мы гарантируем безопасность ваших
								платежных данных.
							</Typography>
							<Typography variant='body1'>
								При оплате картой онлайн используется защищенный протокол передачи данных,
								что обеспечивает максимальную защиту вашей информации.
							</Typography>
						</Grid>
					</Grid>
				</Box>

				{/* Дополнительная информация */}
				<Box component='section'>
					<Typography variant='h5' gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
						Важная информация
					</Typography>
					<Box component='ul' sx={{ pl: 4 }}>
						<Typography component='li' variant='body1' paragraph>
							• Перед доставкой наш менеджер свяжется с вами для подтверждения заказа
							и времени доставки
						</Typography>
						<Typography component='li' variant='body1' paragraph>
							• При получении товара необходимо проверить комплектацию и отсутствие
							повреждений
						</Typography>
						<Typography component='li' variant='body1' paragraph>
							• В случае вопросов по доставке или оплате, обращайтесь в нашу службу
							поддержки
						</Typography>
					</Box>
				</Box>
			</Paper>
		</Container>
	)
}
