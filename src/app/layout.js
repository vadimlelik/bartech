import './globals.css'
import { Roboto } from 'next/font/google' // Импорт шрифта

const roboto = Roboto({
	subsets: ['latin'],
	weight: ['300', '400', '700'],
	style: ['normal'],
	display: 'swap',
})

export const metadata = {
	title: 'Технобар',
	description: 'Интернет магазин Технобар',
	icons: {
		icon: '/Frame_3506.png',
		shortcut: '/Frame_3506.png',
		apple: '/icon_apple.png', // Для Apple устройств
	},
}

export default function RootLayout({ children }) {
	return (
		<html lang='ru'>
			<body
				className={`${roboto.className} `}
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					minHeight: '100vh',
				}}
			>
				<div style={{ flexGrow: 1 }}>{children}</div>
			</body>
		</html>
	)
}
