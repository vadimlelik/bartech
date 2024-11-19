// components/Marquee.js
export default function Marquee({
	message = 'ТОЛЬКО ПЯТЬ ДНЕЙ ',
	color = 'black',
	speed = '50s',
	colorText = 'white',
}) {
	return (
		<div className='marquee'>
			<div className='marquee-track'>
				<span>{message.repeat(10)}</span>
			</div>
			<style jsx>{`
				.marquee {
					width: 100%;
					overflow: hidden;
					position: relative;
					background: ${color};
					white-space: nowrap;
				}

				.marquee-track {
					display: inline-block;
					white-space: nowrap;
					animation: scroll ${speed} linear infinite;
				}

				.marquee-track span {
					display: inline-block;
					white-space: nowrap;
					color: ${colorText};
					font-size: 1.5rem;
					font-weight: bold;
				}

				@keyframes scroll {
					0% {
						transform: translateX(0%);
					}
					100% {
						transform: translateX(-100%);
					}
				}
			`}</style>
		</div>
	)
}
