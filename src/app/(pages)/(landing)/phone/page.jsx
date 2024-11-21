'use client'

import React, { useState } from 'react'
import styles from './phonePage.module.css'
import Image from 'next/image'
import LogoIcon from '@/app/components/Logo/Logo'
import Button from '@/app/components/button/Button'
import Quiz from '@/app/components/quiz/Quiz'
import axios from 'axios'

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

const Phone = () => {
	const [isQuizOpen, setIsQuizOpen] = useState(false)

	const handleQuizSubmit = async (data) => {
		axios.post(
			'https://technobar.bitrix24.by/rest/25/7fjyayckv4fkh0c2/crm.lead.add.json',
			data
		)
	}

	const successMessage = (
		<div>{'Ваши данные успешно отправлены! Мы скоро свяжемся с вами'}</div>
	)
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
							ТЕЛЕФОНЫ В РАССРОЧКУ
							<br />
							<span>БЕЗ ПЕРВОГО ВЗНОСА И ПЕРЕПЛАТ!</span>
						</h1>
						<p className={styles.description}>
							... 9 из 10 клиентов получают рассрочку без процентов и первого
							платежа после <br />
							разговора с менеджером. Жмите на кнопку, чтобы оформить рассрочку
							и получить <br />
							консультацию специалиста ...
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
								ТЕЛЕФОНЫ <span>ОТ 20 BYN</span>
								<br /> В МЕСЯЦ
								<span>
									{' '}
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
								<li className={styles.infoDescriptionItem}>БЕЗ ПОРУЧИТЕЛЕЙ</li>
								<li className={styles.infoDescriptionItem}>
									БЕЗ ПЕРВОГО ВЗНОСА
								</li>
								<li className={styles.infoDescriptionItem}>БЕЗ ПЕРЕПЛАТ</li>
								<li className={styles.infoDescriptionItem}>
									БЕСПЛАТНАЯ ДОСТАВКА ПО ВСЕЙ БЕЛАРУСИ
								</li>
							</ul>
							<Button
								onClick={() => setIsQuizOpen(true)}
								label='Купить в рассрочку'
								color='orange'
								size='large'
								className={styles.btn}
							/>
						</div>
						<div className={styles.image}>
							<Image
								width={500}
								height={800}
								src={'/phone.jpg'}
								alt='tv'
								className={styles.img}
							/>
						</div>
					</div>
					<div className={styles.headphonesWrapper}>
						<h5 className={styles.headphonesTitle}>
							Оформите рассрочку в течении 24 часов
							<br />
							<span>И ПОЛУЧИТЕ БЕСПЛАТНО</span> <br />
							беспроводные наушники в подарок
						</h5>
						<Image
							width={360}
							height={205}
							src={'/headphones.jpeg'}
							alt='headphones'
							className={styles.headphonesImg}
						/>
						<Button
							onClick={() => setIsQuizOpen(true)}
							label='Купить в рассрочку'
							color='orange'
							size='large'
						/>
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
							<div className='reviewsItemText'>
								<p className={styles.reviewsItemTitle}>Андрей, 22</p>
								<p className={styles.reviewsItemDescription}>
									Давно хотел себе новый мощный телефон, чтобы можно было и в
									игры поиграть, и фильм посмотреть, и не сидеть постоянно на
									зарядке. Оставил заявку. Менеджеры быстро связались, ответили
									на все вопросы и предложили на выбор несколько других
									вариантов телефонов под мой запрос. Через 10 минут оформили
									рассрочку и уже на следующий день бесплатно доставили прямо
									домой. Упаковка безупречная и отдельное спасибо за наушники в
									подарок. Очень доволен покупкой, сервисом и качественным
									обслуживанием. Магазин рекомендую
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
								<p className={styles.reviewsItemTitle}>Саша, 34</p>
								<p className={styles.reviewsItemDescription}>
									Покупал в магазине смартфон. Долго не мог определиться с
									моделью, но консультанты предложили несколько идеальных
									вариантов под мой запрос и помогли выбрать самый оптимальный
									вариант для меня. Условия оплаты очень гибкие. Выбрал
									рассрочку без переплат. Телефон доставили точно в срок,
									упаковка целая, еще и наушники в подарок привезли. Очень рад
									покупке и сервисом магазина остался доволен.
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
								<p className={styles.reviewsItemTitle}>Света, 41</p>
								<p className={styles.reviewsItemDescription}>
									Процесс заказа очень простой. Выбрала смартфон. Оставила
									заявку. А после обсудили условия рассрочки с менеджером и все.
									Очень важно было, чтобы быстро могли доставить телефон.
									Понравилось, что у них бесплатная доставка абсолютно в любую
									точку Беларуси. Телефон был у меня уже на следующий день.
									Курьер заранее позвонил, предупредил, во сколько приедет. Это
									огромный плюс. Приятно, когда сервис на высоте. Рекомендую
									магазин всем!
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
				successMessage={successMessage}
			/>
		</div>
	)
}

export default Phone
