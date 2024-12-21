'use client'

import React from 'react'
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Avatar,
    Rating,
    Grid,
    Divider,
} from '@mui/material'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

const reviews = [
    {
        id: 1,
        name: 'Александр Петров',
        rating: 5,
        date: '2024-01-15',
        product: 'iPhone 15 Pro',
        text: 'Отличный магазин! Купил iPhone 15 Pro в рассрочку, процесс оформления занял всего 15 минут. Консультант Мария подробно объяснила все условия. Телефон доставили уже на следующий день. Очень доволен сервисом!',
        avatar: '/images/avatars/avatar1.jpg'
    },
    {
        id: 2,
        name: 'Елена Соколова',
        rating: 5,
        date: '2024-01-10',
        product: 'Samsung Galaxy S23',
        text: 'Приятно удивлена скоростью обработки заказа и профессионализмом сотрудников. Оформила рассрочку на Samsung Galaxy S23, одобрили практически моментально. Ежемесячный платеж очень комфортный. Спасибо за отличный сервис!',
        avatar: '/images/avatars/avatar2.jpg'
    },
    {
        id: 3,
        name: 'Дмитрий Волков',
        rating: 5,
        date: '2024-01-05',
        product: 'iPhone 14',
        text: 'Второй раз покупаю телефон в этом магазине. Радует отсутствие первого взноса и быстрое оформление рассрочки. Персонал всегда вежливый и готов помочь с выбором. Рекомендую всем!',
        avatar: '/images/avatars/avatar3.jpg'
    },
    {
        id: 4,
        name: 'Анна Ковалева',
        rating: 5,
        date: '2023-12-28',
        product: 'Samsung Galaxy A54',
        text: 'Заказывала Samsung Galaxy A54. Порадовала возможность оформить рассрочку онлайн. Курьер привез телефон прямо домой, все документы оформили на месте. Отдельное спасибо за подробную консультацию по функциям телефона!',
        avatar: '/images/avatars/avatar4.jpg'
    },
    {
        id: 5,
        name: 'Игорь Сидоров',
        rating: 4,
        date: '2023-12-20',
        product: 'iPhone 13',
        text: 'Хороший магазин с адекватными ценами. Купил iPhone 13 в рассрочку. Процесс оформления простой и понятный. Единственное, пришлось подождать доставку пару дней, но это не критично. В целом, доволен покупкой.',
        avatar: '/images/avatars/avatar5.jpg'
    },
    {
        id: 6,
        name: 'Марина Козлова',
        rating: 5,
        date: '2023-12-15',
        product: 'Samsung Galaxy S23 Ultra',
        text: 'Потрясающий сервис! Долго выбирала где купить Samsung Galaxy S23 Ultra, и не прогадала с этим магазином. Рассрочку одобрили быстро, условия выгодные. Телефон оригинальный, полная комплектация. Очень довольна!',
        avatar: '/images/avatars/avatar6.jpg'
    },
    {
        id: 7,
        name: 'Павел Морозов',
        rating: 5,
        date: '2023-12-10',
        product: 'iPhone 15',
        text: 'Спасибо магазину за отличный сервис! Заказал iPhone 15, привезли в тот же день. Особенно порадовала возможность оформить рассрочку без первоначального взноса. Менеджеры работают оперативно и профессионально.',
        avatar: '/images/avatars/avatar7.jpg'
    },
    {
        id: 8,
        name: 'Наталья Иванова',
        rating: 5,
        date: '2023-12-05',
        product: 'Samsung Galaxy Z Flip5',
        text: 'Искала где купить Samsung Galaxy Z Flip5 в рассрочку. В этом магазине предложили самые выгодные условия. Процесс оформления быстрый, никаких скрытых платежей. Телефон просто супер! Большое спасибо!',
        avatar: '/images/avatars/avatar8.jpg'
    },
    {
        id: 9,
        name: 'Артем Новиков',
        rating: 4,
        date: '2023-11-30',
        product: 'iPhone 14 Pro',
        text: 'Покупал iPhone 14 Pro. Магазин порадовал большим выбором и профессиональной консультацией. Рассрочку оформили быстро. Доставка немного задержалась, но телефон пришел в идеальном состоянии. Рекомендую!',
        avatar: '/images/avatars/avatar9.jpg'
    },
    {
        id: 10,
        name: 'Ольга Смирнова',
        rating: 5,
        date: '2023-11-25',
        product: 'Samsung Galaxy S23+',
        text: 'Прекрасный магазин! Купила Samsung Galaxy S23+ в рассрочку. Консультант помог с выбором, подробно рассказал о характеристиках. Одобрение рассрочки заняло буквально 20 минут. Очень довольна покупкой и сервисом!',
        avatar: '/images/avatars/avatar10.jpg'
    }
]

export default function Reviews() {
    return (
        <Box sx={{ py: 6, backgroundColor: 'background.default' }}>
            <Container>
                <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                        mb: 4,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: { xs: '2rem', md: '2.5rem' }
                    }}
                >
                    Отзывы наших клиентов
                </Typography>

                <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{
                        mb: 6,
                        textAlign: 'center',
                        maxWidth: 800,
                        mx: 'auto'
                    }}
                >
                    Мы ценим каждого клиента и стремимся предоставить лучший сервис. 
                    Ознакомьтесь с отзывами покупателей о нашем магазине.
                </Typography>

                <Grid container spacing={3}>
                    {reviews.map((review) => (
                        <Grid item xs={12} md={6} key={review.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                    },
                                }}
                                elevation={2}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar
                                            src={review.avatar}
                                            sx={{ width: 56, height: 56, mr: 2 }}
                                        />
                                        <Box>
                                            <Typography variant="h6" component="div">
                                                {review.name}
                                            </Typography>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                {format(new Date(review.date), 'd MMMM yyyy', { locale: ru })}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Rating value={review.rating} readOnly sx={{ mb: 1 }} />
                                    
                                    <Typography
                                        variant="subtitle1"
                                        color="primary"
                                        sx={{ mb: 1, fontWeight: 'medium' }}
                                    >
                                        {review.product}
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                    <Typography variant="body1" color="text.secondary" paragraph>
                                        {review.text}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    )
}
