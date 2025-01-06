import { Container, Typography, Box } from '@mui/material';
import BackButton from './BackButton';
import ProductList from './ProductList';
import { getCategoryById } from '@/lib/categories';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { id } = await Promise.resolve(params);
  try {
    if (!id) {
      return {
        title: 'Категория не найдена',
        description: 'Категория не найдена',
      };
    }

    const category = await getCategoryById(id);

    if (!category) {
      return {
        title: 'Категория не найдена',
        description: 'Категория не найдена',
      };
    }

    return {
      title: `${category.name} - Bartech`,
      description: `Купить ${category.name.toLowerCase()} в Минске с доставкой`,
    };
  } catch (error) {
    return {
      title: 'Ошибка',
      description: 'Произошла ошибка при загрузке категории',
    };
  }
}

export default async function CategoryPage({ params }) {
  const { id } = await Promise.resolve(params);

  try {
    const category = await getCategoryById(id);

    if (!category) {
      notFound();
    }

    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
          <BackButton />
          <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2 }}>
            {category.name}
          </Typography>
          <ProductList categoryId={category.id} />
        </Container>
      </Box>
    );
  } catch (error) {
    'Error in CategoryPage:', error;
    throw error;
  }
}
