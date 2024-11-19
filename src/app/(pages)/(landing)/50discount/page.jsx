'use client'
import CountdownTimer from '@/app/components/CountdownTimer/CountdownTimer'
import Marquee from '@/app/components/Marquee/Marquee'
import style from './discountPage.module.css'
import Button from '@/app/components/button/Button'
import { useState } from 'react'
import Quiz from '@/app/components/quiz/Quiz'

const questions = [
	{
		id: 1,
		question: 'Выберите бренд телефона',
		type: 'radio',
		options: [
			{ value: 'Xiaomi', label: 'Xiaomi' },
			{ value: 'Samsung', label: 'Samsung' },
			{ value: 'Apple', label: 'Apple' },
			{
				value: 'Huawei',
				label: 'Huawei',
			},
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
		question: 'Комментарий к вопросу.',
		type: 'text',
	},
]

export default function DiscountPage() {
	const [isQuizOpen, setIsQuizOpen] = useState(false)
	return (
		<div className={style.page}>
			<Marquee />
			<div className={style.content}>
				<h1 className={style.title}>
					НОВЫЕ СМАРТФОНЫ
					<br />
					<span>СО СКИДКОЙ 50%</span>
				</h1>
				<h3 className={style.subtitle}>ДО КОНЦА РАСПРОДАЖИ ОСТАЛОСЬ:</h3>
				<CountdownTimer className={style.discountTimer} />
				<h5 className={style.description}>НАУШНИКИ В ПОДАРОК!</h5>
				<Button
					label='Оформить заказ'
					color='dangery'
					size='small'
					onClick={() => setIsQuizOpen(true)}
				/>
			</div>
			<Marquee color='red' colorText='white' />
			<div className={style.info}>
				<ul className={style.infoList}>
					<li className={style.InfoItem}>
						БЕСПЛАТНАЯ ДОСТАВКА ПО ВСЕЙ БЕЛАРУСИ
					</li>
					<li className={style.InfoItem}>БЕЗ ПЕРВОГО ВЗНОСА И ПЕРЕПЛАТ</li>
					<li className={style.InfoItem}>РАССРОЧКУ ОДОБРЯЕМ ВСЕМ</li>
					<li className={style.InfoItem}>
						БЕЗ ПОРУЧИТЕЛЕЙ И СПРАВОК О ДОХОДАХ
					</li>
					<li className={style.InfoItem}>ДАРИМ НАУШНИКИ К КАЖДОМУ ЗАКАЗУ</li>
				</ul>
			</div>
			<Marquee color='yellow' colorText='black' />
			<Quiz
				isOpen={isQuizOpen}
				onClose={() => setIsQuizOpen(false)}
				questions={questions}
			/>
		</div>
	)
}
