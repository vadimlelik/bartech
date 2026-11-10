import { notFound } from 'next/navigation';
import { Typography, Box, Grid, Divider } from '@mui/material';
import { ShopPage, ShopSurface } from '@/shared/ui/shop-page/ShopPage';
import PaymentIcon from '@mui/icons-material/Payment';
import SecurityIcon from '@mui/icons-material/Security';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import { getPageCity } from '@/entities/city/model/cities';
import { DEFAULT_CITY_SLUG, withCityPrefix } from '@/shared/config/city-routes';
import { buildRegionalDeliveryCopy } from '@/shared/lib/city-seo';
import { getBreadcrumbSchema } from '@/shared/lib/seo';
import ServiceDeliveryDetails from '@/entities/locality/ui/ServiceDeliveryDetails';

export async function generateMetadata() {
	const city = await getPageCity();
	if (!city) {
		return { title: 'Страница не найдена', robots: { index: false, follow: false } };
	}
	const prefix = city.slug !== DEFAULT_CITY_SLUG ? `/${city.slug}` : '';
	const regional = city.slug === DEFAULT_CITY_SLUG ? null : buildRegionalDeliveryCopy(city);
	const title = regional
		? regional.title
		: 'Оплата и доставка — Texnobar | Доставка техники по Минску и Беларуси';
	const description = regional
		? regional.description
		: 'Условия доставки и оплаты в Texnobar. Доставка по Минску — в день заказа. Доставка по Беларуси — 1–3 дня. Оплата картой, наличными или в рассрочку. Бесплатно от 1000 BYN.';
	return {
		title,
		description,
		alternates: { canonical: `${siteUrl}${prefix}/payment_delivery` },
		openGraph: {
			title: regional ? regional.title : 'Оплата и доставка — Texnobar',
			description: regional
				? regional.description
				: 'Доставка по Минску в день заказа. Оплата картой, наличными или в рассрочку.',
			url: `${siteUrl}${prefix}/payment_delivery`,
			type: 'website',
		},
	};
}

export default async function PaymentDelivery() {
	const city = await getPageCity();
	if (!city) notFound();
	const payments = city?.paymentMethods || [];
	const homeHref = withCityPrefix(city?.slug, '/');
	const pageHref = withCityPrefix(city?.slug, '/payment_delivery');
	const breadcrumbSchema = getBreadcrumbSchema([
		{ name: 'Главная', url: homeHref },
		{ name: 'Оплата и доставка', url: pageHref },
	]);
	const title = city && city.slug !== DEFAULT_CITY_SLUG
		? `Оплата и доставка в ${city.nameIn || city.name}`
		: 'Оплата и доставка в Минске';
	return (
		<>
		{breadcrumbSchema ? (
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
			/>
		) : null}
		<ShopPage
			showInfoNav
			title={title}
			breadcrumbs={[
				{ href: homeHref, label: 'Главная' },
				{ label: 'Оплата и доставка' },
			]}
		>
			<ShopSurface>
				<Box component='section' sx={{ mb: 6 }}>
					<ServiceDeliveryDetails />
				</Box>

				<Divider sx={{ my: 4 }} />

				<Box component='section' sx={{ mb: 6 }}>
					<Grid container spacing={4}>
						<Grid item xs={12} md={6}>
							<Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
								<PaymentIcon color='primary' sx={{ fontSize: 40, mr: 2 }} />
								<Typography variant='h5' component='h2' sx={{ fontWeight: 700 }}>
									Способы оплаты
								</Typography>
							</Box>
							<Typography variant='body1' paragraph>
								Мы предлагаем различные способы оплаты для вашего удобства:
							</Typography>
							<Box component='ul' sx={{ pl: 4 }}>
								{(payments.length ? payments : []).map((method) => (
									<Typography component='li' variant='body1' key={method.id}>
										• {method.title}
									</Typography>
								))}
							</Box>
						</Grid>
						<Grid item xs={12} md={6}>
							<Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
								<SecurityIcon color='primary' sx={{ fontSize: 40, mr: 2 }} />
								<Typography variant='h5' sx={{ fontWeight: 700 }}>
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

				<Box component='section'>
					<Typography variant='h5' gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
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
			</ShopSurface>
		</ShopPage>
		</>
	);
}
