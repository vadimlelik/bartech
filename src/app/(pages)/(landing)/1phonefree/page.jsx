'use client'

import React, { useState } from 'react'
import styles from './phoneFreePage.module.css'
import Button from '@/app/components/button/Button'
import LogoIcon from '@/app/components/Logo/Logo'
import Image from 'next/image'
import Quiz from '@/app/components/quiz/Quiz'
const questions = [
	{
		id: 1,
		question: 'Какой ваш любимый цвет?',
		type: 'checkbox',
		options: [
			{ value: 'red', label: 'Красный' },
			{ value: 'blue', label: 'Синий' },
			{ value: 'green', label: 'Зеленый' },
		],
	},
	{
		id: 2,
		question: 'Какой ваш возраст?',
		type: 'checkbox',
		options: [
			{ value: '18-25', label: '18-25' },
			{ value: '26-35', label: '26-35' },
			{ value: '36+', label: '36+' },
		],
	},
	{
		id: 3,
		question: 'Какой ваш любимый напиток?',
		type: 'radio',
		options: [
			{ value: 'coffee', label: 'Кофе' },
			{ value: 'tea', label: 'Чай' },
			{ value: 'water', label: 'Вода' },
		],
	},
	{
		id: 4,
		question: 'Комментарий к вопросу.',
		type: 'text',
	},
]

const PhoneFree = () => {
	const [isQuizOpen, setIsQuizOpen] = useState(false)
	return (
		<main className={styles.page}>
			<div className={styles.container}>
				<h1 className={styles.title}>
					ДВА ТЕЛЕФОНА ПО <span>ЦЕНЕ</span> ОДНОГО!
				</h1>
				<div className={styles.content}>
					<div className={styles.images}>
						<Image
							src='/1phonefree.jpg'
							alt='1phonefree_img'
							width={400}
							height={300}
						/>
					</div>
					<div className={styles.info}>
						<h2 className={styles.infoTitle}>
							ПЛАТИ ЗА ОДИН СМАРТФОН, А ВТОРОЙ <br />
							<span>ЗАБИРАЙ БЕСПЛАТНО</span>
						</h2>
						<ul className={styles.infoList}>
							<li className={styles.infoItem}>9 ИЗ 10 ПОЛУЧАЮТ ОДОБРЕНИЕ</li>
							<li className={styles.infoItem}>0 РУБЛЕЙ ПЕРВОНАЧАЛЬНЫЙ ВЗНОС</li>
							<li className={styles.infoItem}>
								БЕСПЛАТНАЯ ДОСТАВКА ПО ВСЕЙ БЕЛАРУСИ
							</li>
							<li className={styles.infoItem}>ПОДБЕРЕМ И ОФОРМИМ ЗА 5 МИНУТ</li>
						</ul>
						<span className={styles.infoLike}>ЖМИ НИЖЕ ЧТОБЫ НАЧАТЬ</span>
						<p>
							Пройдите тест за 1 минуту и получите{' '}
							<span>ВТОРОЙ ТЕЛЕФОН В ПОДАРОК :</span>
						</p>
					</div>
				</div>
				<div className={styles.btnWrapper}>
					<Button
						className={styles.btn}
						label='Пройти Тест'
						color='dangery'
						size='large'
						onClick={() => setIsQuizOpen(true)}
					/>
				</div>

				<div className={styles.logo}>
					<LogoIcon className={styles.logoIcon} />
				</div>
			</div>
			<Quiz
				isOpen={isQuizOpen}
				onClose={() => setIsQuizOpen(false)}
				questions={questions}
			/>
		</main>
	)
}

export default PhoneFree
