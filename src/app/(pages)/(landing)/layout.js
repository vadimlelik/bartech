import Footer from '@/shared/ui/footer/Footer'

export const metadata = {
	title: 'Технобар',
	description: 'Интернет магазин Технобар',
	icons: {
		icon: '/Frame_3506.png',
		shortcut: '/Frame_3506.png',
		apple: '/icon_apple.png', // Для Apple устройств
	},
}

export default function LandingLayout({ children }) {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				minHeight: '100vh',
			}}
		>
			{children}
			<Footer />
		</div>
	)
}
