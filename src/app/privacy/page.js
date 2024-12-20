import { Container, Typography, Box, Paper } from '@mui/material'

export default function Privacy() {
	return (
		<Container maxWidth='lg' sx={{ py: 6 }}>
			<Paper elevation={0} sx={{ p: { xs: 2, md: 4 } }}>
				<Typography variant='h4' component='h1' gutterBottom align='center' sx={{ mb: 4 }}>
					Политика конфиденциальности
				</Typography>

				<Box component='section' sx={{ mb: 4 }}>
					<Typography variant='h5' gutterBottom sx={{ color: 'primary.main' }}>
						1. Общие положения
					</Typography>
					<Typography variant='body1' paragraph>
						Настоящая политика конфиденциальности описывает, как мы собираем,
						используем и защищаем вашу личную информацию при использовании
						нашего сайта.
					</Typography>
				</Box>

				<Box component='section' sx={{ mb: 4 }}>
					<Typography variant='h5' gutterBottom sx={{ color: 'primary.main' }}>
						2. Сбор информации
					</Typography>
					<Typography variant='body1' paragraph>
						Мы собираем информацию, которую вы предоставляете нам напрямую:
					</Typography>
					<Box component='ul' sx={{ pl: 4, mb: 2 }}>
						<Typography component='li' variant='body1'>
							• Имя и контактная информация
						</Typography>
						<Typography component='li' variant='body1'>
							• Адрес доставки
						</Typography>
						<Typography component='li' variant='body1'>
							• История заказов
						</Typography>
					</Box>
				</Box>

				<Box component='section' sx={{ mb: 4 }}>
					<Typography variant='h5' gutterBottom sx={{ color: 'primary.main' }}>
						3. Использование информации
					</Typography>
					<Typography variant='body1' paragraph>
						Мы используем собранную информацию для:
					</Typography>
					<Box component='ul' sx={{ pl: 4, mb: 2 }}>
						<Typography component='li' variant='body1'>
							• Обработки ваших заказов
						</Typography>
						<Typography component='li' variant='body1'>
							• Улучшения работы сайта
						</Typography>
						<Typography component='li' variant='body1'>
							• Связи с вами по поводу заказов
						</Typography>
					</Box>
				</Box>

				<Box component='section' sx={{ mb: 4 }}>
					<Typography variant='h5' gutterBottom sx={{ color: 'primary.main' }}>
						4. Защита информации
					</Typography>
					<Typography variant='body1' paragraph>
						Мы принимаем необходимые меры для защиты вашей личной информации от
						несанкционированного доступа, использования или раскрытия. Все данные
						хранятся на защищенных серверах и обрабатываются с соблюдением
						требований законодательства о защите персональных данных.
					</Typography>
				</Box>

				<Box component='section' sx={{ mb: 4 }}>
					<Typography variant='h5' gutterBottom sx={{ color: 'primary.main' }}>
						5. Файлы cookie
					</Typography>
					<Typography variant='body1' paragraph>
						Наш сайт использует файлы cookie для улучшения пользовательского опыта.
						Вы можете отключить использование файлов cookie в настройках вашего браузера,
						однако это может повлиять на функциональность сайта.
					</Typography>
				</Box>

				<Box component='section'>
					<Typography variant='h5' gutterBottom sx={{ color: 'primary.main' }}>
						6. Контакты
					</Typography>
					<Typography variant='body1' paragraph>
						Если у вас есть вопросы о нашей политике конфиденциальности,
						пожалуйста, свяжитесь с нами по электронной почте или через форму обратной связи
						на сайте. Мы обязуемся рассмотреть ваш запрос и ответить в течение 3 рабочих дней.
					</Typography>
				</Box>
			</Paper>
		</Container>
	)
}
