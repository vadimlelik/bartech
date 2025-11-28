import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IoIosArrowForward } from 'react-icons/io';
import styles from './categoriesItem.module.css';

const CategoriesItem = ({ id, name, image, imageUrl }) => {
  // Поддержка как image (из базы), так и imageUrl (для обратной совместимости)
  const imageSrc = image || imageUrl;
  
  // Проверяем, что id не пустой
  if (!id || id === '') {
    return null;
  }
  
  return (
    <Link key={id} href={`/category/${id}`} className={styles.categoriesItem}>
      <span className={styles.categoriesName}>
        {name}
        <IoIosArrowForward className={styles.categoriesIcon} />
      </span>
      {imageSrc && (
        <Image
          src={imageSrc}
          width={400}
          height={300}
          layout="responsive"
          alt={name}
        />
      )}
    </Link>
  );
};

export default CategoriesItem;
