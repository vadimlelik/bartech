'use client'

import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import { Autoplay } from 'swiper/modules'
import styles from './phonePage.module.css'
import Image from 'next/image'
import Button from '@/app/components/button/Button'
import Quiz from '@/app/components/quiz/Quiz'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { PIXEL } from '@/data/pixel'

import 'swiper/css'

const images = [
	'/tel/41787398_512_q55.avif',
	'/tel/41787399_509_q55.avif',
	'/tel/41787400_509_q55.avif',
	'/tel/41787401_513_q55.avif',
]
const questions = [
	{
		id: 1,
		question: 'Выберите бренд телефона',
		type: 'checkbox',
		options: [
			{ value: 'Xiaomi', label: 'Xiaomi' },
			{ value: 'Samsung', label: 'Samsung' },
			{ value: 'Apple', label: 'Apple' },
			{ value: 'Huawei', label: 'Huawei' },
			{ value: 'Redmi', label: 'Redmi' },
			{
				value: 'custom',
				label: 'Свой вариант',
			},
		],
	},
	{
		id: 2,
		question: 'Работаете ли Вы на последнем рабочем месте более 3-х месяцев?',
		type: 'radio',
		options: [
			{ value: 'yes', label: 'Да' },
			{ value: 'no', label: 'Нет' },
			{
				value: 'custom',
				label: 'Свой вариант',
			},
		],
	},
	{
		id: 3,
		question: 'На какой ежемесячный платеж Вы рассчитываете?',
		type: 'radio',
		options: [
			{ value: 'coffee', label: 'от 30 до 50 BYN/мес' },
			{ value: '50/100', label: 'от 50 до 100 BYN/мес' },
			{ value: '100/200', label: 'от 100 до 200 BYN/мес' },
			{ value: '200', label: 'от 200 BYN/мес' },
			{
				value: 'custom',
				label: 'Свой вариант',
			},
		],
	},
	{
		id: 4,
		question: 'Введите ваш номер телефона',
		type: 'text',
	},
]

const Phone2 = () => {
	const [isQuizOpen, setIsQuizOpen] = useState(false)
	const router = useRouter()

	useEffect(() => {
		if (window.ttq) {
			window.ttq.load(PIXEL.phone1)
			window.ttq.page()
		}
	}, [])

	const handleQuizSubmit = async (data) => {
		axios
			.post(
				'https://technobar.bitrix24.by/rest/25/7fjyayckv4fkh0c2/crm.lead.add.json',
				data
			)
			.then(() => {
				router.push(`/thank-you?source=phone1`)
			})
	}

	const closeQuiz = () => {
		setIsQuizOpen(false)
	}

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<div className={styles.wrapper}>
					<h5 className={styles.rating}>
						(4,9) ⭐️⭐️⭐️⭐️⭐️ 1031 отзыв Интернет-магазина
					</h5>
					<div className={styles.sliderContainer}>
						<Swiper
							modules={[Autoplay]}
							slidesPerView={1}
							navigation
							pagination={{ clickable: true }}
							autoplay={{ delay: 2000, disableOnInteraction: false }}
							className={styles.slider}
						>
							{images.map((src, index) => (
								<SwiperSlide key={index}>
									<div className={styles.slideWrapper}>
										<Image
											src={src}
											alt={`Slide ${index + 1}`}
											width={400}
											height={300}
											objectFit='cover' // Сохраняет пропорции изображения
											className={styles.image}
											priority={index === 0} // Приоритет для первого изображения
										/>
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					</div>
					<h1 className={styles.title}>ТЕЛЕФОНЫ В РАССРОЧКУ СО СКИДКОЙ 50%</h1>
					<ul className={styles.info}>
						<li className={styles.infoItem}>
							✅ Одобряем всем без справок о доходах
						</li>
						<li className={styles.infoItem}>✅ 0 рублей первый взнос</li>
						<li className={styles.infoItem}>✅ Всего от 29 руб/мес</li>
						<li className={styles.infoItem}>
							✅ Расширенная гарантия 3 года в Подарок
						</li>
					</ul>
					<div className={styles.bye}>
						<strong className={styles.byeText}>
							Жмите кнопку ниже,
							<br /> чтобы подобрать модель и узнать цену
						</strong>
						<p>⬇️⬇️⬇️⬇️⬇️</p>
						<Button
							className={styles.button}
							label='Подобрать телефон'
							onClick={() => setIsQuizOpen(true)}
						/>
					</div>
				</div>
			</div>

			<Quiz
				isOpen={isQuizOpen}
				onClose={closeQuiz}
				questions={questions}
				onSubmit={handleQuizSubmit}
			/>
		</div>
	)
}

export default Phone2
