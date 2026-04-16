'use client';

import React from 'react';
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
} from '@mui/material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

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
];

const yandexReviews = [
    {
        id: 101,
        name: 'Евгений Черепок',
        rating: 5,
        date: '2025-11-06',
        text: 'Покупал телефон себе, все понравилось. Менеджер помог получить одобрение в банке, брал в рассрочку на 36 месяцев. В подарок за опоздание дали повербанк.',
    },
    {
        id: 102,
        name: 'Вероника Когаль',
        rating: 5,
        date: '2025-10-31',
        text: 'Очень быстро доставили телевизор к дню рождения мамы, хотя стандартный срок был дольше. Спасибо за то, что пошли навстречу.',
    },
    {
        id: 103,
        name: 'Uladzislau S.',
        rating: 5,
        date: '2026-02-18',
        text: 'Заказал игровой компьютер. Консультант помог подобрать сборку под задачи, оформили быстро, доставка приехала через пару дней.',
    },
    {
        id: 104,
        name: 'Оксана Б.',
        rating: 5,
        date: '2025-10-02',
        text: 'Срочно нужен был телефон, подсказали модель и варианты рассрочки без первого взноса. Доставили без проблем, дали гарантию и подарок.',
    },
    {
        id: 105,
        name: 'Вероха С.',
        rating: 5,
        date: '2026-03-12',
        text: 'Купил PlayStation Pro. Доставили быстро и в удобное время, подробно рассказали про использование и пополнение.',
    },
    {
        id: 106,
        name: 'Мария Евсеенко',
        rating: 5,
        date: '2026-03-14',
        text: 'Покупала макбук через этот магазин. Быстро доставили и цена приятная, вышло дешевле, чем в других местах.',
    },
];

const yandexReviewsUrl =
    'https://yandex.by/maps/org/baratekh/34158043108/reviews/?ll=27.589392%2C53.926870&z=16';

export default function ReviewsContent() {
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

                <Box sx={{ mt: 8 }}>
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                            mb: 2,
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: { xs: '1.6rem', md: '2rem' },
                        }}
                    >
                        Отзывы с Яндекс Карт
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ textAlign: 'center', mb: 4 }}
                    >
                        Рейтинг на Яндекс Картах: 5.0 на основе 50+ оценок.
                        {' '}
                        <Box
                            component="a"
                            href={yandexReviewsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 600 }}
                        >
                            Смотреть все отзывы
                        </Box>
                    </Typography>

                    <Grid container spacing={3}>
                        {yandexReviews.map((review) => (
                            <Grid item xs={12} md={6} key={review.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                    elevation={0}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="h6" component="div">
                                                {review.name}
                                            </Typography>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                {format(new Date(review.date), 'd MMMM yyyy', { locale: ru })}
                                            </Typography>
                                        </Box>
                                        <Rating value={review.rating} readOnly sx={{ mb: 2 }} />
                                        <Typography variant="body1" color="text.secondary">
                                            {review.text}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}
