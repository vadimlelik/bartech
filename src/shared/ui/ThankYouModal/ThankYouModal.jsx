'use client'

import React, { useEffect } from 'react'
import styles from './ThankYouModal.module.css'

const ThankYouModal = ({ isSubmitted }) => {
	useEffect(() => {
		if (isSubmitted) {
			const pixelId = 'CSVHR4JC77U84I7KUSI0'

			if (window.ttq) {
				console.log(window.ttq)
				window.ttq.load(pixelId)
				window.ttq.page()

				window.ttq.track('Lead', {
					content_name: 'Tank you page',
				})
			}
		}
	}, [isSubmitted])

	if (!isSubmitted) return null

	return (
		<div className={styles.modal}>
			<h2>Ваши данные успешно отправлены!</h2>
		</div>
	)
}

export default ThankYouModal
