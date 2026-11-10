import {
  getInstallmentFaqSchema,
  SEO_INSTALLMENT_PHRASES,
  buildDefaultOpenGraphImages,
} from '@/shared/lib/seo';
import { JsonLd } from '@/shared/ui/seo';
import { SITE_URL as siteUrl } from '@/shared/config/site-url';
import InstallmentContent from './InstallmentContent';

const title = 'Рассрочка без переплат в Минске — Технобар';
const description =
  'Рассрочка на технику в Минске и по Беларуси: до 12 месяцев, взнос от 10%, без переплат по акциям. Технобар.';

export const metadata = {
  title: { absolute: title },
  description,
  keywords: [
    ...SEO_INSTALLMENT_PHRASES,
    'рассрочка минск',
    'купить смартфон в рассрочку минск',
    'купить ноутбук в рассрочку минск',
    'купить телевизор в рассрочку минск',
    'рассрочка без справки минск',
    'texnobar',
  ],
  openGraph: {
    title,
    description,
    type: 'article',
    url: `${siteUrl}/installment`,
    siteName: 'Технобар',
    locale: 'ru_BY',
    images: buildDefaultOpenGraphImages(),
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: `${siteUrl}/installment`,
  },
};

export default function Installment() {
  return (
    <>
      <JsonLd data={getInstallmentFaqSchema()} />
      <InstallmentContent />
    </>
  );
}
