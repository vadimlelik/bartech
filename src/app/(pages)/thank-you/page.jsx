'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from './ThankYou.module.css'

import { PIXEL } from '../../../data/pixel'
import { useSearchParams } from 'next/navigation'

const ThankYouPage = () => {
	const searchParams = useSearchParams()
	const source = searchParams.get('source') // Достаем параметр `source` из U

	useEffect(() => {
		if (source) {
			const pixelId = PIXEL[source]

			console.log(pixelId)

			if (window.ttq) {
				window.ttq.load(pixelId)
				window.ttq.page()
			}
		}
	}, [source])

	return (
		<div className={styles.container}>
			<motion.h1
				className={styles.title}
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 1 }}
			>
				Спасибо за отправку формы!
			</motion.h1>

			{/* Подзаголовок с анимацией */}
			<motion.p
				className={styles.subtitle}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1, duration: 1 }}
			>
				Мы получили ваши данные и скоро свяжемся с вами.
			</motion.p>

			{/* Анимация благодарности */}
			<motion.div
				className={styles.animationContainer}
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ duration: 0.8, delay: 1.5 }}
			>
				<motion.div
					className={styles.heart}
					initial={{ scale: 1 }}
					animate={{ scale: [1, 1.2, 1] }}
					transition={{ repeat: Infinity, duration: 1.5 }}
				>
					❤️
				</motion.div>
			</motion.div>
		</div>
	)
}

export default ThankYouPage
