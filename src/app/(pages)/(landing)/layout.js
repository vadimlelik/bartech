import Footer from '@/shared/ui/footer/Footer'

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
