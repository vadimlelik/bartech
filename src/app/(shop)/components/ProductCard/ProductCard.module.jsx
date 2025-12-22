'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ProductCard.module.css';
import { CURRENCY } from '@/config/constants';

/**
 * Оптимизированная карточка товара с мемоизацией
 * Использует React.memo для предотвращения лишних ререндеров
 */
function ProductCard({ product }) {
  // Мемоизируем форматированную цену
  const formattedPrice = useMemo(() => {
    if (!product?.price) return '0';
    return `${product.price.toFixed(CURRENCY.DECIMAL_PLACES)} ${CURRENCY.SYMBOL}`;
  }, [product?.price]);

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
        <span className={styles.price}>{formattedPrice}</span>
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
    prevProps.product?.title === nextProps.product?.title &&
    prevProps.product?.image === nextProps.product?.image
  );
});
