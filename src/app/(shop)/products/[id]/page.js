import { Container, Box } from '@mui/material';
import { unstable_cache } from 'next/cache';
import ProductDetails from '@/entities/product/ui/product-details/ProductDetails';
import { getProductById, getAllProducts, getProductsByCategory } from '@/entities/product/model/products';
import { notFound, permanentRedirect } from 'next/navigation';
import {
  getProductSchema,
  getBreadcrumbSchema,
  SEO_INSTALLMENT_PHRASES,
  buildProductBreadcrumbs,
  DEFAULT_OG_IMAGE_PATH,
  getProductPageTitle,
  getProductPageDescription,
} from '@/shared/lib/seo';
import { JsonLd } from '@/shared/ui/seo';
import { toCatalogCard } from '@/entities/product/lib/pricing';
import { getCategoryById } from '@/entities/category/model/categories';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import { DEFAULT_CITY_SLUG, withCityPrefix } from '@/shared/config/city-routes';
import { parseProductSegment, productPublicPath, productPublicSegment } from '@/shared/lib/product-path';
import { getPageCity } from '@/entities/city/model/cities';
import { buildRegionalProductCopy } from '@/shared/lib/city-seo';
// Кэш metadata сбрасывается при изменениях товара в админке через revalidateTag('products').
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
  try {
    const products = await getAllProducts();
    return products.map((product) => ({
      id: productPublicSegment(product),
    }));
  } catch {
    // Сборка без доступной БД (Docker/CI) — страницы по id генерируются on-demand
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { id: raw } = await params;
  const parsed = parseProductSegment(raw);
  if (!parsed) {
    return { title: 'Продукт не найден', description: 'Запрашиваемый продукт не найден' };
  }
  try {
    const product = await getCachedProductById(parsed.id);

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
      imageUrl = `${siteUrl}${DEFAULT_OG_IMAGE_PATH}`;
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

    const city = await getPageCity();
    if (!city) {
      return { title: 'Страница не найдена', robots: { index: false, follow: false } };
    }
    const regional = buildRegionalProductCopy(product, city);
    const isDefault = !city.slug || city.slug === DEFAULT_CITY_SLUG;
    const pageUrl = `${siteUrl}${withCityPrefix(city.slug, productPublicPath(product))}`;
    const catLabel = (product.category || product.categoryId || '').toString();
    const title = isDefault ? getProductPageTitle(product) : regional.title;
    const description = isDefault ? getProductPageDescription(product) : regional.description;

    return {
      title: { absolute: title },
      description,
      keywords: [
        ...(regional.keywords || []),
        product.specifications?.brand,
        catLabel ? `купить ${catLabel.toLocaleLowerCase('ru')} в рассрочку в ${city.nameIn || city.name}` : null,
        ...SEO_INSTALLMENT_PHRASES,
        'техника',
        catLabel,
      ].filter(Boolean),
      openGraph: {
        title,
        description,
        type: 'website',
        locale: 'ru_BY',
        siteName: 'Технобар',
        url: pageUrl,
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
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: pageUrl,
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
  const { id: raw } = await Promise.resolve(params);
  const parsed = parseProductSegment(raw);
  if (!parsed) {
    notFound();
  }
  const product = await getCachedProductById(parsed.id);

  if (!product) {
    notFound();
  }

  const category =
    product.categoryId !== null && product.categoryId !== undefined
      ? await getCategoryById(product.categoryId).catch(() => null)
      : null;

  const city = await getPageCity();
  if (!city) {
    notFound();
  }
  const canonicalPath = withCityPrefix(city.slug, productPublicPath(product));
  if (parsed.segment !== productPublicSegment(product)) {
    permanentRedirect(canonicalPath);
  }
  const regional = buildRegionalProductCopy(product, city);
  const prefix = city.slug && city.slug !== DEFAULT_CITY_SLUG ? `/${city.slug}` : '';
  const productSchema = getProductSchema(product, {
    shippingRate: 0,
    pathPrefix: prefix,
    description: regional.description,
    nameIn: city.nameIn || city.name,
  });
  const breadcrumbs = buildProductBreadcrumbs(product, category, product.id, city.slug);
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbs);
  const categoryId = product.categoryId || product.category_id;
  const sameCategory = categoryId ? await getProductsByCategory(categoryId) : [];
  const similarProducts = (sameCategory || [])
    .filter((item) => String(item.id) !== String(product.id))
    .slice(0, 4)
    .map(toCatalogCard)
    .filter(Boolean);

  return (
    <>
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Box component="main" sx={{ flex: 1 }}>
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
          <ProductDetails
            product={product}
            breadcrumbs={breadcrumbs}
            similarProducts={similarProducts}
            cityIntro={regional.intro}
          />
        </Container>
      </Box>
    </>
  );
}
