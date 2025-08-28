'use client';

import { useEffect } from 'react';
import styles from './tvPage.module.css';

export default function CatalogPage() {
  useEffect(() => {
    const cards = document.querySelectorAll(`.${styles.card}`);

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.show);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <main className={styles.main}>
        {/* Первая карточка */}
        <div className={`${styles.card} ${styles.hidden}`}>
          <img src="https://via.placeholder.com/300x200" alt="Техника" />
          <div className={styles.cardContent}>
            <h2>Мы снизили цену в два раза!</h2>
            <p>Любая техника — рассрочка без переплат:</p>
            <ul>
              <li>Смарт-часы и гаджеты</li>
              <li>Крупная бытовая техника</li>
              <li>Аксессуары</li>
              <li>Игровые приставки</li>
              <li>Аудио</li>
            </ul>
            <p>Рассрочка — от 3 до 24 месяцев.</p>
          </div>
        </div>

        {/* Вторая карточка */}
        <div className={`${styles.card} ${styles.hidden}`}>
          <img src="https://via.placeholder.com/300x200" alt="Игры" />
          <div className={styles.cardContent}>
            <h2>Рассчитайте ежемесячный платеж прямо на сайте</h2>
            <ol>
              <li>Выберите технику из каталога</li>
              <li>Оставьте заявку за 3 минуты</li>
              <li>Получите решение онлайн</li>
            </ol>
            <p>✔ Рассрочка от магазинов без банка</p>
            <p>✔ До 24 мес.</p>
            <p>✔ Без скрытых комиссий</p>
          </div>
        </div>

        {/* Третья карточка */}
        <div className={`${styles.card} ${styles.hidden}`}>
          <img src="https://via.placeholder.com/300x200" alt="Телевизор" />
          <div className={styles.cardContent}>
            <h2>Характеристики</h2>
            <ul>
              <li>Производитель: Samsung</li>
              <li>Диагональ: 55&quot;</li>
              <li>Разрешение: 4K</li>
              <li>HDR: есть</li>
              <li>Smart TV: есть</li>
            </ul>
          </div>
        </div>
      </main>

      <div className={styles.bottomBtn}>
        <button>Узнать цену</button>
      </div>
    </div>
  );
}
