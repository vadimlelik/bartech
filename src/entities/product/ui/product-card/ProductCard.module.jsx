'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ProductCard.module.css';
import { CURRENCY } from '@/shared/config/constants';

/**
 * Оптимизированная карточка товара с мемоизацией
 * Использует React.memo для предотвращения лишних ререндеров
 */
function ProductCard({ product }) {
  const isProductInStock =
    (product?.availabilityStatus ||
      product?.availability_status ||
      'in_stock') !== 'on_order';

  // Мемоизируем форматированную цену
  const formattedPrice = useMemo(() => {
    const totalPrice = product?.totalPrice ?? product?.total_price;
    if (isProductInStock) {
      const price =
        Number(totalPrice) > 0
          ? Number(totalPrice)
          : Number(product?.price) || 0;
      if (price <= 0) return '';
      return `${price.toFixed(CURRENCY.DECIMAL_PLACES)} ${CURRENCY.SYMBOL}`;
    }
    if (!product?.price) return '';
    return `от ${product.price.toFixed(CURRENCY.DECIMAL_PLACES)} ${CURRENCY.SYMBOL}/мес.`;
  }, [
    isProductInStock,
    product?.price,
    product?.totalPrice,
    product?.total_price,
  ]);

  const formattedMonthlyPayment = useMemo(() => {
    const monthlyPayment = product?.monthlyPayment ?? product?.monthly_payment;
    if (!monthlyPayment || Number(monthlyPayment) <= 0) return '';
    return `от ${Number(monthlyPayment).toFixed(CURRENCY.DECIMAL_PLACES)} ${CURRENCY.SYMBOL}/мес.`;
  }, [product?.monthlyPayment, product?.monthly_payment]);

  // Мемоизируем URL товара
  const productUrl = useMemo(() => `/mt/${product.id}`, [product.id]);

  if (!product) {
    return null;
  }

  return (
    <Link href={productUrl} className={styles.card}>
      {product.image ? (
        <Image
          src={product.image}
          alt={product.title || 'Товар'}
          width={300}
          height={200}
          className={styles.image}
          loading="lazy"
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <div className={styles.imagePlaceholder}>
          <span>Нет изображения</span>
        </div>
      )}
      <div className={styles.content}>
        <h2 className={styles.title}>{product.title || 'Без названия'}</h2>
        {formattedPrice && (
          <span className={styles.price}>{formattedPrice}</span>
        )}
        {formattedMonthlyPayment && (
          <span className={styles.monthlyPayment}>
            {formattedMonthlyPayment}
          </span>
        )}
        {product.description && (
          <pre className={styles.description}>{product.description}</pre>
        )}
      </div>
    </Link>
  );
}

// Мемоизация компонента для предотвращения лишних ререндеров
// Сравниваем только id товара, так как это основное свойство
export default React.memo(ProductCard, (prevProps, nextProps) => {
  return (
    prevProps.product?.id === nextProps.product?.id &&
    prevProps.product?.price === nextProps.product?.price &&
    prevProps.product?.totalPrice === nextProps.product?.totalPrice &&
    prevProps.product?.total_price === nextProps.product?.total_price &&
    prevProps.product?.monthlyPayment === nextProps.product?.monthlyPayment &&
    prevProps.product?.monthly_payment === nextProps.product?.monthly_payment &&
    prevProps.product?.availabilityStatus ===
      nextProps.product?.availabilityStatus &&
    prevProps.product?.availability_status ===
      nextProps.product?.availability_status &&
    prevProps.product?.title === nextProps.product?.title &&
    prevProps.product?.image === nextProps.product?.image
  );
});
