'use client'

import React, { useEffect, useState } from 'react'
import styles from './phoneFreePage.module.css'
import Button from '@/app/components/button/Button'
import LogoIcon from '@/app/components/Logo/Logo'
import Image from 'next/image'
import Quiz from '@/app/components/quiz/Quiz'
import axios from 'axios'
import { useRouter } from 'next/navigation'

import { PIXEL } from '../../../../data/pixel'

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

const PhoneFree = () => {
	const [isQuizOpen, setIsQuizOpen] = useState(false)

	const router = useRouter()

	useEffect(() => {
		if (window.ttq) {
			window.ttq.load(PIXEL.phoneFree)
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
				router.push(`/thank-you?source=phoneFree`)
			})
	}

	const closeQuiz = () => {
		setIsQuizOpen(false)
	}
	const successMessage = (
		<div>{'Ваши данные успешно отправлены! Мы скоро свяжемся с вами'}</div>
	)
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
				onClose={closeQuiz}
				questions={questions}
				onSubmit={handleQuizSubmit}
				successMessage={successMessage}
			/>
		</main>
	)
}

export default PhoneFree
