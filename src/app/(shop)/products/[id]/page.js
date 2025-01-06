import { Container, Box } from '@mui/material';
import ProductDetails from './ProductDetails';
import { getProductById } from '@/lib/products';
import { notFound } from 'next/navigation';

// Эта функция нужна для получения статических параметров при сборке
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { id } = await Promise.resolve(params);
  try {
    const product = await getProductById(id);

    if (!product) {
      return {
        title: 'Продукт не найден',
        description: 'Запрашиваемый продукт не найден',
      };
    }

    return {
      title: `${product.name} - Купить в магазине`,
      description:
        product.description || `Купить ${product.name} в Минске с доставкой`,
    };
  } catch (error) {
    'Error generating product metadata:', error;
    return {
      title: 'Ошибка',
      description: 'Произошла ошибка при загрузке продукта',
    };
  }
}

export default async function ProductPage({ params }) {
  const { id } = await Promise.resolve(params);
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Box component="main" sx={{ flex: 1 }}>
        <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh' }}>
          <ProductDetails product={product} />
        </Container>
      </Box>
    </>
  );
}
