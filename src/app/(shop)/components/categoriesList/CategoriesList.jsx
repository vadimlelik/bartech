import React from 'react';

import styles from './categoriesList.module.css';
import CategoriesItem from '../categoriesItem/CategoriesItem';

const CategoriesList = ({ list }) => {
  return (
    <div className={styles.categoriesList}>
      {list.map((category) => (
        <CategoriesItem key={category.id} {...category} />
      ))}
    </div>
  );
};

export default CategoriesList;
