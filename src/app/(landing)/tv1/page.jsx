'use client'

import React, { useEffect, useState } from 'react'
import styles from './tvPage.module.css'
import Image from 'next/image'
import LogoIcon from '@/app/(shop)/components/Logo/Logo'
import Button from '@/app/(shop)/components/button/Button'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { PIXEL } from '@/data/pixel'
import Quiz from '@/components/quiz/Quiz'

const questions = [
	{
		id: 1,
		question: 'Выберите бренд телевизора!',
		type: 'checkbox',
		options: [
			{ label: 'Samsung', value: 'Samsung' },
			{ label: 'TCL', value: 'TCL' },
			{ label: 'LG', value: 'LG' },
			{ label: 'Sony', value: 'Sony' },
			{ label: 'Panasonic', value: 'Panasonic' },
			{ label: 'Philips', value: 'Philips' },
			{ label: 'Xiaomi', value: 'Xiaomi' },
		],
	},
	{
		id: 2,
		question: 'Работаете ли Вы на последнем рабочем месте более 3-х месяцев?',
		type: 'radio',
		options: [
			{ value: 'yes', label: 'Да' },
			{ value: 'no', label: 'Нет' },
		],
	},
	{
		id: 3,
		question: 'На какой ежемесячный платеж Вы рассчитываете?',
		type: 'radio',
		options: [
			{ label: 'от 30 до 50 BYN/мес', value: 'от 30 до 50 BYN/мес' },
			{ label: 'от 50 до 100 BYN/мес', value: 'от 50 до 100 BYN/мес' },
			{ label: 'от 100 до 200 BYN/мес', value: 'от 100 до 200 BYN/мес' },
			{ label: 'от 200  BYN/мес', value: 'от 200  BYN/мес' },
		],
	},
	{
		id: 4,
		question: 'Введите ваш номер телефона',
		type: 'text',
	},
]

const Tv = () => {
	const [isQuizOpen, setIsQuizOpen] = useState(false)
	const router = useRouter()

	useEffect(() => {
		if (window.ttq) {
			window.ttq.load(PIXEL.tv)
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
				router.push(`/thank-you?source=tv`)
			})
	}

	const closeQuiz = () => {
		setIsQuizOpen(false)
	}

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<div className={styles.wrapper}>
					<div className='logo'>
						<LogoIcon className={styles.logoIcon} />
					</div>

					<div className={styles.intro}>
						<h1 className={styles.title}>
							ТЕЛЕВИЗОРЫ В РАССРОЧКУ
							<br />
							<span>БЕЗ ПЕРВОГО ВЗНОСА И ПЕРЕПЛАТ!</span>
						</h1>
						<p className={styles.description}>
							... 9 из 10 клиентов получают рассрочку без процентов и первого
							платежа после разговора с менеджером. Жмите на кнопку, чтобы
							оформить рассрочку и получить консультацию специалиста ...
						</p>
						<Button
							onClick={() => setIsQuizOpen(true)}
							label='Купить в рассрочку'
							color='orange'
							size='large'
							className={styles.btnArrow}
						/>
					</div>
					<div className={styles.content}>
						<div className={styles.info}>
							<h2 className={styles.infoTitle}>
								ТЕЛЕВИЗОРЫ <span>ОТ 30 BYN</span> В МЕСЯЦ{' '}
								<span>
									В РАССРОЧКУ <br /> ДО 5 ЛЕТ!
								</span>
							</h2>
							<ul className={styles.infoDescription}>
								<li className={styles.infoDescriptionItem}>
									В БЕЛОРУССКИХ РУБЛЯХ
								</li>
								<li className={styles.infoDescriptionItem}>
									БЕЗ СПРАВОК О ДОХОДАХ
								</li>
								<li className={styles.infoDescriptionItem}>
									БЕЗ ПЕРВОГО ВЗНОСА
								</li>
								<li className={styles.infoDescriptionItem}>БЕЗ ПЕРЕПЛАТ</li>
								<li className={styles.infoDescriptionItem}>
									БЕСПЛАТНАЯ ДОСТАВКА ПО ВСЕЙ БЕЛАРУСИ
								</li>
							</ul>
						</div>
						<div className={styles.image}>
							<Image
								width={500}
								height={800}
								src={'/image_tv.jpg'}
								alt='tv'
								className={styles.img}
							/>
						</div>
					</div>

					<div className={styles.reviews}>
						<div className={styles.reviewsItem}>
							<div className={styles.reviewsItemImg}>
								<Image
									width={100}
									height={100}
									src={'/commentLogo-1.jpg'}
									alt='review1'
									className={styles.avatar}
								/>
							</div>
							<div className={styles.reviewsItemText}>
								<p className={styles.reviewsItemTitle}>Сергей, 32</p>
								<p className={styles.reviewsItemDescription}>
									Приобрел TCL 55 диагонали – отличное соотношение цены и
									качества. Классная картинка и насыщенные цвета. Удобный
									интерфейс с множеством приложения летают. Рассрочку оформили
									быстро, привезли на следующий день. Сервисом доволен. Планирую
									приобрести саундбар в этом магазине. Рекомендую.
								</p>
							</div>
						</div>
						<div className={styles.reviewsItem}>
							<div className={styles.reviewsItemImg}>
								<Image
									width={100}
									height={100}
									src={'/commentLogo-2.jpg'}
									alt='review1'
									className={styles.avatar}
								/>
							</div>
							<div className='reviewsItemText'>
								<p className={styles.reviewsItemTitle}>Дмитрий, 27</p>
								<p className={styles.reviewsItemDescription}>
									Всегда хотел андроидТВ с OLED, но отвалить круглую сумму сразу
									было жалко, взял у ребят в рассрочку. Все просто и понятно, а
									главное быстро. Вот теперь смотрю на новенький Самсунг и глаз
									радуется. Яркие, насыщенные цвета и глубокий черный, все как и
									хотел. Не прогадал с телевизором и магазином, буду обращаться
									еще.
								</p>
							</div>
						</div>
						<div className={styles.reviewsItem}>
							<div className={styles.reviewsItemImg}>
								<Image
									width={100}
									height={100}
									src={'/commentLogo-3.jpg'}
									alt='review1'
									className={styles.avatar}
								/>
							</div>
							<div className='reviewsItemText'>
								<p className={styles.reviewsItemTitle}>Ольга, 45</p>
								<p className={styles.reviewsItemDescription}>
									Скажу вам, что Haier - это та самая золотая середина
									соотношения цены и качества. Изображение с яркими цветами и
									адекватной контрастностью для своего класса. Смарт-функций
									реально много, даже дети в игрушки могут поиграть. Искала
									выгодную рассрочку, нашла этот магазин. Пообщались с
									менеджером, все устроило, сервис на уровне, советую.
								</p>
							</div>
						</div>
					</div>
					<Button
						label='Купить в рассрочку'
						color='orange'
						size='large'
						onClick={() => setIsQuizOpen(true)}
					/>
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

export default Tv
