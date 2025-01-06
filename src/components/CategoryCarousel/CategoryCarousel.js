'use client';

import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, MobileStepper } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';

const slides = [
	{
		id: 1,
		title: 'iPhone 15 Pro',
		subtitle: 'Рассрочка без переплат',
		description:
			'Новый iPhone 15 Pro в рассрочку до 24 месяцев без первого взноса! Титановый корпус, процессор A17 Pro и профессиональная система камер. Ежемесячный платеж всего от 149,99 руб.',
		image: '/images/iPhone_15 Pro_Max1.jpg',
		link: '/categories/apple',
		color: '#1976d2',
		buttonText: 'Купить в рассрочку',
	},
	{
		id: 2,
		title: 'Samsung Galaxy S24',
		subtitle: 'Предзаказ открыт',
		description:
			'Будьте первыми! Оформите предзаказ на новый Samsung Galaxy S24 и получите беспроводные наушники Galaxy Buds в подарок. Революционный ИИ, мощный процессор и передовая камера.',
		image: '/images/Samsung-S24-Blog.webp',
		link: '/categories/samsung',
		color: '#2196f3',
		buttonText: 'Оформить предзаказ',
	},
	{
		id: 3,
		title: 'Скидки до 50%',
		subtitle: 'На популярные модели смартфонов',
		description:
			'Грандиозная распродажа! Успейте купить топовые смартфоны со скидкой до 50%. В акции участвуют модели от Apple, Samsung, Xiaomi и других брендов. Количество товара ограничено.',
		image: '/images/38.970.jpg',
		link: '/categories/samsung',
		color: '#d32f2f',
		buttonText: 'Смотреть все акции',
	},
];

export default function CategoryCarousel() {
	const [activeStep, setActiveStep] = useState(0);
	const maxSteps = slides.length;
	const [autoPlay, setAutoPlay] = useState(true);

	useEffect(() => {
		let timer;
		if (autoPlay) {
			timer = setInterval(() => {
				setActiveStep((prevStep) => (prevStep + 1) % maxSteps);
			}, 6000); // Увеличил время показа до 6 секунд, чтобы люди успевали прочитать текст
		}
		return () => clearInterval(timer);
	}, [autoPlay, maxSteps]);

	const handleNext = () => {
		setActiveStep((prevStep) => (prevStep + 1) % maxSteps);
	};

	const handleBack = () => {
		setActiveStep((prevStep) => (prevStep - 1 + maxSteps) % maxSteps);
	};

	const currentSlide = slides[activeStep];

	return (
		<Box
			sx={{
				position: 'relative',
				width: '100%',
				height: { xs: '500px', md: '600px' }, // Увеличил высоту для большего текста
				overflow: 'hidden',
				mb: 4,
			}}
			onMouseEnter={() => setAutoPlay(false)}
			onMouseLeave={() => setAutoPlay(true)}
		>
			<Box
				sx={{
					height: '100%',
					position: 'relative',
					backgroundColor: currentSlide.color,
				}}
			>
				<Box
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						zIndex: 1,
						background:
							'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)',
					}}
				/>
				<Image
					src={currentSlide.image}
					alt={currentSlide.title}
					fill
					style={{ objectFit: 'cover' }}
					priority
				/>
				<Box
					sx={{
						position: 'absolute',
						left: { xs: '5%', md: '10%' },
						top: '50%',
						transform: 'translateY(-50%)',
						color: 'white',
						zIndex: 2,
						maxWidth: { xs: '90%', md: '600px' },
					}}
				>
					<Typography
						variant='h5'
						sx={{
							fontSize: { xs: '1.2rem', md: '1.5rem' },
							mb: 1,
							textTransform: 'uppercase',
							letterSpacing: '0.1em',
							color: currentSlide.color === '#d32f2f' ? '#ff6b6b' : '#90caf9',
						}}
					>
						{currentSlide.subtitle}
					</Typography>
					<Typography
						variant='h2'
						sx={{
							fontSize: { xs: '2.5rem', md: '3.5rem' },
							fontWeight: 'bold',
							mb: 2,
							textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
							lineHeight: 1.2,
						}}
					>
						{currentSlide.title}
					</Typography>
					<Typography
						variant='h6'
						sx={{
							mb: 4,
							textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
							fontSize: { xs: '1rem', md: '1.25rem' },
							lineHeight: 1.6,
							maxWidth: '90%',
						}}
					>
						{currentSlide.description}
					</Typography>
					<Link href={currentSlide.link} passHref>
						<Button
							variant='contained'
							size='large'
							sx={{
								backgroundColor: 'white',
								color: currentSlide.color,
								'&:hover': {
									backgroundColor: 'rgba(255,255,255,0.9)',
								},
								padding: '12px 32px',
								fontSize: '1.1rem',
								fontWeight: 'bold',
							}}
						>
							{currentSlide.buttonText}
						</Button>
					</Link>
				</Box>
			</Box>

			<Button
				size='small'
				onClick={handleBack}
				sx={{
					position: 'absolute',
					left: 16,
					top: '50%',
					transform: 'translateY(-50%)',
					zIndex: 2,
					color: 'white',
					backgroundColor: 'rgba(0,0,0,0.5)',
					minWidth: '48px',
					width: '48px',
					height: '48px',
					borderRadius: '50%',
					'&:hover': {
						backgroundColor: 'rgba(0,0,0,0.8)',
					},
				}}
			>
				<KeyboardArrowLeft />
			</Button>
			<Button
				size='small'
				onClick={handleNext}
				sx={{
					position: 'absolute',
					right: 16,
					top: '50%',
					transform: 'translateY(-50%)',
					zIndex: 2,
					color: 'white',
					backgroundColor: 'rgba(0,0,0,0.5)',
					minWidth: '48px',
					width: '48px',
					height: '48px',
					borderRadius: '50%',
					'&:hover': {
						backgroundColor: 'rgba(0,0,0,0.8)',
					},
				}}
			>
				<KeyboardArrowRight />
			</Button>

			<MobileStepper
				steps={maxSteps}
				position='static'
				activeStep={activeStep}
				sx={{
					position: 'absolute',
					bottom: 0,
					width: '100%',
					backgroundColor: 'transparent',
					'& .MuiMobileStepper-dot': {
						backgroundColor: 'rgba(255,255,255,0.5)',
						width: 12,
						height: 12,
						margin: '0 8px',
					},
					'& .MuiMobileStepper-dotActive': {
						backgroundColor: 'white',
					},
				}}
				nextButton={null}
				backButton={null}
			/>
		</Box>
	);
}
