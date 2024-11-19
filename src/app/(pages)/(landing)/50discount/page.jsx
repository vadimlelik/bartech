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
		question: 'Какой ваш любимый цвет?',
		type: 'radio',
		options: [
			{ value: 'red', label: 'Красный' },
			{ value: 'blue', label: 'Синий' },
			{ value: 'green', label: 'Зеленый' },
		],
	},
	{
		id: 2,
		question: 'Какой ваш возраст?',
		type: 'radio',
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
