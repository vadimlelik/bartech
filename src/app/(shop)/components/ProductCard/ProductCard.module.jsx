'use client';

import Link from 'next/link';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  return (
    <Link href={`/mt/${product.id}`} className={styles.card}>
      <img src={product.image} alt={product.title} className={styles.image} />
      <div className={styles.content}>
        <h2 className={styles.title}>{product.title}</h2>
        <span className={styles.price}>{product.price} руб.</span>
        <pre className={styles.description}>{product.description}</pre>
      </div>
    </Link>
  );
}
