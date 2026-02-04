import { Container, Box } from '@mui/material';
import { unstable_cache } from 'next/cache';
import ProductDetails from './ProductDetails';
import { getProductById } from '@/lib/products';
import { notFound } from 'next/navigation';
import { getProductSchema, getBreadcrumbSchema } from '@/lib/seo';
import { getAllProducts } from '@/lib/products-supabase-read';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://technobar.by';

// Кэшируем запросы к Supabase на 1 час для снижения нагрузки
const getCachedProductById = unstable_cache(
  async (id) => {
    return await getProductById(id);
  },
  ['product-by-id'],
  {
    revalidate: 3600,
    tags: ['products'],
  }
);

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await getAllProducts();

  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const product = await getCachedProductById(id);

    if (!product) {
      return {
        title: 'Продукт не найден',
        description: 'Запрашиваемый продукт не найден',
      };
    }

    const productImage =
      product.images && product.images.length > 0
        ? product.images[0]
        : product.image || '/logo_techno_bar.svg';

    // Обработка URL изображения
    let imageUrl;
    if (!productImage) {
      imageUrl = `${siteUrl}/logo_techno_bar.svg`;
    } else if (
      productImage.startsWith('http://') ||
      productImage.startsWith('https://')
    ) {
      imageUrl = productImage;
    } else if (productImage.startsWith('/')) {
      imageUrl = `${siteUrl}${productImage}`;
    } else {
      imageUrl = `${siteUrl}/${productImage}`;
    }

    const description =
      product.description ||
      `Купить ${product.name} в Минске с доставкой. ${product.specifications?.brand ? `Бренд: ${product.specifications.brand}.` : ''} Цена: ${product.price} BYN. Рассрочка без переплат.`;

    return {
      title: `${product.name} - Купить в Technobar`,
      description,
      keywords: [
        product.name,
        product.specifications?.brand,
        'купить в минске',
        'техника',
        product.category || product.categoryId,
      ].filter(Boolean),
      openGraph: {
        title: `${product.name} - Купить в Technobar`,
        description,
        type: 'website',
        url: `${siteUrl}/products/${id}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} - Купить в Technobar`,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `${siteUrl}/products/${id}`,
      },
    };
  } catch (error) {
    console.error('Error generating product metadata:', error);
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

  const productSchema = getProductSchema(product);

  // Breadcrumbs для продукта
  const breadcrumbs = [
    { name: 'Главная', url: '/' },
    ...(product.categoryId
      ? [{ name: product.categoryId, url: `/categories/${product.categoryId}` }]
      : []),
    { name: product.name, url: `/products/${id}` },
  ];
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbs);

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <Box component="main" sx={{ flex: 1 }}>
        <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh' }}>
          <ProductDetails product={product} />
        </Container>
      </Box>
    </>
  );
}
