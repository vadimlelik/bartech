// components/CountdownTimer.js
import { useState, useEffect } from 'react'
import styles from './CountdownTimer.module.css'
import classNames from 'classnames'

export default function CountdownTimer({ className }) {
	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft(calculateTimeLeft())
		}, 1000)

		return () => clearInterval(timer)
	}, [])

	function calculateTimeLeft() {
		const now = new Date()
		const nextDay = new Date()
		nextDay.setHours(24, 0, 0, 0)
		const difference = nextDay - now

		return {
			hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
			minutes: Math.floor((difference / (1000 * 60)) % 60),
			seconds: Math.floor((difference / 1000) % 60),
		}
	}

	return (
		<div className={classNames([styles.timer, className])}>
			{Object.entries(timeLeft).map(([key, value]) => (
				<div key={key} className={styles.timerItem}>
					<span>{String(value).padStart(2, '0')}</span>
					<span className={styles.label}>
						{key === 'hours' ? 'ЧАСОВ' : key === 'minutes' ? 'МИНУТ' : 'СЕКУНД'}
					</span>
				</div>
			))}
		</div>
	)
}
