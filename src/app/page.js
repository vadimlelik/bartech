import { Container, Grid, Typography } from '@mui/material'
import CategoryCard from './components/CategoryCard'
import { getCategories } from '../lib/categories'

export const metadata = {
    title: 'Магазин телефонов - Главная страница',
    description: 'Купить телефоны различных брендов: iPhone, Samsung, Xiaomi и другие',
}

export default async function Home() {
    const categories = await getCategories()

    return (
        <main>
            <Container sx={{ py: 4, minHeight: '100vh' }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
                    Категории товаров
                </Typography>
                <Grid container spacing={4}>
                    {categories.map((category) => (
                        <Grid item xs={12} sm={6} md={4} key={category.id}>
                            <CategoryCard
                                id={category.id}
                                name={category.name}
                                image={category.image}
                                description={category.description}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </main>
    )
}
